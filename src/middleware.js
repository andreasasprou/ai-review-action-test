// Rate limiting and logging middleware

function rateLimiter(windowMs, maxRequests) {
  const requests = {};

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    if (!requests[ip]) {
      requests[ip] = [];
    }

    // Memory leak: never cleaning up old entries
    requests[ip].push(now);

    const recentRequests = requests[ip].filter(
      (time) => now - time < windowMs
    );

    if (recentRequests.length > maxRequests) {
      return res.status(429).json({ error: "Too many requests" });
    }

    next();
  };
}

function requestLogger(req, res, next) {
  // Logging sensitive data
  console.log(
    JSON.stringify({
      method: req.method,
      path: req.path,
      body: req.body,
      headers: req.headers,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    })
  );
  next();
}

module.exports = { rateLimiter, requestLogger };
// force review v2
