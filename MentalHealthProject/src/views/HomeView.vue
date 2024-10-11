<script setup>
import { ref } from 'vue'
import OpenAI from "openai";

const openai = new OpenAI({

});

const chatInput = ref('');
const chatMessages = ref([]);

// Function to send message to ChatGPT API
const sendMessage = async () => {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatMessages.value.push({ sender: 'User', text: userMessage });
  chatInput.value = '';

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage }
      ]
    });

    const botMessage = response.choices[0].message.content;
    chatMessages.value.push({ sender: 'ChatGPT', text: botMessage });
  } catch (error) {
    chatMessages.value.push({ sender: 'Error', text: 'Failed to fetch response from ChatGPT.' });
  }
};
</script>

<template>
  <div>
    <!-- Upper part with background color #395244 and heart-warming sentence -->
    <div style="background-color: #395244; height: 50vh; display: flex; justify-content: center; align-items: center;">
      <h1 style="color: #F6F0E7; font-weight: bold;">You are stronger than you think, and you are never alone.</h1>
    </div>
    
    <!-- Lower part with ChatGPT integration and background color #F6F0E7 -->
    <div style="background-color: #F6F0E7; height: 50vh; padding: 20px;">
      <div v-for="message in chatMessages" :key="message.text" style="margin-bottom: 10px;">
        <strong>{{ message.sender }}:</strong> {{ message.text }}
      </div>
      
      <input 
        v-model="chatInput" 
        type="text" 
        placeholder="Type your message..." 
        style="width: 80%; padding: 10px; border-radius: 15px; border: 1px solid #395244;" />
      
      <button 
        @click="sendMessage" 
        style="padding: 10px 20px; margin-left: 10px; background-color: #395244; color: #F6F0E7; border-radius: 15px; border: none; cursor: pointer;"
        @mouseover="event.target.style.backgroundColor='#F6F0E7'; event.target.style.color='#395244';"
        @mouseout="event.target.style.backgroundColor='#395244'; event.target.style.color='#F6F0E7';">
        Send
      </button>
    </div>
  </div>
</template>
