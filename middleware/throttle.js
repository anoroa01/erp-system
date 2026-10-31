const { rateLimit } = require("express-rate-limit");

const makeLimiter = () =>
  rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 30,
    skipSuccessfulRequests: true,
    message: { error: "Too many requests, please try again later." },
  });

const signInLimiter = makeLimiter();
const signUpLimiter = makeLimiter();

module.exports = {
  signInLimiter,
  signUpLimiter,
};
