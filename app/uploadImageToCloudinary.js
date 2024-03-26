// uploadImageToCloudinary.js

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'daqxhckof',
  api_key: '124389169118742',
  api_secret: 'YZkrJ8RdYHTkdiRmJxM0THgpSoc'
});

const uploadImageToCloudinary = async (base64String) => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'your-folder-name' // Optionally, specify a folder in Cloudinary
    });
    return result;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Error uploading image to Cloudinary');
  }
};

export default uploadImageToCloudinary;
