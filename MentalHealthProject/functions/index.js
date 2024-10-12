const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
const functions = require("firebase-functions");

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

exports.addReview = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const {userId, reviewContent = "No review content", rating} = req.body;

    if (!userId || !rating) {
      return res.status(400).send("Missing required fields");
    }

    const reviewData = {
      userId,
      reviewContent,
      rating,
      date: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
      const reviewRef = await db.collection("reviews").add(reviewData);

      await db.collection("users").doc(userId)
          .collection("reviews").doc(reviewRef.id).set(reviewData);

      res.status(200).send({success: true, reviewId: reviewRef.id});
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});

exports.getReviews = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "GET") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const snapshot = await db.collection("reviews")
          .orderBy("date", "desc")
          .get();

      if (snapshot.empty) {
        return res.status(404).send("No reviews found");
      }

      const reviews = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
          id: doc.id,
          serialNumber: index + 1,
          rating: data.rating,
          reviewContent: data.reviewContent,
          userId: data.userId,
          date: data.date ? data.date.toDate().toISOString() : null,
        };
      });

      res.status(200).send({success: true, reviews});
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});

exports.getUserInfo = functions.https.onRequest((req, res) => {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  cors(req, res, async () => {
    try {
      const usersSnapshot = await admin.firestore().collection("users").get();
      const users = [];
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: doc.id,
          email: data.email,
          role: data.role,
        });
      });
      return res.status(200).json({users});
    } catch (error) {
      console.error("Error fetching user info:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
});
