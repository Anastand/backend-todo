// src/middleware/loggermiddleware.js
export default function loggermiddleware(req, res, next) {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.url}`
  );
  // don't send a response here — just forward to the next middleware/route
  next();
}