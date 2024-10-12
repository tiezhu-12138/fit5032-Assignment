<template>
  <!-- Weather Display -->
  <div v-if="weatherData" class="weather-container">
    <h2>
      {{ weatherData.name }}, {{ weatherData.sys.country }}
    </h2>
    <div>
      <img :src="iconUrl" alt="Weather Icon" />
      <p>{{ temperature }} °C</p>
    </div>
    <span>{{ weatherData.weather[0].description }}</span>
  </div>

  <div class="container">
    <div class="map-container">
      <div ref="mapRef" class="map"></div>
    </div>
    <div class="controls">
      <button @click="handleGetCurrentLocation" class="action-button">Find Therapists Near Me</button>
      <div class="therapist-list">
        <table class="therapist-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <!-- Add more columns as needed -->
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(therapist, index) in therapists"
              :key="index"
              :class="{ selected: selectedTherapist === therapist }"
              @click="selectTherapist(therapist)"
            >
              <td>{{ therapist.name }}</td>
              <td>{{ therapist.vicinity }}</td>
              <!-- Add more cells as needed -->
            </tr>
          </tbody>
        </table>
      </div>
      <button v-if="selectedTherapist" @click="handleGetDirections" class="action-button">
        Get Directions to {{ selectedTherapist.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { Loader } from '@googlemaps/js-api-loader'

// References and Reactive Variables
const mapRef = ref(null)
const map = ref(null)
const currentLocation = ref(null)
const therapists = ref([])
const selectedTherapist = ref(null)
const directionsRenderer = ref(null)

// Weather Data
const weatherData = ref(null)
const temperature = computed(() => {
  return weatherData.value ? Math.round(weatherData.value.main.temp) : null
})
const iconUrl = computed(() => {
  return weatherData.value ? `http://openweathermap.org/img/w/${weatherData.value.weather[0].icon}.png` : null
})

// Initialize Google Map
const initializeMap = () => {
  if (!google || !google.maps) {
    console.error('Google Maps API is not loaded.')
    return
  }

  map.value = new google.maps.Map(mapRef.value, {
    center: { lat: 0, lng: 0 },
    zoom: 14,
    styles: [
      {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [{ color: '#F6F0E7' }]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#395244' }]
      }
    ]
  })

  directionsRenderer.value = new google.maps.DirectionsRenderer()
  directionsRenderer.value.setMap(map.value)
}

// Fetch Weather Data
const fetchWeatherData = async (latitude, longitude) => {
  const apikey = import.meta.env.VITE_OPENWEATHER_API_KEY
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`
    const response = await axios.get(url)
    weatherData.value = response.data
  } catch (error) {
    console.error('Error fetching weather data:', error)
  }
}

// Fetch Nearby Therapists
const fetchNearbyTherapists = async (latitude, longitude) => {
  try {
    const service = new google.maps.places.PlacesService(map.value)
    service.nearbySearch(
      {
        location: { lat: latitude, lng: longitude },
        radius: 5000,
        type: ['health'],
        keyword: 'psychologist OR psychiatrist'
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          therapists.value = results
          addTherapistMarkers(results)
        } else {
          console.error('Error searching nearby therapists:', status)
        }
      }
    )
  } catch (error) {
    console.error('Error fetching therapists:', error)
  }
}

// Add Markers for Therapists on the Map
const addTherapistMarkers = (therapistList) => {
  therapistList.forEach((therapist) => {
    new google.maps.Marker({
      position: therapist.geometry.location,
      map: map.value,
      title: therapist.name,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
      }
    })
  })
}

// Fetch Directions
const fetchDirections = async (destination) => {
  if (!currentLocation.value || !selectedTherapist.value) return

  const directionsService = new google.maps.DirectionsService()
  directionsService.route(
    {
      origin: currentLocation.value,
      destination: selectedTherapist.value.geometry.location,
      travelMode: google.maps.TravelMode.DRIVING
    },
    (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.value.setDirections(result)
      } else {
        console.error('Error: Unable to calculate directions.', status)
      }
    }
  )
}

// Handle Get Current Location
const handleGetCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        currentLocation.value = pos
        map.value.setCenter(pos)
        new google.maps.Marker({
          position: pos,
          map: map.value,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#395244',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#F6F0E7'
          }
        })
        await fetchWeatherData(pos.lat, pos.lng)
        await fetchNearbyTherapists(pos.lat, pos.lng)
      },
      (error) => {
        console.error('Error getting current location:', error)
      }
    )
  } else {
    console.error("Error: Your browser doesn't support geolocation.")
  }
}

// Select a Therapist from the List
const selectTherapist = (therapist) => {
  selectedTherapist.value = therapist
}

// Handle Get Directions
const handleGetDirections = async () => {
  if (!currentLocation.value || !selectedTherapist.value) return
  await fetchDirections(selectedTherapist.value.geometry.location)
}

// Load Google Maps API and Initialize Map on Mounted
onMounted(async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: 'weekly',
    libraries: ['places']
  })

  try {
    await loader.load()
    initializeMap()
    // Optionally, you can automatically get the current location on mount
    // handleGetCurrentLocation()
  } catch (error) {
    console.error('Error loading Google Maps:', error)
  }
})
</script>

<style scoped>
/* Ensure html and body elements cover the full height */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #f6f0e7;
}

/* Weather Container styles */
.weather-container {
  padding: 16px;
  background-color: #f6f0e7;
  color: #395244;
  text-align: center;
}

/* Container styles */
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f6f0e7;
}

/* Map styles */
.map-container {
  height: 50vh;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

/* Controls styles */
.controls {
  padding: 16px;
  background-color: #395244;
  color: #f6f0e7;
  flex: 1;
  overflow-x: hidden; /* Hide overflow on X-axis to prevent horizontal scroll on the controls container */
}

/* Buttons styles */
.action-button {
  width: 100%;
  background-color: #f6f0e7;
  color: #395244;
  padding: 8px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  cursor: pointer;
  border: none;
}

.action-button:hover {
  background-color: #d8d2c9;
}

/* Therapist list styles */
.therapist-list {
  overflow-x: auto; /* Allow horizontal scrolling */
  margin-bottom: 16px;
}

.therapist-table {
  width: 120%; /* Set table width greater than 100% */
  border-collapse: collapse;
}

.therapist-table th, .therapist-table td {
  border: 1px solid #ccc;
  padding: 8px;
  color: inherit;
}

.therapist-table th {
  background-color: #f6f0e7;
  color: #395244;
}

.selected {
  background-color: #f6f0e7;
  color: #395244;
}
</style>

