<template>
  <div>
    <!-- Upper part with background color #395244 and heart-warming sentence -->
    <div class="upper-section">
      <h1 class="heartwarming-text">
        You are stronger than you think, and you are never alone.
      </h1>
    </div>

    <!-- Lower part with ChatGPT integration and background color #F6F0E7 -->
    <div class="lower-section">
      <div class="messages">
        <div
          v-for="(message, index) in chatMessages"
          :key="index"
          :class="['message', message.sender.toLowerCase()]"
        >
          <strong>{{ message.sender }}:</strong> {{ message.text }}
        </div>
      </div>

      <div class="input-area">
        <input
          v-model="chatInput"
          type="text"
          placeholder="Type your message..."
          class="chat-input"
          @keyup.enter="sendMessage"
        />

        <button
          @click="sendMessage"
          class="send-button"
          @mouseover="handleMouseOver($event)"
          @mouseout="handleMouseOut($event)"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OpenAI from 'openai';

// Reactive references for chat input and messages
const chatInput = ref('')
const chatMessages = ref([])

// Function to handle mouse over event on the send button
const handleMouseOver = (event) => {
  event.target.style.backgroundColor = '#F6F0E7'
  event.target.style.color = '#395244'
}

// Function to handle mouse out event on the send button
const handleMouseOut = (event) => {
  event.target.style.backgroundColor = '#395244'
  event.target.style.color = '#F6F0E7'
}

// Function to send message to ChatGPT API
const sendMessage = async (event) => {
  // Prevent default form submission behavior if event is provided
  if (event) {
    event.preventDefault()
  }

  const userMessage = chatInput.value.trim()
  if (!userMessage) return

  // Add user's message to chat history
  chatMessages.value.push({ sender: 'User', text: userMessage })
  chatInput.value = ''

  try {
    // Make API call to OpenAI ChatGPT
    const openai = new OpenAI({ apiKey: import.meta.env.VITE_CHATGPT_API_KEY, dangerouslyAllowBrowser: true  });
    const response = await fetch('https://api.openai.com/v1/assistants', {
      method: 'POST',
      headers: {
        'OpenAI-Beta': 'assistants=v2',
        'Content-Type': 'application/json',
        // Correctly interpolate the API key and add 'Bearer' prefix
        'Authorization': `Bearer ${import.meta.env.VITE_CHATGPT_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4", // You can switch to 'gpt-4' if you have access
        // messages: [
        //   { role: 'system', content: 'You are a helpful assistant.' },
        //   { role: 'user', content: userMessage }
        // ],
      })
    })

    // Check if the response is OK (status code 2xx)
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error.message || 'API request failed')
    }

    const data = await response.json()
    const botMessage = data.choices[0].message.content.trim()

    // Add ChatGPT's response to chat history
    chatMessages.value.push({ sender: 'ChatGPT', text: botMessage })
  } catch (error) {
    console.error('Error fetching ChatGPT response:', error)
    chatMessages.value.push({
      sender: 'Error',
      text: error.message || 'Failed to fetch response from ChatGPT.'
    })
  }
}
</script>

<style scoped>
.upper-section {
  background-color: #395244;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.heartwarming-text {
  color: #F6F0E7;
  font-weight: bold;
  text-align: center;
  padding: 0 20px;
}

.lower-section {
  background-color: #F6F0E7;
  height: 50vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.messages {
  overflow-y: auto;
  flex-grow: 1;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 10px;
}

.message.user {
  color: #395244;
}

.message.chatgpt {
  color: #000000;
}

.message.error {
  color: #ff0000;
}

.input-area {
  display: flex;
  align-items: center;
}

.chat-input {
  width: 80%;
  padding: 10px;
  border-radius: 15px;
  border: 1px solid #395244;
  outline: none;
}

.send-button {
  padding: 10px 20px;
  margin-left: 10px;
  background-color: #395244;
  color: #F6F0E7;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.send-button:hover {
  background-color: #F6F0E7;
  color: #395244;
}
</style>
