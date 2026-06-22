const { db, admin } = require("../config/firebase");
const { GoogleGenAI } = require("@google/genai");

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.processVoiceTransaction = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No audio file provided." });
    }

    const { buffer, mimetype } = req.file;
    const uid = req.user.uid; // guaranteed by verifyToken middleware

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: buffer.toString("base64"),
                mimeType: mimetype,
              },
            },
          ],
        },
      ],
      config: {
        systemInstruction:
          'Listen to this audio (usually Hindi/Hinglish). Extract the financial transaction. Return strictly a JSON object with 3 keys: amount (number), type (string, either "income" or "expense"), and description (string in English).',
        responseMimeType: "application/json",
      },
    });

    const outputText = response.text;

    let transactionData;
    try {
      transactionData = JSON.parse(outputText);
    } catch (parseError) {
      return res.status(500).json({
        success: false,
        error: "Failed to parse Gemini response as JSON.",
        details: outputText,
      });
    }

    // Save to Firestore with the authenticated user's uid
    const newTransactionRef = db.collection("transactions").doc();
    const transactionRecord = {
      ...transactionData,
      uid, // ← owner field
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await newTransactionRef.set(transactionRecord);

    return res.status(201).json({
      success: true,
      data: {
        id: newTransactionRef.id,
        ...transactionRecord,
      },
    });
  } catch (error) {
    console.error("Voice transaction processing error:", error);
    return res.status(500).json({
      success: false,
      error: "An internal server error occurred while processing the voice transaction.",
      details: error.message,
    });
  }
};

/**
 * GET /api/transactions
 * Returns only transactions owned by the authenticated user.
 */
exports.getTransactions = async (req, res) => {
  try {
    const { type } = req.query;
    const uid = req.user.uid;

    let query = db.collection("transactions").where("uid", "==", uid);

    if (type && (type === "income" || type === "expense")) {
      query = query.where("type", "==", type);
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      return res.status(200).json({ success: true, data: [] });
    }

    const transactions = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      let timestamp = null;
      if (data.createdAt) {
        timestamp = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      }
      transactions.push({ id: doc.id, ...data, createdAt: timestamp });
    });

    // Sort newest first in memory
    transactions.sort((a, b) => {
      const dateA = a.createdAt || new Date(0);
      const dateB = b.createdAt || new Date(0);
      return dateB - dateA;
    });

    return res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error in getTransactions:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
      message: error.message,
    });
  }
};
