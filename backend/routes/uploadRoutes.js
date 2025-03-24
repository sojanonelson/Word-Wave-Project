const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { uploadProfileImage, uploadImage } = require("../controllers/uploadController");

const router = express.Router();

router.post("/profile", upload.single("profileImage"), uploadProfileImage);
router.post("/image", upload.single("image"), uploadImage);

module.exports = router;
