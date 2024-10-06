-- This page is visible only to the admin user. -- It should display a message that says "This is an
admin page".

<template>
  <div class="admin-view">
    <h1>Admin Email Sender</h1>
    <div class="form-group">
      <label for="email-select">Select Emails:</label>
      <multiselect
        id="email-select"
        v-model="selectedEmails"
        :options="emails"
        :multiple="true"
        :close-on-select="false"
        :clear-on-select="false"
        :preserve-search="true"
        placeholder="Select email(s)"
        label="email"
        track-by="email"
        :preselect-first="false"
      >
        <template #selection="{ values, isOpen }">
          <span v-if="values.length && !isOpen" class="multiselect__single"
            >{{ values.length }} option(s) selected</span
          >
        </template>
      </multiselect>
    </div>

    <div class="form-group">
      <label for="email-subject">Email Subject:</label>
      <input
        id="email-subject"
        v-model="emailSubject"
        type="text"
        class="form-control"
        placeholder="Enter email subject"
      />
    </div>

    <div class="form-group">
      <label for="email-body">Email Body:</label>
      <textarea
        id="email-body"
        v-model="emailBody"
        class="form-control"
        placeholder="Enter email body"
      ></textarea>
    </div>

    <button class="btn btn-primary" @click="sendEmails">Send Emails</button>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'AdminView',
  components: {
    Multiselect
  },
  data() {
    return {
      emails: [],
      selectedEmails: [],
      emailSubject: '',
      emailBody: ''
    }
  },
  mounted() {
    this.fetchEmails()
  },
  methods: {
    fetchEmails() {
      // Replace this with your API call to fetch emails
      this.emails = [
        { email: 'user1@example.com' },
        { email: 'user2@example.com' },
        { email: 'user3@example.com' }
        // Add more emails as needed
      ]
    },
    sendEmails() {
      if (this.selectedEmails.length === 0) {
        alert('Please select at least one email.')
        return
      }
      if (!this.emailSubject || !this.emailBody) {
        alert('Please enter email subject and body.')
        return
      }

      const data = {
        emails: this.selectedEmails.map((item) => item.email),
        subject: this.emailSubject,
        body: this.emailBody
      }

      // Make API call to your backend to send emails via SendGrid
      fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Include authorization headers if necessary
        },
        body: JSON.stringify(data)
      })
        .then((response) => {
          if (response.ok) {
            alert('Emails sent successfully!')
          } else {
            alert('Failed to send emails.')
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          alert('An error occurred.')
        })
    }
  }
}
</script>

<style scoped>
.admin-view {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

.multiselect__single {
  display: inline-block;
  line-height: 25px;
}

.btn {
  display: block;
  width: 100%;
}

.multiselect {
  width: 100%;
}
</style>
