<script setup>
import Rating from 'primevue/rating'
import { ref } from 'vue'

const rateMark = ref(0)
const averageRating = ref(0)

const submitRating = () => {
  const existingRatings = JSON.parse(localStorage.getItem('ratings')) || []
  existingRatings.push(rateMark.value)
  localStorage.setItem('ratings', JSON.stringify(existingRatings))
  calculateAverage()
}

const calculateAverage = () => {
  const ratings = JSON.parse(localStorage.getItem('ratings')) || []
  if (ratings.length > 0) {
    const sum = ratings.reduce((acc, rating) => acc + rating, 0)
    averageRating.value = (sum / ratings.length).toFixed(1)
  }
}
</script>

<template>
  <div>
    <h1>This is the home view.</h1>
    <div class="card flex justify-center">
      <Rating v-model="rateMark" @rate="submitRating" />
      <button @click="submitRating">Submit Rating</button>
    </div>
    <div>
      <h2>Average Rating: {{ averageRating }}</h2>
    </div>
  </div>
</template>
