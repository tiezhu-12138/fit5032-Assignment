<template>
  <div class="container">
    <div class="map-container">
      <div ref="mapRef" class="map"></div>
    </div>
    <div class="controls">
      <button @click="getCurrentLocation" class="action-button">Find Therapists Near Me</button>
      <div class="therapist-list">
        <div
          v-for="(therapist, index) in therapists"
          :key="index"
          :class="['therapist-item', { selected: selectedTherapist === therapist }]"
          @click="selectTherapist(therapist)"
        >
          <h3 class="therapist-name">{{ therapist.name }}</h3>
          <p>{{ therapist.vicinity }}</p>
        </div>
      </div>
      <button v-if="selectedTherapist" @click="getDirections" class="action-button">
        Get Directions to {{ selectedTherapist.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mapRef = ref(null)
const map = ref(null)
const currentLocation = ref(null)
const therapists = ref([])
const selectedTherapist = ref(null)
const directionsRenderer = ref(null)

onMounted(async () => {
  try {
    await loadGoogleMapsAPI()
    initMap()
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`
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
  if (navigator.geolocation) {
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
/* Set the background color to cover the entire viewport */
body {
  margin: 0;
  background-color: #f6f0e7;
}

/* Container styles */
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f6f0e7;
}

/* Map styles */
/* Shrink the map size */
.map-container {
  height: 50vh; /* Adjust the height as desired */
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

/* Controls styles */
.controls {
  padding: 16px; /* Equivalent to Tailwind 'p-4' */
  background-color: #395244;
  color: #f6f0e7;
  flex: 1; /* Make controls fill the remaining vertical space */
}

/* Buttons styles */
.action-button {
  width: 100%;
  background-color: #f6f0e7;
  color: #395244;
  padding: 8px 16px; /* Equivalent to Tailwind 'py-2 px-4' */
  border-radius: 4px; /* Equivalent to Tailwind 'rounded' */
  margin-bottom: 16px; /* Equivalent to Tailwind 'mb-4' */
  cursor: pointer;
  border: none;
}

.action-button:hover {
  background-color: #d8d2c9;
}

/* Therapist list styles */
.therapist-list {
  max-height: 160px; /* Equivalent to Tailwind 'max-h-40' */
  overflow-y: auto;
  margin-bottom: 16px; /* Equivalent to Tailwind 'mb-4' */
}

/* Therapist item styles */
.therapist-item {
  margin-bottom: 8px; /* Equivalent to Tailwind 'mb-2' */
  padding: 8px; /* Equivalent to Tailwind 'p-2' */
  cursor: pointer;
  border-radius: 4px; /* Equivalent to Tailwind 'rounded' */
  color: inherit;
  background-color: transparent;
}

.therapist-item:hover {
  background-color: rgba(246, 240, 231, 0.1); /* Light hover effect */
}

.therapist-item.selected {
  background-color: #f6f0e7;
  color: #395244;
}

/* Therapist name styles */
.therapist-name {
  font-weight: bold;
}
</style>
