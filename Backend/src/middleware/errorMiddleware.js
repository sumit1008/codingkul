export const notFound = (req, res, next) => {
  const err = new Error(`Not Found — ${req.originalUrl}`);
  res.status(404);
  next(err);
};

export const errorHandler = (err, req, res, next) => {
  console.error("[ERROR]", req.method, req.originalUrl, "→", err.message);
  if (err.oauthError) console.error("[ERROR] oauthError:", JSON.stringify(err.oauthError));
  if (err.code) console.error("[ERROR] code:", err.code);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
