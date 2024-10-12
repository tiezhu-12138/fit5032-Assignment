<template>
  <div class="dashboard">
    <!-- Email Send Area -->
    <div class="email-send-area">
      <h2>Send Email</h2>
      <form ref="emailForm" @submit.prevent="handleSendEmail">
        <div class="form-group">
          <label for="recipient">Recipient Email:</label>
          <input
            type="email"
            id="recipient"
            name="to_email"
            v-model="emailForm.recipient"
            placeholder="Enter recipient email"
            required
          />
        </div>
        <div class="form-group">
          <label for="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            v-model="emailForm.subject"
            placeholder="Enter email subject"
            required
          />
        </div>
        <div class="form-group">
          <label for="message">Message:</label>
          <textarea
            id="message"
            name="message"
            v-model="emailForm.message"
            placeholder="Enter your message"
            required
          ></textarea>
        </div>
        <div class="form-group">
          <label for="attachment">Attachment:</label>
          <input
            type="file"
            id="attachment"
            name="attachment"
            @change="handleFileUpload"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
          />
          <div v-if="attachmentName" class="attachment-info">
            <p>Attached: {{ attachmentName }}</p>
            <button type="button" @click="removeAttachment">Remove</button>
          </div>
        </div>
        <button type="submit" class="send-button">Send Email</button>
      </form>
    </div>

    <!-- All Users Table -->
    <div class="users-table">
      <h2>All Users</h2>
      <!-- Buttons for Select All/Deselect All and Email Selected Users -->
      <div class="buttons">
        <button @click="selectAllUsersAll">Select All</button>
        <button @click="deselectAllUsersAll">Deselect All</button>
        <button @click="handleSendToSelectedAll">Email Selected Users</button>
      </div>
      <!-- Search Inputs -->
      <div class="search-row">
        <input
          type="text"
          v-model="searchAll.email"
          @input="currentPageAll = 1"
          placeholder="Search Email"
        />
        <input
          type="text"
          v-model="searchAll.role"
          @input="currentPageAll = 1"
          placeholder="Search Role"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                @change="toggleSelectAllUsersAll"
                :checked="areAllUsersSelectedAll"
              />
            </th>
            <th @click="sortTableAll('email')">
              Email
              <span v-if="sortKeyAll === 'email'">
                {{ sortOrderAll === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sortTableAll('role')">
              Role
              <span v-if="sortKeyAll === 'role'">
                {{ sortOrderAll === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsersAll" :key="user.id">
            <td>
              <input
                type="checkbox"
                :value="user.email"
                v-model="selectedUsersAll"
              />
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination Controls -->
      <div class="pagination">
        <button @click="prevPageAll" :disabled="currentPageAll === 1">Prev</button>
        <span>Page {{ currentPageAll }} of {{ totalPagesAll }}</span>
        <button @click="nextPageAll" :disabled="currentPageAll === totalPagesAll">Next</button>
      </div>
    </div>

    <!-- Admin Users Table -->
    <div class="users-table">
      <h2>Admin Users</h2>
      <!-- Buttons for Select All/Deselect All and Email Selected Users -->
      <div class="buttons">
        <button @click="selectAllUsersAdmin">Select All</button>
        <button @click="deselectAllUsersAdmin">Deselect All</button>
        <button @click="handleSendToSelectedAdmin">Email Selected Users</button>
      </div>
      <!-- Search Inputs -->
      <div class="search-row">
        <input
          type="text"
          v-model="searchAdmin.email"
          @input="currentPageAdmin = 1"
          placeholder="Search Email"
        />
        <input
          type="text"
          v-model="searchAdmin.role"
          @input="currentPageAdmin = 1"
          placeholder="Search Role"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                @change="toggleSelectAllUsersAdmin"
                :checked="areAllUsersSelectedAdmin"
              />
            </th>
            <th @click="sortTableAdmin('email')">
              Email
              <span v-if="sortKeyAdmin === 'email'">
                {{ sortOrderAdmin === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sortTableAdmin('role')">
              Role
              <span v-if="sortKeyAdmin === 'role'">
                {{ sortOrderAdmin === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsersAdmin" :key="user.id">
            <td>
              <input
                type="checkbox"
                :value="user.email"
                v-model="selectedUsersAdmin"
              />
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination Controls -->
      <div class="pagination">
        <button @click="prevPageAdmin" :disabled="currentPageAdmin === 1">Prev</button>
        <span>Page {{ currentPageAdmin }} of {{ totalPagesAdmin }}</span>
        <button @click="nextPageAdmin" :disabled="currentPageAdmin === totalPagesAdmin">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import emailjs from 'emailjs-com';

export default {
  name: 'DashboardView',
  data() {
    return {
      // Email Form Data
      emailForm: {
        recipient: '',
        subject: '',
        message: '',
      },
      // Attachment Data
      attachment: null,
      attachmentName: '',

      // All Users Table Data
      usersAll: [],
      sortKeyAll: '',
      sortOrderAll: 'asc',
      searchAll: {
        email: '',
        role: '',
      },
      currentPageAll: 1,
      rowsPerPageAll: 10,
      selectedUsersAll: [],

      // Admin Users Table Data
      usersAdmin: [],
      sortKeyAdmin: '',
      sortOrderAdmin: 'asc',
      searchAdmin: {
        email: '',
        role: '',
      },
      currentPageAdmin: 1,
      rowsPerPageAdmin: 10,
      selectedUsersAdmin: [],
    };
  },
  computed: {
    // Filtered and Sorted All Users
    filteredSortedUsersAll() {
      let filtered = this.usersAll;

      // Apply Search Filters
      if (this.searchAll.email) {
        filtered = filtered.filter((user) =>
          user.email.toLowerCase().includes(this.searchAll.email.toLowerCase())
        );
      }
      if (this.searchAll.role) {
        filtered = filtered.filter((user) =>
          user.role.toLowerCase().includes(this.searchAll.role.toLowerCase())
        );
      }

      // Apply Sorting
      if (this.sortKeyAll) {
        filtered = filtered.sort((a, b) => {
          let result = 0;
          if (a[this.sortKeyAll] < b[this.sortKeyAll]) result = -1;
          if (a[this.sortKeyAll] > b[this.sortKeyAll]) result = 1;
          return this.sortOrderAll === 'asc' ? result : -result;
        });
      }

      return filtered;
    },

    // Paginated All Users
    paginatedUsersAll() {
      const start = (this.currentPageAll - 1) * this.rowsPerPageAll;
      const end = start + this.rowsPerPageAll;
      return this.filteredSortedUsersAll.slice(start, end);
    },

    // Total Pages for All Users
    totalPagesAll() {
      return Math.ceil(this.filteredSortedUsersAll.length / this.rowsPerPageAll);
    },

    // Check if all users are selected in All Users Table
    areAllUsersSelectedAll() {
      return (
        this.paginatedUsersAll.length > 0 &&
        this.paginatedUsersAll.every((user) =>
          this.selectedUsersAll.includes(user.email)
        )
      );
    },

    // Filtered and Sorted Admin Users
    filteredSortedUsersAdmin() {
      let filtered = this.usersAdmin;

      // Apply Search Filters
      if (this.searchAdmin.email) {
        filtered = filtered.filter((user) =>
          user.email.toLowerCase().includes(this.searchAdmin.email.toLowerCase())
        );
      }
      if (this.searchAdmin.role) {
        filtered = filtered.filter((user) =>
          user.role.toLowerCase().includes(this.searchAdmin.role.toLowerCase())
        );
      }

      // Apply Sorting
      if (this.sortKeyAdmin) {
        filtered = filtered.sort((a, b) => {
          let result = 0;
          if (a[this.sortKeyAdmin] < b[this.sortKeyAdmin]) result = -1;
          if (a[this.sortKeyAdmin] > b[this.sortKeyAdmin]) result = 1;
          return this.sortOrderAdmin === 'asc' ? result : -result;
        });
      }

      return filtered;
    },

    // Paginated Admin Users
    paginatedUsersAdmin() {
      const start = (this.currentPageAdmin - 1) * this.rowsPerPageAdmin;
      const end = start + this.rowsPerPageAdmin;
      return this.filteredSortedUsersAdmin.slice(start, end);
    },

    // Total Pages for Admin Users
    totalPagesAdmin() {
      return Math.ceil(
        this.filteredSortedUsersAdmin.length / this.rowsPerPageAdmin
      );
    },

    // Check if all users are selected in Admin Users Table
    areAllUsersSelectedAdmin() {
      return (
        this.paginatedUsersAdmin.length > 0 &&
        this.paginatedUsersAdmin.every((user) =>
          this.selectedUsersAdmin.includes(user.email)
        )
      );
    },
  },
  methods: {
    // Fetch All Users from Firebase
    async fetchUsers() {
      try {
        const response = await axios.get(
          `https://us-central1-fit5032project-a3ac5.cloudfunctions.net/getUserInfo`
        );
        this.usersAll = response.data.users;
        // Filter Admin Users
        this.usersAdmin = this.usersAll.filter(
          (user) => user.role && user.role.toLowerCase() === 'admin'
        );
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to fetch users.');
      }
    },

    // Handle Email Sending via EmailJS
    handleSendEmail() {
      const { recipient, subject, message } = this.emailForm;
      if (!recipient || !subject || !message) {
        alert('Please fill in all email fields.');
        return;
      }

      emailjs
        .sendForm(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          this.$refs.emailForm,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
        .then(
          (result) => {
            console.log('SUCCESS!', result.status, result.text);
            alert('Email sent successfully.');
            // Reset form
            this.emailForm.recipient = '';
            this.emailForm.subject = '';
            this.emailForm.message = '';
            this.removeAttachment();
            // Reset the form fields
            this.$refs.emailForm.reset();
          },
          (error) => {
            console.error('FAILED...', error);
            alert('Failed to send email.');
          }
        );
    },

    // Sorting for All Users Table
    sortTableAll(key) {
      if (this.sortKeyAll === key) {
        // Toggle sort order
        this.sortOrderAll = this.sortOrderAll === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKeyAll = key;
        this.sortOrderAll = 'asc';
      }
    },

    // Sorting for Admin Users Table
    sortTableAdmin(key) {
      if (this.sortKeyAdmin === key) {
        // Toggle sort order
        this.sortOrderAdmin = this.sortOrderAdmin === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKeyAdmin = key;
        this.sortOrderAdmin = 'asc';
      }
    },

    prevPageAll() {
      if (this.currentPageAll > 1) {
        this.currentPageAll--;
      }
    },
    nextPageAll() {
      if (this.currentPageAll < this.totalPagesAll) {
        this.currentPageAll++;
      }
    },

    prevPageAdmin() {
      if (this.currentPageAdmin > 1) {
        this.currentPageAdmin--;
      }
    },
    nextPageAdmin() {
      if (this.currentPageAdmin < this.totalPagesAdmin) {
        this.currentPageAdmin++;
      }
    },

    // Handle File Upload
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // Check file size (e.g., limit to 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          alert('File size exceeds the 5MB limit.');
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result.split(',')[1];
          this.attachment = base64String;
          this.attachmentName = file.name;
        };
        reader.readAsDataURL(file);
      }
    },

    // Remove Attachment
    removeAttachment() {
      this.attachment = null;
      this.attachmentName = '';
      // Reset the file input
      const fileInput = document.getElementById('attachment');
      if (fileInput) {
        fileInput.value = '';
      }
    },

    // Select All Users in All Users Table
    selectAllUsersAll() {
      this.selectedUsersAll = this.paginatedUsersAll.map((user) => user.email);
    },

    // Deselect All Users in All Users Table
    deselectAllUsersAll() {
      this.selectedUsersAll = [];
    },

    // Toggle Select All Users in All Users Table
    toggleSelectAllUsersAll(event) {
      if (event.target.checked) {
        this.selectAllUsersAll();
      } else {
        this.deselectAllUsersAll();
      }
    },

    // Select All Users in Admin Users Table
    selectAllUsersAdmin() {
      this.selectedUsersAdmin = this.paginatedUsersAdmin.map(
        (user) => user.email
      );
    },

    // Deselect All Users in Admin Users Table
    deselectAllUsersAdmin() {
      this.selectedUsersAdmin = [];
    },

    // Toggle Select All Users in Admin Users Table
    toggleSelectAllUsersAdmin(event) {
      if (event.target.checked) {
        this.selectAllUsersAdmin();
      } else {
        this.deselectAllUsersAdmin();
      }
    },

    // Handle Sending Emails to Selected Users in All Users Table
    async handleSendToSelectedAll() {
      if (this.selectedUsersAll.length === 0) {
        alert('No users selected to send emails to.');
        return;
      }

      // Prompt admin for subject and message
      const subject = prompt('Enter email subject:');
      const message = prompt('Enter email message:');

      if (!subject || !message) {
        alert('Subject and message are required.');
        return;
      }

      // Optionally, allow attachment when sending to selected users
      const attach = confirm('Do you want to attach a file to these emails?');
      let attachment = null;
      let attachmentName = '';
      if (attach && this.attachment) {
        attachment = this.attachment;
        attachmentName = this.attachmentName;
      }

      // Iterate over selected users and send emails
      const sendPromises = this.selectedUsersAll.map((recipient) => {
        // Create a temporary form for each email
        const tempForm = document.createElement('form');

        // Recipient Email
        const toEmailInput = document.createElement('input');
        toEmailInput.type = 'hidden';
        toEmailInput.name = 'to_email';
        toEmailInput.value = recipient;
        tempForm.appendChild(toEmailInput);

        // Subject
        const subjectInput = document.createElement('input');
        subjectInput.type = 'hidden';
        subjectInput.name = 'subject';
        subjectInput.value = subject;
        tempForm.appendChild(subjectInput);

        // Message
        const messageInput = document.createElement('input');
        messageInput.type = 'hidden';
        messageInput.name = 'message';
        messageInput.value = message;
        tempForm.appendChild(messageInput);

        // Attachment (if any)
        if (attachment) {
          const attachmentInput = document.createElement('input');
          attachmentInput.type = 'hidden';
          attachmentInput.name = 'attachment';
          attachmentInput.value = attachment;
          tempForm.appendChild(attachmentInput);
        }

        document.body.appendChild(tempForm);

        return emailjs
          .sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            tempForm,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          )
          .then(
            (result) => {
              console.log(
                `SUCCESS! Email sent to ${recipient}:`,
                result.status,
                result.text
              );
            },
            (error) => {
              console.error(`FAILED... Email to ${recipient}:`, error);
            }
          )
          .finally(() => {
            // Remove the temporary form
            document.body.removeChild(tempForm);
          });
      });

      Promise.all(sendPromises)
        .then(() => {
          alert('Emails have been sent.');
          this.selectedUsersAll = [];
          this.removeAttachment();
        })
        .catch((error) => {
          console.error('Error sending emails:', error);
          alert('Some emails failed to send.');
        });
    },

    // Handle Sending Emails to Selected Users in Admin Users Table
    async handleSendToSelectedAdmin() {
      if (this.selectedUsersAdmin.length === 0) {
        alert('No users selected to send emails to.');
        return;
      }

      // Prompt admin for subject and message
      const subject = prompt('Enter email subject:');
      const message = prompt('Enter email message:');

      if (!subject || !message) {
        alert('Subject and message are required.');
        return;
      }

      // Optionally, allow attachment when sending to selected users
      const attach = confirm('Do you want to attach a file to these emails?');
      let attachment = null;
      let attachmentName = '';
      if (attach && this.attachment) {
        attachment = this.attachment;
        attachmentName = this.attachmentName;
      }

      // Iterate over selected users and send emails
      const sendPromises = this.selectedUsersAdmin.map((recipient) => {
        // Create a temporary form for each email
        const tempForm = document.createElement('form');

        // Recipient Email
        const toEmailInput = document.createElement('input');
        toEmailInput.type = 'hidden';
        toEmailInput.name = 'to_email';
        toEmailInput.value = recipient;
        tempForm.appendChild(toEmailInput);

        // Subject
        const subjectInput = document.createElement('input');
        subjectInput.type = 'hidden';
        subjectInput.name = 'subject';
        subjectInput.value = subject;
        tempForm.appendChild(subjectInput);

        // Message
        const messageInput = document.createElement('input');
        messageInput.type = 'hidden';
        messageInput.name = 'message';
        messageInput.value = message;
        tempForm.appendChild(messageInput);

        // Attachment (if any)
        if (attachment) {
          const attachmentInput = document.createElement('input');
          attachmentInput.type = 'hidden';
          attachmentInput.name = 'attachment';
          attachmentInput.value = attachment;
          tempForm.appendChild(attachmentInput);
        }

        document.body.appendChild(tempForm);

        return emailjs
          .sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            tempForm,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          )
          .then(
            (result) => {
              console.log(
                `SUCCESS! Email sent to ${recipient}:`,
                result.status,
                result.text
              );
            },
            (error) => {
              console.error(`FAILED... Email to ${recipient}:`, error);
            }
          )
          .finally(() => {
            // Remove the temporary form
            document.body.removeChild(tempForm);
          });
      });

      Promise.all(sendPromises)
        .then(() => {
          alert('Emails have been sent.');
          this.selectedUsersAdmin = [];
          this.removeAttachment();
        })
        .catch((error) => {
          console.error('Error sending emails:', error);
          alert('Some emails failed to send.');
        });
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.dashboard {
  padding: 40px;
  background-color: #395244;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.email-send-area,
.users-table {
  background-color: #f6f0e7;
  border-radius: 15px;
  padding: 30px;
  width: 80%;
  max-width: 800px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.email-send-area form .form-group {
  margin-bottom: 20px;
}

.email-send-area label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.email-send-area input[type='email'],
.email-send-area input[type='text'],
.email-send-area textarea,
.email-send-area input[type='file'] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.email-send-area textarea {
  resize: vertical;
  height: 100px;
}

.email-send-area .attachment-info {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.email-send-area .attachment-info p {
  margin: 0;
  font-style: italic;
  color: #555;
}

.email-send-area .attachment-info button {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.email-send-area .attachment-info button:hover {
  background-color: #c0392b;
}

.send-button {
  background-color: #395244;
  color: #fff;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.send-button:hover {
  background-color: #395244;
}

.users-table table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.users-table th {
  cursor: pointer;
  background-color: #e2d9c9;
  position: relative;
}

.users-table th:hover {
  background-color: #d5c6b4;
}

.users-table th span {
  margin-left: 5px;
  font-size: 12px;
}

.users-table td input[type='checkbox'] {
  transform: scale(1.2);
}

.search-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.search-row input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  gap: 10px;
}

.pagination button {
  background-color: #395244;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #395244;
}

.users-table .buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.users-table .buttons button {
  background-color: #395244;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.users-table .buttons button:hover {
  background-color: #395244;
}

.users-table th:first-child,
.users-table td:first-child {
  text-align: center;
  width: 50px;
}

.users-table input[type='checkbox'] {
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .email-send-area,
  .users-table {
    width: 95%;
  }

  .buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .buttons button {
    width: 100%;
    margin-left: 0;
    margin-bottom: 10px;
  }

  .search-row {
    flex-direction: column;
  }
}
</style>
