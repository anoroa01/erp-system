const express = require("express");
const router = express.Router();

const admin = require("../../controllers/adminController");
const { requireAuth, requireAdmin } = require("../../middleware/guard");

router.use(requireAuth);

router.get("/users", requireAdmin, admin.listUsers);
router.get("/users/:id", requireAdmin, admin.getUser);
router.patch("/users/:id/approve", requireAdmin, admin.approveUser);
router.patch("/users/:id/deactivate", requireAdmin, admin.deactivateUser);
router.delete("/users/:id", requireAdmin, admin.removeUser);

module.exports = router;
