const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((error) => error.message),
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate value",
      fields: Object.keys(err.keyValue),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource id" });
  }

  return res.status(statusCode).json({
    message: err.message || "Server error",
  });
};

export default errorHandler;
