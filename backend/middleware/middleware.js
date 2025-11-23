export const TryCaught = (handler) => {

//   TryCaught is a higher-order function that receives a real controller (handler) and returns a new function with (req, res, next) so Express can use it as a route handler.

// The returned function doesn't implement business logic — it only exists to wrap the real handler in a try/catch.

// Inside the try block, we call handler(req, res, next).
// If the handler throws an error or an async function rejects, the catch block forwards the error to Express using next(error).

// This avoids writing try/catch manually in every controller.

  return async (req, res, next) => {
    try {       
      await handler(req, res, next);  // this is the real function that works we will turn it inside try catch block
    } catch (error) {
      next(error);
    }
  };
};


// this middleware will catch the error
export const globalErrorHandler = (err, req, res, next) => {
  console.error("Global Error Handler:", err);
  
  const statusCode = err.StatusCode || err.statusCode || 500;   //styles of wrting the error
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};
