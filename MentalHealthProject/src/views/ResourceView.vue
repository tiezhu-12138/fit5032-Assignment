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
      <button @click="getCurrentLocation" class="action-button">Find Therapists Near Me</button>
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
      <button v-if="selectedTherapist" @click="getDirections" class="action-button">
        Get Directions to {{ selectedTherapist.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

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

const fetchWeatherData = async (latitude, longitude) => {
  const apikey = 'import.meta.env.VITE_OPENWEATHER_API_KEY' 
  try {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`
    const response = await axios.get(url)
    weatherData.value = response.data
  } catch (error) {
    console.error('Error fetching weather data:', error)
  }
}

onMounted(async () => {
  try {
    await loadGoogleMapsAPI()
    initMap()
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          currentLocation.value = pos
          fetchWeatherData(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error('Error getting current location:', error)
        }
      )
    } else {
      console.error("Error: Your browser doesn't support geolocation.")
    }
  } catch (error) {
    console.error('Error loading Google Maps:', error)
  }
})

function loadGoogleMapsAPI() {
  return new Promise((resolve, reject) => {
    if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
      resolve()
      return
    }
    const script = document.createElement('script')
    const googleMapAPI = 'import.meta.env.VITE_GOOGLE_MAPS_API_KEY'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapAPI}&libraries=places` 
    script.async = true
    script.defer = true
    script.onload = () => {
      resolve()
    }
    script.onerror = (e) => {
      reject(e)
    }
    document.head.appendChild(script)
  })
}

const initMap = () => {
  const mapInstance = new google.maps.Map(mapRef.value, {
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
  map.value = mapInstance

  const directionsRendererInstance = new google.maps.DirectionsRenderer()
  directionsRendererInstance.setMap(mapInstance)
  directionsRenderer.value = directionsRendererInstance
}

const getCurrentLocation = () => {
  if (currentLocation.value) {
    // Use existing current location
    map.value.setCenter(currentLocation.value)
    new google.maps.Marker({
      position: currentLocation.value,
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
    searchNearbyTherapists(currentLocation.value)
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
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
        searchNearbyTherapists(pos)
      },
      () => {
        console.error('Error: The Geolocation service failed.')
      }
    )
  } else {
    console.error("Error: Your browser doesn't support geolocation.")
  }
}

const searchNearbyTherapists = (location) => {
  const service = new google.maps.places.PlacesService(map.value)
  service.nearbySearch(
    {
      location: location,
      radius: 5000,
      type: ['health'],
      keyword: 'psychologist OR psychiatrist'
    },
    (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        therapists.value = results
        results.forEach((place) => {
          new google.maps.Marker({
            position: place.geometry.location,
            map: map.value,
            title: place.name,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }
          })
        })
      }
    }
  )
}

const selectTherapist = (therapist) => {
  selectedTherapist.value = therapist
}

const getDirections = () => {
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
        console.error('Error: Unable to calculate directions.')
      }
    }
  )
}
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
