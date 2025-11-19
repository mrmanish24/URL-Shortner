export const TryCaught = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};


export const globalErrorHandler = (err, req, res, next) => {
  console.error("Global Error Handler:", err);
  
  const statusCode = err.StatusCode || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};
