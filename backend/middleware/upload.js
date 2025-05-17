const multer = require('multer');

// Configure storage
const {storage} = require('../config/cloudinary');

const upload = multer({storage});

module.exports = upload;