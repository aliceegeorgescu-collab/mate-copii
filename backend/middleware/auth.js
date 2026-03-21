const jwt = require("jsonwebtoken");

const TOKEN_COOKIE_NAME = "mate_token";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return req.cookies?.[TOKEN_COOKIE_NAME] ?? null;
}

function signToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET. Add it to your environment before starting the backend.");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function setAuthCookie(res, token) {
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SEVEN_DAYS_MS,
  });
}

function clearAuthCookie(res) {
  res.clearCookie(TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

function authRequired(req, res, next) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ error: "Autentificare necesara." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.id,
      username: payload.username,
    };
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Sesiunea a expirat. Te rugam sa te autentifici din nou." });
  }
}

module.exports = {
  TOKEN_COOKIE_NAME,
  authRequired,
  clearAuthCookie,
  setAuthCookie,
  signToken,
};
