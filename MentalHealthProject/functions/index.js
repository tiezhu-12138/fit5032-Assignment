const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

exports.addMoodEntry = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const {mood, notes, userId} = req.body;
      const entry = {
        mood,
        notes,
        date: admin.firestore.FieldValue.serverTimestamp(),
      };
      await admin
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("moodEntries")
          .add(entry);
      res.status(200).send({success: true});
    } catch (error) {
      console.error("Error adding mood entry:", error);
      res.status(500).send({success: false, error: error.message});
    }
  });
});

exports.getMoodEntries = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const {userId} = req.query;
      const snapshot = await admin
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("moodEntries")
          .orderBy("date", "desc")
          .get();
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.status(200).send(entries);
    } catch (error) {
      console.error("Error retrieving mood entries:", error);
      res.status(500).send({success: false, error: error.message});
    }
  });
});
