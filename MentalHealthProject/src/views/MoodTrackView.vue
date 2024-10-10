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
    <div class="chart-container">
      <Bar :chart-data="chartData" :options="chartOptions" />
    </div>
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
  LinearScale
} from 'chart.js'
import axios from 'axios'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const firebaseConfig = {
  apiKey: 'AIzaSyBLHD0QlApXB4u7elS5FH2vIayove07BXA',
  authDomain: 'fit5032project-a3ac5.firebaseapp.com',
  projectId: 'fit5032project-a3ac5',
  storageBucket: 'fit5032project-a3ac5.appspot.com',
  messagingSenderId: '661781321631',
  appId: '1:661781321631:web:7cb300fe83bc693b2f0faa',
  measurementId: 'G-GF9YS45Y69'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const userId = ref(null)

onAuthStateChanged(auth, (user) => {
  if (user) {
    userId.value = user.uid
    loadMoodEntries()
  } else {
    // Handle user not logged in
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
    console.error('User not authenticated')
    return
  }
  const entry = {
    mood: newMood.value.mood,
    notes: newMood.value.notes,
    userId: userId.value
  }
  try {
    await axios.post('https://addmoodentry-zhlxrzxjda-uc.a.run.app', entry)
    // Reload entries after adding new one
    await loadMoodEntries()
    // Reset form
    newMood.value.mood = null
    newMood.value.notes = ''
  } catch (error) {
    console.error('Error adding mood entry:', error)
  }
}

const selectPeriod = (period) => {
  selectedPeriod.value = period
}

const loadMoodEntries = async () => {
  if (!userId.value) {
    console.error('User not authenticated')
    return
  }
  try {
    const response = await axios.get('https://getmoodentries-zhlxrzxjda-uc.a.run.app', {
      params: {
        userId: userId.value
      }
    })
    // Convert Firestore timestamps to JS Date objects
    moodEntries.value = response.data.map((entry) => ({
      ...entry,
      date: new Date(entry.date._seconds * 1000)
    }))
  } catch (error) {
    console.error('Error loading mood entries:', error)
  }
}

const filteredMoodEntries = computed(() => {
  const now = new Date()
  let days = 7
  if (selectedPeriod.value === 'fortnight') days = 14
  else if (selectedPeriod.value === 'month') days = 30

  return moodEntries.value.filter((entry) => {
    const diffTime = now - entry.date
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    return diffDays <= days
  })
})

const chartData = computed(() => {
  const labels = filteredMoodEntries.value.map((entry) => entry.date.toLocaleDateString())
  const data = filteredMoodEntries.value.map((entry) => entry.mood)

  return {
    labels: labels.reverse(), // Reverse to show chronological order
    datasets: [
      {
        label: 'Mood Score',
        backgroundColor: '#395244',
        data: data.reverse()
      }
    ]
  }
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
</style>
