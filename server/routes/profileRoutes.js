const express = require("express");
const router = express.Router();
const { createProfile, updateProfile, deleteProfile, getProfile, getAllProfiles, uploadProfileImage } = require("../controllers/profile.controller");
const authenticate = require("../Middleware/authentication");
const upload = require("../Middleware/upload");

router.post("/", authenticate, createProfile);
router.get("/", getAllProfiles);
router.put("/:id", authenticate, updateProfile);
router.delete("/:id", authenticate, deleteProfile);
router.get("/:id", getProfile);
router.post("/:id/upload-image", authenticate, upload.single('image'), uploadProfileImage);

module.exports = router;