const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
const functions = require("firebase-functions");

admin.initializeApp();
const db = admin.firestore();


exports.addMoodEntry = onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    // Manually parse the request body
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        if (body) {
          req.body = JSON.parse(body);
        } else {
          req.body = {};
        }

        const {userID, mood, notes = ""} = req.body;

        if (!userID || mood == null) {
          return res.status(400).send("Missing required fields");
        }

        const moodEntryData = {
          userID,
          mood,
          notes,
          date: admin.firestore.FieldValue.serverTimestamp(),
        };

        // Add the mood entry to the user"s moodEntries subcollection
        const moodEntryRef = await db
            .collection("users")
            .doc(userID)
            .collection("moodEntries")
            .add(moodEntryData);

        res.status(200).send({success: true, moodEntryId: moodEntryRef.id});
      } catch (error) {
        console.error("Error adding mood entry:", error);
        res.status(500).send("Internal Server Error");
      }
    });
  });
});

// Function to get mood entries
exports.getMoodEntries = onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "GET") {
      return res.status(405).send("Method Not Allowed");
    }

    // Extract userID from query parameters
    const userID = req.query.userID;

    if (!userID) {
      return res.status(400).send("Missing required parameter: userID");
    }

    try {
      const snapshot = await db
          .collection("users")
          .doc(userID)
          .collection("moodEntries")
          .orderBy("date", "desc")
          .get();

      if (snapshot.empty) {
        return res.status(404).send("No mood entries found");
      }

      const moodEntries = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
          id: doc.id,
          serialNumber: index + 1,
          mood: data.mood,
          notes: data.notes,
          userID: data.userID,
          date: data.date ? data.date.toDate().toISOString() : null,
        };
      });

      res.status(200).send({success: true, moodEntries});
    } catch (error) {
      console.error("Error fetching mood entries:", error);
      res.status(500).send("Internal Server Error");
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
