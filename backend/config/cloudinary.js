const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio', // Cloudinary folder name
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now();
      return `${uniqueSuffix}-${file.fieldname}`;
    },
  },
});

module.exports = { cloudinary, storage };