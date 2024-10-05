require('dotenv').config();

const cloudinary = require('cloudinary').v2; 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


async function uploadPhoto(uploadedFile) {
    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto' }, 
                (error, result) => {
                    if (error) {
                        console.error('Error uploading to Cloudinary:', error);
                        return reject(error);
                    }
                    resolve(result);
                }
            );
            
            stream.end(uploadedFile.data);
        });

        return result.secure_url; 
    } catch (error) {
        console.error('Error in upload process:', error.message);
        throw error;
    }
}

module.exports = {
    cloudinary,
    uploadPhoto}