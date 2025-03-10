import { v2 as cloudinaryV2 } from 'cloudinary';

export const cloudinary = () => {
        // ✅ Configuration
        cloudinaryV2.config({ 
            cloud_name: process.env.CLOUDINARY_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        return cloudinaryV2;
}
export default cloudinary;