const express = require("express");
const router = express.Router();

const account = require("../../controllers/accountController");
const { requireAuth } = require("../../middleware/guard");
const { signInLimiter, signUpLimiter } = require("../../middleware/throttle");
const upload = require("../../middleware/imageUploader");

router.post("/signup", signUpLimiter, account.signUp);
router.post("/signin", signInLimiter, account.signIn);

router.get("/confirm-email/:token", account.confirmEmail);
router.post("/resend-confirmation", account.resendConfirmation);

router.post("/refresh-access", account.refreshAccessToken);
router.post("/signout", account.signOut);

router.post("/request-password-reset", account.requestPasswordReset);
router.post("/password-reset/:token", account.resetPassword);

router.get("/profile", requireAuth, account.getProfile);
router.patch(
  "/profile",
  requireAuth,
  upload.single("picture"),
  account.editProfile,
);

module.exports = router;
