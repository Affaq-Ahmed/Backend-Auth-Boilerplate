// queryLogger.js
export const queryLogger = async (req, res, next) => {
  const start = process.hrtime(); // Record the start time

  // When the response finishes
  res.on('finish', () => {
    const diff = process.hrtime(start); // Get the time difference
    const timeTaken = (diff[0] * 1e9 + diff[1]) / 1e6; // Convert nanoseconds to milliseconds

    console.log(
      `Method: ${req.method}, URL: ${req.originalUrl}, Query Time: ${timeTaken.toFixed(2)} ms`,
    );
  });

  next(); // Pass control to the next middleware or route handler
};
