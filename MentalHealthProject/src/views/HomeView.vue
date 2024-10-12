<template>
  <div>
    <!-- Upper part with background color #395244 and heart-warming sentence -->
    <div class="upper-section">
      <h1 class="heartwarming-text">
        You are stronger than you think, and you are never alone.
      </h1>
    </div>

    <!-- Lower part with ChatGPT integration, slogan, and background color #F6F0E7 -->
    <div class="lower-section">
      <!-- Slogan in the center of the lower half -->
      <div class="slogan">
        <h2>Need someone to talk to? We're here for you.</h2>
        <p>Your well-being matters. Start a conversation now.</p>
      </div>

      <!-- Chat box at the bottom center -->
      <div class="chat-area">
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { GoogleGenerativeAI } from '@google/generative-ai';

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
// const sendMessage = async (event) => {
//   // Prevent default form submission behavior if event is provided
//   if (event) {
//     event.preventDefault();
//   }

//   const userMessage = chatInput.value.trim();
//   if (!userMessage) return;

//   // Add user's message to chat history
//   chatMessages.value.push({ sender: 'User', text: userMessage });
//   chatInput.value = '';

//   try {
//     // Make API call to OpenAI ChatGPT
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${import.meta.env.VITE_CHATGPT_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: "gpt-4", // or 'gpt-3.5-turbo' if you don't have access to GPT-4
//         messages: [{ role: "user", content: userMessage }],
//         max_tokens: 1000, // Adjust based on your needs
//         temperature: 0.7 // Adjust creativity level
//       })
//     });

//     // Check if the response is OK (status code 2xx)
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error.message || 'API request failed');
//     }

//     const data = await response.json();
//     const botMessage = data.choices[0].message.content.trim();

//     // Add ChatGPT's response to chat history
//     chatMessages.value.push({ sender: 'ChatGPT', text: botMessage });
//   } catch (error) {
//     console.error('Error fetching ChatGPT response:', error);
//     chatMessages.value.push({
//       sender: 'Error',
//       text: error.message || 'Failed to fetch response from ChatGPT.'
//     });
//   }
// };

const sendMessage = async (event) => {
  // Prevent default form submission behavior if event is provided
  if (event) {
    event.preventDefault();
  }

  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Add user's message to chat history
  chatMessages.value.push({ sender: 'User', text: userMessage });
  chatInput.value = '';

  try {
    // Import the Gemini client (ensure you've imported it correctly)
    // Create a Gemini client instance
    const client = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Define the prompt for Gemini
    const prompt = `Continue the conversation:

User: ${userMessage}`;

    // Send the prompt to Gemini
    const response = await model.generateContentStream(prompt);

    // Add initial empty message from Gemini
    const botMessageObj = { sender: 'Gemini', text: '' };
    chatMessages.value.push(botMessageObj);

    // Iterate over the response stream
    for await (const chunk of response.stream) {
      const chunkText = chunk.text();
      // Append the chunk text to the bot message
      botMessageObj.text += chunkText;
    }

  } catch (error) {
    console.error('Error fetching Gemini response:', error);
    chatMessages.value.push({
      sender: 'Error',
      text: error.message || 'Failed to fetch response from Gemini.'
    });
  }
};


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
  position: relative;
}

.slogan {
  text-align: center;
  margin-bottom: 20px;
}

.slogan h2 {
  font-size: 1.5em;
  color: #395244;
}

.slogan p {
  font-size: 1.2em;
  color: #395244;
}

.chat-area {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 0 20px;
}

.messages {
  width: 100%;
  overflow-y: auto;
  max-height: 200px;
  margin-bottom: 20px;
  border-radius: 15px;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #395244;
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
  width: 100%;
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
