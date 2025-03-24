const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder
    format: async (req, file) => "png", // Ensure format consistency
    public_id: (req, file) => `image_${Date.now()}`, // Unique ID
  },
});

const upload = multer({ storage });

module.exports = upload;
