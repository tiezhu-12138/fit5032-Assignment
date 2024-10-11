<template>
  <div class="container">
    <!-- Main content -->
    <main>
      <div class="content">
        <!-- Updated Title -->
        <h1 class="title">Reviews</h1>

        <!-- Centered Rating Form -->
        <div class="rating-form">
          <h2 class="subtitle">Rate Our Page</h2>
          <!-- Centered Stars -->
          <div class="star-container">
            <Rating v-model="newRating" :cancel="false" />
          </div>
          <div class="mb-4">
            <label for="review-comment" class="form-label">Your Comment (Optional)</label>
            <textarea
              id="review-comment"
              v-model="reviewContent"
              rows="4"
              class="form-control"
              placeholder="Share your thoughts..."
            ></textarea>
          </div>
          <button @click="submitRating" class="btn-submit">
            Submit Rating
          </button>
        </div>

        <!-- Ratings Table -->
        <div class="ratings-table">
          <DataTable
            :value="ratings"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5,10,20]"
            :filters="filters"
            :filterDisplay="'row'"
            :responsiveLayout="'scroll'"
            class="p-datatable-striped"
          >
            <Column field="serialNumber" header="#" sortable></Column>
            <Column field="comment" header="Comment" filter filterPlaceholder="Search by comment"></Column>
            <Column field="rating" header="Rating" sortable>
              <template #body="slotProps">
                <Rating :value="slotProps.data.rating" :readonly="true" :cancel="false" />
              </template>
            </Column>
            <Column field="date" header="Date" sortable filter filterPlaceholder="Search by date">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.date) }}
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Rating from 'primevue/rating'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import axios from 'axios'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { auth } from '../firebase/init.js'

const ratings = ref([])
const newRating = ref(0)
const reviewContent = ref('')

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  reviewContent: { value: null, matchMode: 'contains' },
  date: { value: null, matchMode: 'contains' },
})

const userID = ref(null)

const fetchRatings = async () => {
  try {
    const response = await axios.get('https://us-central1-fit5032project-a3ac5.cloudfunctions.net/getReviews')
    if (response.data.success) {
      ratings.value = response.data.ratings.map((rating, index) => ({
        serialNumber: index + 1,
        ...rating,
      }))
    } else {
      alert('Failed to fetch ratings: ' + response.data.error)
    }
  } catch (error) {
    console.error('Error fetching ratings:', error)
    alert('Error fetching ratings: ' + error.message)
  }
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      userID.value = user.uid
      console.log('Anonymous user signed in:', user.uid)
    } else {
      // No user is signed in, sign in anonymously
      signInAnonymously(auth)
        .then((userCredential) => {
          userID.value = userCredential.user.uid
          console.log('Signed in anonymously:', userID.value)
        })
        .catch((error) => {
          console.error('Error signing in anonymously:', error)
        })
    }
  })

  fetchRatings()
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US')
}

const submitRating = async () => {
  if (newRating.value === 0) {
    alert('Please provide a rating before submitting.')
    return
  }

  if (!userID.value) {
    alert('Unable to obtain user ID. Please try again later.')
    return
  }

  // If comment is empty, set it to "No comment"
  const commentText = reviewContent.value.trim() === '' ? 'No comment' : reviewContent.value.trim()

  try {
    const response = await axios.post('https://us-central1-fit5032project-a3ac5.cloudfunctions.net/addReview', {
      rating: newRating.value,
      reviewContent: commentText,
      userId: userID.value,
    })

    if (response.data.success) {
      // Add the new rating to the list
      ratings.value.unshift({
        serialNumber: ratings.value.length + 1,
        id: response.data.ratingId,
        rating: newRating.value,
        reviewContent: commentText,
        date: new Date().toISOString(),
      })
      newRating.value = 0
      reviewContent.value = ''
      alert('Thank you for your rating!')
    } else {
      alert('Failed to submit rating: ' + response.data.error)
    }
  } catch (error) {
    console.error('Error submitting rating:', error)
    alert('Error submitting rating: ' + error.message)
  }
}
</script>

<style>
/* Styles for the container and content */
.container {
  background-color: #395244;
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
  padding: 20px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #F6F0E7;
  padding: 20px;
  border-radius: 10px;
}

/* Updated Title */
.title {
  text-align: center;
  color: #000; /* Changed to black */
  margin-bottom: 20px;
  font-weight: bold; /* Made bold */
}

/* Subtitle */
.subtitle {
  color: #395244;
  margin-bottom: 10px;
  text-align: center;
}

/* Centered Rating Form */
.rating-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  margin: 0 auto 20px auto;
  max-width: 600px;
  text-align: center;
}

/* Center the stars */
.star-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 5px;
  color: #395244;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn-submit {
  background-color: #395244;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #45a049;
}

/* Ratings table styles */
.ratings-table {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
}

/* PrimeVue DataTable customization */
.p-datatable .p-datatable-thead > tr > th {
  background-color: #F6F0E7;
  color: #395244;
}

.p-datatable .p-datatable-tbody > tr > td {
  color: #333;
}

.p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
  background-color: #395244;
  border-color: #395244;
}

.p-paginator .p-paginator-pages .p-paginator-page:hover {
  background-color: #45a049;
  border-color: #45a049;
}

.p-datatable .p-datatable-thead > tr > th,
.p-datatable .p-datatable-tbody > tr > td {
  text-align: center;
}
</style>
