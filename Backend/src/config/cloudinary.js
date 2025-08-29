import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verify configuration
console.log('Cloudinary Configuration Status:', {
  isConfigured: cloudinaryConfig && cloudinaryConfig.cloud_name && cloudinaryConfig.api_key && cloudinaryConfig.api_secret ? 'Yes' : 'No',
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
  apiKey: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
  apiSecret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
});

export default cloudinary;