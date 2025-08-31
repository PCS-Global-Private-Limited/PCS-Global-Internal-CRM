import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js"

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "No image data provided" });
    }

    // Verify Cloudinary configuration
    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.error("Cloudinary Configuration Error:", {
        cloudName: !!config.cloud_name,
        apiKey: !!config.api_key,
        apiSecret: !!config.api_secret,
        envCloudName: process.env.CLOUDINARY_CLOUD_NAME,
        envApiKey: process.env.CLOUDINARY_API_KEY,
        envApiSecret: !!process.env.CLOUDINARY_API_SECRET // Don't log the actual secret
      });
      return res.status(500).json({ message: "Cloud storage not properly configured" });
    }

    try {
      // Verify image data format
      if (!image.startsWith('data:image')) {
        return res.status(400).json({ message: "Invalid image format" });
      }

      // Upload to Cloudinary
      const uploadOptions = {
        folder: "user-avatars",
        public_id: `avatar-${req.user.userId}-${Date.now()}`,
        overwrite: true,
        resource_type: "auto"
      };

      console.log('Attempting Cloudinary upload with config:', {
        cloudName: config.cloud_name,
        hasApiKey: !!config.api_key,
        folder: uploadOptions.folder
      });
      
      const result = await cloudinary.uploader.upload(image, uploadOptions);
      console.log('Cloudinary upload successful:', { url: result.secure_url });

      // Update user profile with Cloudinary URL
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If there's an existing avatar, delete it from Cloudinary
      if (user.avatar) {
        try {
          const oldPublicId = user.avatar.split("/").pop().split(".")[0];
          if (oldPublicId) {
            await cloudinary.uploader.destroy(`user-avatars/${oldPublicId}`);
          }
        } catch (deleteError) {
          console.error("Error deleting old avatar:", deleteError);
        }
      }

      user.avatar = result.secure_url;
      await user.save();

      res.json({ avatarUrl: result.secure_url });
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error details:", cloudinaryError);
      res.status(500).json({ 
        message: "Failed to upload image to cloud storage",
        error: cloudinaryError.message 
      });
    }
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ 
      message: "Error updating avatar",
      error: error.message 
    });
  }
};

export const addSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user.skills.includes(skill)) {
      user.skills.push(skill);
      await user.save();
    }

    res.json({ skills: user.skills });
  } catch (error) {
    res.status(500).json({ message: "Error adding skill" });
  }
};

export const removeSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    const user = await User.findById(req.user.userId);

    user.skills = user.skills.filter((s) => s !== skill);
    await user.save();

    res.json({ skills: user.skills });
  } catch (error) {
    res.status(500).json({ message: "Error removing skill" });
  }
};