<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main content -->
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <h1 class="text-4xl font-bold text-center text-gray-900 mb-4">MINDBRIDGE reviews</h1>
          <div class="flex justify-center items-center mb-8">
            <span class="text-3xl font-bold text-green-600 mr-2">{{ averageRating.toFixed(1) }}</span>
            <Rating v-model="averageRating" :readonly="true" :cancel="false" />
            <span class="ml-2 text-gray-600">({{ reviews.length }} reviews)</span>
          </div>
          <p class="text-center text-gray-600 mb-8">
            These quotes represent a few of the many positive reviews that we have received for therapists who work with MINDBRIDGE.
            <span class="inline-block w-5 h-5 bg-green-500 rounded-full text-white text-center">i</span>
          </p>

          <!-- New Review Form -->
          <div class="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Leave a Review</h2>
            <div class="card flex justify-center mb-4">
              <Rating v-model="newRating" :cancel="false" />
            </div>
            <div class="mb-4">
              <label for="review-comment" class="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
              <textarea
                id="review-comment"
                v-model="comment"
                rows="4"
                class="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Share your experience..."
              ></textarea>
            </div>
            <button
              @click="submitReview"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Submit Review
            </button>
          </div>

          <div class="bg-green-800 rounded-t-3xl pt-16 pb-4 px-4">
            <h2 class="text-2xl font-semibold text-white text-center mb-8">MINDBRIDGE reviews from {{ currentDate }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="review in reviews" :key="review.id" class="bg-white rounded-lg shadow-lg p-6">
                <div class="flex items-start mb-4">
                  <span class="text-6xl text-green-600 leading-none">"</span>
                  <p class="text-gray-800 text-lg">{{ review.quote }}</p>
                </div>
                <div class="flex items-center mb-2">
                  <img :src="review.therapistImage" :alt="review.therapistName" class="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h3 class="font-semibold text-green-700">{{ review.therapistName }}</h3>
                    <a href="#" class="text-green-600 hover:underline">More reviews</a>
                  </div>
                </div>
                <Rating v-model="review.rating" :readonly="true" :cancel="false" />
                <p class="mt-4 text-sm text-gray-600">{{ review.details }}</p>
                <p class="mt-2 text-xs text-gray-500">MINDBRIDGE review #{{ review.id }}</p>
                <p class="text-xs text-gray-500">Date of review • {{ review.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Rating from 'primevue/rating'

const reviews = ref([
  {
    id: 593144,
    quote: "Kathryn has taught me so much about myself and really opened my eyes. I'm so happy I signed up for MINDBRIDGE and got paired with her. It has felt so natural speaking with her and not forced. She is...",
    therapistName: "Kathryn Bondura, LCSW",
    therapistImage: "/placeholder.svg?height=48&width=48",
    details: "Review written after working with Kathryn Bondura for 1 month on issues concerning depression, stress, anxiety, relationship issues, family conflicts, trauma and abuse, grief,...",
    date: "September 26, 2024",
    rating: 5
  },
  {
    id: 593143,
    quote: "very smart and skilled",
    therapistName: "Christine McInnes, BACP",
    therapistImage: "/placeholder.svg?height=48&width=48",
    details: "Review written after working with Christine McInnes for 1 year and 4 months on issues concerning depression, stress, anxiety, addictions, relationship issues, family conflict...",
    date: "September 26, 2024",
    rating: 4
  },
  {
    id: 593142,
    quote: "Vicky has been brilliant. Every step of my journey she has listened and understood and I am now at a point of being myself again. Thank you for everything.",
    therapistName: "Bupinderjeet (aka Vicky) Kooner, BACP",
    therapistImage: "/placeholder.svg?height=48&width=48",
    details: "Review written after working with Bupinderjeet (aka Vicky) Kooner for 7 months on issues concerning relationship issues, self esteem, coping with life changes, and coaching",
    date: "September 26, 2024",
    rating: 5
  },
  {
    id: 593141,
    quote: "Susan is respectful, offers insight, asks good questions for my consideration, and is supportive of my journey.",
    therapistName: "Susan Dunn",
    therapistImage: "/placeholder.svg?height=48&width=48",
    details: "Review written after working with Susan Dunn for 2 weeks on issues concerning depression, stress, anxiety, addictions, relationship issues, family conflicts, trauma and abuse, intimacy-related issues, eating disorders, sleeping disorders, parenting issues, anger management, self esteem, career difficulties, coping with life changes, compassion fatigue, ADHD",
    date: "September 26, 2024",
    rating: 4
  }
])

const newRating = ref(0)
const comment = ref('')

const averageRating = computed(() => {
  const total = reviews.value.reduce((sum, review) => sum + review.rating, 0)
  return total / reviews.value.length
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

const submitReview = () => {
  if (newRating.value === 0 || comment.value.trim() === '') {
    alert('Please provide both a rating and a comment before submitting.')
    return
  }

  const newReview = {
    id: Date.now(),
    quote: comment.value,
    therapistName: "Anonymous User",
    therapistImage: "/placeholder.svg?height=48&width=48",
    details: `Review submitted with a rating of ${newRating.value} stars.`,
    date: currentDate.value,
    rating: newRating.value
  }

  reviews.value.unshift(newReview)
  newRating.value = 0
  comment.value = ''

  alert('Thank you for your review!')
}
</script>

<style>
/* PrimeVue CSS */


/* Custom styles for the Rating component */
.p-rating .p-rating-item.p-rating-item-active .p-rating-icon {
  color: #10B981;
}

.p-rating .p-rating-item .p-rating-icon {
  font-size: 1.5rem;
}

/* Custom styles for the review cards */
.bg-green-800 {
  background-color: #065F46;
}

.text-green-600 {
  color: #059669;
}

.text-green-700 {
  color: #047857;
}

/* Hover effect for review cards */
.bg-white.rounded-lg:hover {
  transform: translateY(-5px);
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Responsive font sizes */
@media (max-width: 640px) {
  .text-4xl {
    font-size: 2.5rem;
  }
  .text-2xl {
    font-size: 1.75rem;
  }
}

/* Smooth scrolling for the whole page */
html {
  scroll-behavior: smooth;
}
</style>