require('dotenv').config()
const cloudinary = require('cloudinary').v2

// Configuration
cloudinary.config({
    cloud_name: 'dd3egmona',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
    secure: true    
});

const generateImageUrl = async function (uploadImage) {
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(uploadImage.tempFilePath, {
        // public_id: uploadImage.name,
        resource_type: "auto",
        folder: "uploaded",
        use_filename: true,
        unique_filename: false,
    })

    // cloudinary API
    console.log('calling api')
    console.log(uploadResult)
    let returnUrl = await cloudinary.url(uploadResult.public_id, { transformation: [
        {width: 400, height: 400},
        {crop: 'fill', gravity: 'auto'},
        {fetch_format: 'auto'},
    ]})
    
    // return uploadResult.url
    return returnUrl
}

module.exports = { generateImageUrl }

// https://dev.to/terieyenike/how-to-upload-images-to-cloudinary-using-express-and-template-engines-7g4