const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();
const db = admin.firestore();

exports.addMoodEntry = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Get the ID token from the Authorization header
      const idToken = req.headers.authorization ?
      req.headers.authorization.split("Bearer ")[1] : null;

      if (!idToken) {
        res.status(401).send({success: false, error: "Unauthorized"});
        return;
      }

      // Verify the ID token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      const {mood, notes} = req.body;

      const entry = {
        mood,
        notes,
        date: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db
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
      // Get the ID token from the Authorization header
      const idToken = req.headers.authorization ?
      req.headers.authorization.split("Bearer ")[1] : null;

      if (!idToken) {
        res.status(401).send({success: false, error: "Unauthorized"});
        return;
      }

      // Verify the ID token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;
      console.log("Decoded userId:", userId);

      const snapshot = await db
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

