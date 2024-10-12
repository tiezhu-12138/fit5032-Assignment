<template>
  <div class="mood-tracking-container">
    <!-- Mood Entry Form -->
    <div class="mood-entry">
      <h2>Record Your Mood</h2>
      <form @submit.prevent="addMoodEntry">
        <label for="mood">Mood (1-10):</label>
        <input type="number" id="mood" v-model.number="newMood.mood" min="1" max="10" required />

        <label for="notes">Notes:</label>
        <textarea id="notes" v-model="newMood.notes" placeholder="Optional"></textarea>

        <button type="submit" class="action-button">Submit</button>
      </form>
    </div>

    <!-- Time Period Tabs -->
    <div class="tabs">
      <button
        v-for="period in periods"
        :key="period.value"
        :class="['tab-button', { active: selectedPeriod === period.value }]"
        @click="selectPeriod(period.value)"
      >
        {{ period.label }}
      </button>
    </div>

    <!-- Mood Chart -->
    <div class="chart-container" v-if="chartData && chartData.labels && chartData.labels.length > 0">
      <Bar ref="moodChart" :data="chartData" :options="chartOptions" />
    </div>

    <!-- Export Button -->
    <button class="export-button" @click="exportChartToPDF">Export as PDF</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  registerables
} from 'chart.js'
import axios from 'axios'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/init.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ...registerables)

// const firebaseConfig = {
//   apiKey: 'import.meta.env.VITE_FIREBASE_API_KEY',
//   authDomain: 'fit5032project-a3ac5.firebaseapp.com',
//   projectId: 'fit5032project-a3ac5',
//   storageBucket: 'fit5032project-a3ac5.appspot.com',
//   messagingSenderId: '661781321631',
//   appId: '1:661781321631:web:7cb300fe83bc693b2f0faa',
//   measurementId: 'G-GF9YS45Y69'
// }

// const app = initializeApp(firebaseConfig)
// const auth = getAuth(app)
const userId = ref(null)

onAuthStateChanged(auth, (user) => {
  if (user) {
    userId.value = user.uid
    loadMoodEntries()
  } else {
    console.error('User not authenticated')
  }
})

const newMood = ref({
  mood: null,
  notes: ''
})

const moodEntries = ref([])

const periods = [
  { label: '1 Week', value: 'week' },
  { label: 'Fortnight', value: 'fortnight' },
  { label: 'Month', value: 'month' }
]

const selectedPeriod = ref('week')

const addMoodEntry = async () => {
  if (!userId.value) {
    console.error('User not authenticated');
    return;
  }

  const auth = getAuth();
  const idToken = await auth.currentUser.getIdToken();

  const entry = {
    mood: newMood.value.mood,
    notes: newMood.value.notes,
  };

  try {
    await axios.post('https://addmoodentry-zhlxrzxjda-uc.a.run.app', entry, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    await loadMoodEntries();
    newMood.value.mood = null;
    newMood.value.notes = '';
  } catch (error) {
    console.error('Error adding mood entry:', error);
  }
};

const selectPeriod = (period) => {
  selectedPeriod.value = period
}

const loadMoodEntries = async () => {
  if (!userId.value) {
    console.error('User not authenticated');
    return;
  }

  const auth = getAuth();
  const idToken = await auth.currentUser.getIdToken();

  try {
    const response = await axios.get(
      'https://getmoodentries-zhlxrzxjda-uc.a.run.app',
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    moodEntries.value = response.data.map((entry) => ({
      ...entry,
      date: new Date(entry.date),
    }));
  } catch (error) {
    console.error('Error loading mood entries:', error);
  }
};

const filteredMoodEntries = computed(() => {
  const allEntries = moodEntries.value || []
  const now = new Date()
  let days = 7
  if (selectedPeriod.value === 'fortnight') days = 14
  else if (selectedPeriod.value === 'month') days = 30

  return allEntries.filter((entry) => {
    if (!entry.date) return false
    const diffTime = now - entry.date
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    return diffDays <= days
  })
})

const chartData = computed(() => {
  const entries = filteredMoodEntries.value || []
  const labels = entries.map((entry) => entry.date.toLocaleDateString())
  const dataPoints = entries.map((entry) => entry.mood)

  const result = {
    labels: labels.reverse(),
    datasets: [
      {
        label: 'Mood Score',
        backgroundColor: '#395244',
        data: dataPoints.reverse()
      }
    ]
  }

  return result
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 10,
      ticks: {
        stepSize: 1
      }
    }
  }
}

// Function to export chart to PDF
const exportChartToPDF = async () => {
  const chartElement = document.querySelector('.chart-container')

  if (chartElement) {
    try {
      const canvas = await html2canvas(chartElement)
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: [canvas.width, canvas.height]
      })
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save('mood_chart.pdf')
    } catch (error) {
      console.error('Error exporting chart to PDF:', error)
    }
  }
}
</script>

<style scoped>
/* Container styles */
.mood-tracking-container {
  background-color: #f6f0e7;
  color: #395244;
  padding: 20px;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Mood entry form styles */
.mood-entry {
  margin-bottom: 30px;
}

.mood-entry h2 {
  margin-bottom: 15px;
}

.mood-entry form {
  display: flex;
  flex-direction: column;
}

.mood-entry label {
  margin-bottom: 5px;
}

.mood-entry input[type='number'],
.mood-entry textarea {
  margin-bottom: 15px;
  padding: 8px;
  border: 1px solid #395244;
  border-radius: 4px;
  background-color: #fff;
  color: #395244;
}

.mood-entry textarea {
  resize: vertical;
  min-height: 80px;
}

.action-button {
  width: 150px;
  background-color: #395244;
  color: #f6f0e7;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}

.action-button:hover {
  background-color: #2e4236;
}

/* Tabs styles */
.tabs {
  display: flex;
  margin-bottom: 20px;
}

.tab-button {
  background-color: transparent;
  color: #395244;
  padding: 10px 20px;
  border: 1px solid #395244;
  border-bottom: none;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  margin-right: 5px;
}

.tab-button.active {
  background-color: #395244;
  color: #f6f0e7;
}

/* Chart container styles */
.chart-container {
  position: relative;
  height: 300px;
}

/* Export button styles */
.export-button {
  margin-top: 20px;
  background-color: #395244;
  color: #f6f0e7;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}

.export-button:hover {
  background-color: #2e4236;
}
</style>
