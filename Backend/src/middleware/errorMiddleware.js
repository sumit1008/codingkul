export const notFound = (req, res, next) => {
  const err = new Error(`Not Found — ${req.originalUrl}`);
  res.status(404);
  next(err);
};

export const errorHandler = (err, req, res, next) => {
  console.error("[ERROR]", req.method, req.originalUrl, "→", err.message);
  if (err.oauthError) console.error("[ERROR] oauthError:", JSON.stringify(err.oauthError));
  if (err.code) console.error("[ERROR] code:", err.code);

  // Google Workspace sends the callback URL twice — the second exchange always fails
  // with invalid_grant. Redirect to login instead of showing a raw JSON 500 in the
  // browser. If the first exchange already set the cookie, login will redirect to dashboard.
  if (req.path === "/api/auth/google/callback") {
    const clientURL = process.env.CLIENT_URL || "http://localhost:3000";
    return res.redirect(`${clientURL}/login?error=google_failed`);
  }

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  res.status(statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
