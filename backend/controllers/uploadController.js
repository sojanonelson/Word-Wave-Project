const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Multer to use Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder
    format: async (req, file) => "jpg", // Convert to JPG
    public_id: (req, file) => `image_${Date.now()}`,
  },
});

const upload = multer({ storage: storage });

// Upload profile image
// Upload profile image
// Upload profile image
exports.uploadProfileImage = async (req, res) => {
    try {
      if (!req.file || !req.file.path) {
        return res.status(400).json({ success: false, message: "No file uploaded or Cloudinary failed" });
      }
      res.json({ 
        success: true, 
        message: "Profile image uploaded", 
        imageUrl: req.file.path  // Cloudinary URL
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Upload failed", error: error.message });
    }
  };
  
  // Upload general image
  exports.uploadImage = async (req, res) => {
    try {
      if (!req.file || !req.file.path) {
        return res.status(400).json({ success: false, message: "No file uploaded or Cloudinary failed" });
      }
      res.json({ 
        success: true, 
        message: "Image uploaded successfully", 
        imageUrl: req.file.path  // Cloudinary URL
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Upload failed", error: error.message });
    }
  };
  
  

// Export multer upload instance
exports.upload = upload;
