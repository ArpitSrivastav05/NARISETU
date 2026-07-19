const { db } = require("../config/firebase");
const { GoogleGenAI } = require("@google/genai");
const { courseCatalog } = require("../utils/courseCatalog");

// Utility to generate a random certificate ID
function generateCertificateId() {
  return "NS-CERT-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

exports.getCourses = async (req, res) => {
  try {
    // In a future phase, we can tailor the 'recommended' section based on user profile.
    // For now, we return the entire catalog.
    return res.status(200).json({
      success: true,
      data: courseCatalog,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ success: false, error: "Internal server error." });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const { uid } = req.user;
    if (!db) {
      return res.status(503).json({ success: false, error: "Database not available." });
    }

    const progressSnapshot = await db
      .collection("users")
      .doc(uid)
      .collection("learningProgress")
      .get();

    const progressData = {};
    progressSnapshot.forEach((doc) => {
      progressData[doc.id] = doc.data();
    });

    return res.status(200).json({ success: true, data: progressData });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return res.status(500).json({ success: false, error: "Internal server error." });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { uid } = req.user;
    const { courseId, moduleId, completedLessonId, quizScore } = req.body;

    if (!courseId) {
      return res.status(400).json({ success: false, error: "courseId is required." });
    }

    if (!db) {
      return res.status(503).json({ success: false, error: "Database not available." });
    }

    const progressRef = db.collection("users").doc(uid).collection("learningProgress").doc(courseId);
    
    // Fetch existing progress
    const doc = await progressRef.get();
    let currentProgress = doc.exists ? doc.data() : { completedLessons: [], quizScores: {}, certificateId: null };
    
    let isUpdated = false;

    if (completedLessonId && !currentProgress.completedLessons.includes(completedLessonId)) {
      currentProgress.completedLessons.push(completedLessonId);
      isUpdated = true;
    }

    if (moduleId && quizScore !== undefined) {
      currentProgress.quizScores[moduleId] = Math.max(currentProgress.quizScores[moduleId] || 0, quizScore);
      isUpdated = true;
    }

    // Check if course is completed
    const course = courseCatalog.find(c => c.id === courseId);
    if (course && !currentProgress.certificateId) {
      const allLessons = course.modules.flatMap(m => m.lessons.map(l => l.id));
      const hasCompletedAllLessons = allLessons.every(id => currentProgress.completedLessons.includes(id));
      
      const allModulesWithQuizzes = course.modules.filter(m => m.quiz).map(m => m.id);
      const hasPassedAllQuizzes = allModulesWithQuizzes.every(id => (currentProgress.quizScores[id] || 0) >= 50);

      if (hasCompletedAllLessons && hasPassedAllQuizzes) {
        currentProgress.certificateId = generateCertificateId();
        currentProgress.completedAt = new Date().toISOString();
        isUpdated = true;
      }
    }

    if (isUpdated) {
      await progressRef.set(currentProgress, { merge: true });
    }

    return res.status(200).json({ success: true, data: currentProgress });
  } catch (error) {
    console.error("Error updating progress:", error);
    return res.status(500).json({ success: false, error: "Internal server error." });
  }
};

exports.askAITutor = async (req, res) => {
  try {
    const { uid } = req.user;
    const { question, lessonContext, language = "English" } = req.body;

    if (!question || !lessonContext) {
      return res.status(400).json({ success: false, error: "Question and lesson context are required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ success: false, error: "AI Tutor is currently unavailable." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = [
      "You are NariSetu AI Tutor, an encouraging and patient AI Entrepreneurship Assistant.",
      "You are helping a student understand the following lesson content:",
      "---",
      lessonContext,
      "---",
      `Student Question: ${question}`,
      `Please provide a clear, helpful, and concise answer based PRIMARILY on the lesson content above.`,
      `IMPORTANT: You must respond in the following language: ${language}.`,
      "Keep your answer under 3 paragraphs."
    ].join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const reply = response?.text || "I'm sorry, I couldn't process your question at this time. Please try again.";

    return res.status(200).json({ success: true, data: { reply } });
  } catch (error) {
    console.error("Error in AI Tutor:", error);
    return res.status(500).json({ success: false, error: "Internal server error." });
  }
};
