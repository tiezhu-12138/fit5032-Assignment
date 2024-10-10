/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require('firebase-functions/v2/https')
const logger = require('firebase-functions/logger')

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// functions/index.js

const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })

admin.initializeApp()

exports.addMoodEntry = functions.https.onRequest(async (req, res) => {
  try {
    const { mood, notes, userId } = req.body
    const entry = {
      mood,
      notes,
      date: admin.firestore.FieldValue.serverTimestamp()
    }
    await admin.firestore().collection('users').doc(userId).collection('moodEntries').add(entry)
    res.status(200).send({ success: true })
  } catch (error) {
    console.error('Error adding mood entry:', error)
    res.status(500).send({ success: false, error: error.message })
  }
})

exports.getMoodEntries = functions.https.onRequest(async (req, res) => {
  try {
    const { userId } = req.query
    const snapshot = await admin
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('moodEntries')
      .orderBy('date', 'desc')
      .get()
    const entries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.status(200).send(entries)
  } catch (error) {
    console.error('Error retrieving mood entries:', error)
    res.status(500).send({ success: false, error: error.message })
  }
})
