const { db, admin } = require("../config/firebase");
const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini SDK with API key from environment
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.processVoiceTransaction = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No audio file provided." });
    }

    const { buffer, mimetype } = req.file;

    // Send the audio buffer to Gemini-2.5-flash
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
        systemInstruction: "Listen to this audio (usually Hindi/Hinglish). Extract the financial transaction. Return strictly a JSON object with 3 keys: amount (number), type (string, either \"income\" or \"expense\"), and description (string in English).",
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
        details: outputText
      });
    }

    // Save to Firestore 'transactions' collection with a timestamp
    const newTransactionRef = db.collection("transactions").doc();
    const transactionRecord = {
      ...transactionData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await newTransactionRef.set(transactionRecord);

    return res.status(201).json({
      success: true,
      data: {
        id: newTransactionRef.id,
        ...transactionRecord
      }
    });

  } catch (error) {
    console.error("Voice transaction processing error:", error);
    return res.status(500).json({
      success: false,
      error: "An internal server error occurred while processing the voice transaction.",
      details: error.message
    });
  }
};
