import { compareSync, hashSync } from "bcrypt";
import { BlacklistTokens, User } from "../../../DB/models/index.js";
import { Decryption, Encryption } from "../../../Utils/index.js";
import cloudinary from "../../../config/cloudinary.config.js";


// ✅ Update Profile Service
export const updateProfileServices = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const { phone, firstName, lastName, gender, DOB } = req.body;
        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (phone) user.phone = await Encryption({ value: phone, secretKey: process.env.ENCRYPTION_SECRET_KEY });
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (gender) user.gender = gender;
        if (DOB) user.DOB = new Date(DOB);

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user: { firstName: user.firstName, lastName: user.lastName, phone: user.phone, gender: user.gender, DOB: user.DOB } });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}

// ✅ Get User Profile Service
export const profileServices = async (req, res) => {
    try {
        // ✅ Get the user ID from the request
        const { _id } = req.authUser;
        // ✅ Check the user from the database
        const user = await User.findById(_id);
        // ✅ Check if the user exists
        if (!user) return res.status(404).json({ message: 'User not found' });
        // ✅ Decrypt the phone number
        user.phone = await Decryption({ chiper: user.phone, secretKey: process.env.ENCRYPTION_SECRET_KEY });
        // ✅ Return the profile
        res.status(200).json({ message: 'Profile retrieved successfully', user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}

// ✅ Get User Profile Service for other users
export const profileServicesForOtherUsers = async (req, res) => {
    try {
        // ✅ Get the user ID from the request
        const { _id } = req.params;
        // ✅ Check the user from the database
        const user = await User.findById(_id);
        // ✅ Check if the user exists
        if (!user) return res.status(404).json({ message: 'User not found' });
        // ✅ Decrypt the phone number
        user.phone = await Decryption({ chiper: user.phone, secretKey: process.env.ENCRYPTION_SECRET_KEY });
        // ✅ Return the profile
        res.status(200).json({ message: 'Profile retrieved successfully', username: user.username, phone: user.phone, profilePic: user.profilePic, coverPic: user.coverPic });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}

// ✅ Update Password Service
export const updatePasswordServices = async (req, res) => {
    try {
        // ✅ Destructure the request body
        const { _id } = req.loggedInUser;
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isPasswordValid = compareSync(oldPassword, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

        // ✅ hash the new password
        const hashedPassword = hashSync(newPassword, +process.env.SALT_ROUNDS);
        user.password = hashedPassword;
        user.changeCredentialTime = new Date();
        await user.save();

        // ✅ revoke user token
        await BlacklistTokens.create(req.loggedInUser.token);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

// ✅ Upload Profile Picture Service
export const uploadProfilePicServices = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const { file } = req

        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        const url = `${req.protocol}://${req.headers.host}/${file.path}`;
        const user = await User.findByIdAndUpdate(_id, { profilePic: url }, { new: true });

        res.status(200).json({ message: 'Profile picture uploaded successfully', user: { profilePic: url } });

    } catch (error) {

        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });

    }
}

// ✅ Upload Cover Picture Service
export const uploadCoverPicServices = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const { file } = req

        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        const url = `${req.protocol}://${req.headers.host}/${file.path}`;
        const user = await User.findByIdAndUpdate(_id, { coverPic: url }, { new: true });

        res.status(200).json({ message: 'Cover picture uploaded successfully', user: { coverPic: url } });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

// ✅ Upload Profile Picture Service on Cloud
export const uploadProfilePicServicesCloud = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const { file } = req

        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        const { secure_url, public_id } = await cloudinary().uploader.upload(file.path, {
            folder: `${process.env.CLOUDINARY_FOLDER}/Users/Profile`,
            // public_id: file.filename,
            // resource_type: 'auto',
            // use_filename: true,
            //unique_filename: false
        })

        const user = await User.findByIdAndUpdate(_id, { profilePic: { secure_url, public_id } }, { new: true });

        res.status(200).json({ message: 'Profile picture uploaded successfully', user: { profilePic: { secure_url, public_id } } });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

// ✅ Upload Cover Picture Service on Cloud
export const uploadCoverPicServicesCloud = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const { file } = req

        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        const { secure_url, public_id } = await cloudinary().uploader.upload(file.path, {
            folder: `${process.env.CLOUDINARY_FOLDER}/Users/Cover`,
            // public_id: file.filename,
            // resource_type: 'auto',
            // use_filename: true,
            //unique_filename: false
        })

        const user = await User.findByIdAndUpdate(_id, { coverPic: { secure_url, public_id } }, { new: true });

        res.status(200).json({ message: 'Cover picture uploaded successfully', user: { coverPic: { secure_url, public_id } } });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

// ✅ Delete Profile Picture Service
export const deleteProfilePicServices = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const user = await User.findByIdAndUpdate(_id, { profilePic: null }, { new: true });
        const profilepic = user.profilePic;
        const profilepicpublicid = user.profilePic.public_id;
        if (profilepic) {
            await cloudinary().uploader.destroy(profilepicpublicid);
        }
        res.status(200).json({ message: 'Profile picture deleted successfully', user: { profilePic: null } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

// ✅ Delete Cover Picture Service
export const deleteCoverPicServices = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const user = await User.findByIdAndUpdate(_id, { coverPic: null }, { new: true });
        const coverpic = user.coverPic;
        const coverpicpublicid = user.coverPic.public_id;
        if (coverpic) {
            await cloudinary().uploader.destroy(coverpicpublicid);
        }
        res.status(200).json({ message: 'Cover picture deleted successfully', user: { coverPic: null } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}
// ✅ Delete User Account
export const deleteAccountServices = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const deleteUser = await User.updateOne({ _id }, { isDeleted: true, deletedAt: new Date() });
        if (!deleteUser) return res.status(404).json({ message: 'User not found' });

        const user = await User.findById(_id);
        const profilepic = user.profilePic;
        const coverpic = user.coverPic;

        if (profilepic && profilepic.public_id) {
            const profilepicpublicid = profilepic.public_id;
            await cloudinary().uploader.destroy(profilepicpublicid);
        }

        if (coverpic && coverpic.public_id) {
            const coverpicpublicid = coverpic.public_id;
            await cloudinary().uploader.destroy(coverpicpublicid);
        }

        await BlacklistTokens.create(req.loggedInUser.token);
        res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}