/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  NariSetu — Firebase Token Verification Middleware
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  Verifies Firebase JWT from Authorization header.
 *  On success: attaches req.user = { uid, email, name }
 *  On failure: returns 401 Unauthorized.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

const { admin } = require("../config/firebase");

/**
 * verifyToken — required auth middleware.
 * Use on routes that must only be accessed by signed-in users.
 */
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized.",
      message: "Missing or malformed Authorization header. Expected: Bearer <token>",
    });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || "",
      name: decoded.name || decoded.email || "NariSetu User",
      picture: decoded.picture || "",
    };
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({
      success: false,
      error: "Unauthorized.",
      message: "Invalid or expired Firebase token.",
    });
  }
}

/**
 * optionalToken — soft auth middleware.
 * Attaches req.user if a valid token is present, but does NOT block the request.
 * Use on routes that have both public and authenticated behaviour.
 */
async function optionalToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || "",
      name: decoded.name || decoded.email || "NariSetu User",
      picture: decoded.picture || "",
    };
  } catch {
    req.user = null;
  }
  next();
}

module.exports = { verifyToken, optionalToken };
