import { compareSync, hashSync } from "bcrypt";
import { User, BlacklistTokens } from "../../../DB/models/index.js";
import { Encryption } from "../../../Utils/encryption.utils.js";
import { emitter } from "../../../Services/send-email.services.js";
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { createToken, verifyToken } from "../../../Utils/tokens.utils.js";
import { OAuth2Client } from 'google-auth-library';
import { ProvidersEnum } from "../../../constants/constants.js";

// ✅ Sign Up Service
export const SignUpservices = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, phone, age, gender, DOB } = req.body;

        // ✅ Confirm Password Check
        if (!confirmPassword || password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // ✅ Check if email already exists
        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // ✅ Check if phone already exists
        const isPhoneExist = await User.findOne({ phone });
        if (isPhoneExist) {
            return res.status(409).json({ message: 'Phone number already exists' });
        }

        // ✅ Hash the password
        const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS);

        // ✅ Encrypt the phone number
        const encryptedPhone = Encryption({ value: phone, secretKey: process.env.ENCRYPTION_SECRET_KEY });

        // ✅ Create a new user
        const newUser = await User.create({ firstName, lastName, email, password: hashedPassword, phone: encryptedPhone, age, gender, DOB });
        if (!newUser) {
            return res.status(500).json({ message: 'User creation failed, please try again' });
        }

        // ✅ Generate token
        const token = createToken({ payload: { email }, secretKey: process.env.JWT_SECRET_KEY, option: { expiresIn: '2h' } });

        // ✅ Confirm Email Link
        const confirmEmailLink = `${req.protocol}://${req.headers.host}/auth/verify/${token}`

        // ✅ Send verification Email
        emitter.emit('sendEmail', [email, 'Verify Your Email', { text: `Verify Your Email`, data: firstName, confirmEmailLink }]);

        // ✅ Success Response
        return res.status(201).json({ message: 'User created successfully', user: newUser });

    } catch (error) {
        console.error('Sign Up error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
// ✅ Google Sign Up Service
export const GoogleSignUpServices = async (req, res) => {
    try {
        // ✅ Get idToken from request
        const { idToken } = req.body;
        const client = new OAuth2Client();

        // ✅ Verify idToken
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email_verified, email, given_name, family_name, photoUrl } = payload
        if (!email_verified) {
            res.status(400).json({ message: 'Invalid gmail credentials' })
        }

        // ✅ Check if user already exists
        const isUserExist = await User.findOne({ email })
        if (isUserExist) {
            res.status(409).json({ message: 'User already exists' })
        }
        // ✅ Create a new user
        const user = new User({
            firstName: given_name,
            lastName: family_name,
            email,
            profilePic: { secure_url: photoUrl },
            provider: ProvidersEnum.GOOGLE,
            isConfirmed: true,
            password: hashSync(uuid(), +process.env.SALT_ROUNDS)
        })
        await user.save()


        res.status(201).json({ message: 'User created successfully', user })

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}
// ✅ Verify Email Service
export const VerifyEmailServices = async (req, res) => {
    try {
        const { token } = req.params;
        const decodedData = verifyToken({ token, secretKey: process.env.JWT_SECRET_KEY });
        const user = await User.findOneAndUpdate({ email: decodedData.email }, { isConfirmed: true }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Email verified successfully', user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}
// ✅ Login Service
export const LoginServices = async (req, res) => {
    try {

        const { email, password } = req.body;

        // ✅ Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        // ✅ Check if the password is correct
        const isPasswordCorrect = compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // ✅ Generate JWT
        const accesstoken = createToken({ payload: { _id: user._id, email: user.email }, secretKey: process.env.JWT_SECRET_LOGIN_KEY, options: { expiresIn: '1h', jwtid: uuid() } });
        const refreshtoken = createToken({ payload: { _id: user._id, email: user.email }, secretKey: process.env.JWT_SECRET_REFRESH_KEY, options: { expiresIn: '2d', jwtid: uuid() } });

        return res.status(200).json({ message: 'Logged in successfully', isPasswordCorrect, accesstoken, refreshtoken });


    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
}
// ✅ Google Login Service
export const GoogleLoginServices = async (req, res) => {
    try {
        // ✅ Get idToken from request
        const { idToken } = req.body;
        const client = new OAuth2Client();

        // ✅ Verify idToken
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email_verified, email } = payload
        if (!email_verified) {
            return res.status(400).json({ message: 'Invalid gmail credentials' })
        }

        const user = await User.findOne({ email, provider: ProvidersEnum.GOOGLE })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // ✅ Generate JWT
        const accesstoken = createToken({ payload: { _id: user._id, email: user.email }, secretKey: process.env.JWT_SECRET_LOGIN_KEY, options: { expiresIn: '1h', jwtid: uuid() } });
        const refreshtoken = createToken({ payload: { _id: user._id, email: user.email }, secretKey: process.env.JWT_SECRET_REFRESH_KEY, options: { expiresIn: '2d', jwtid: uuid() } });

        res.status(200).json({ message: 'Logged in successfully', tokens: { accesstoken, refreshtoken } });


    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}
// ✅ Refresh Token Service
export const RefreshTokenServices = async (req, res) => {
    try {
        const { refreshtoken } = req.headers;
        const decodedData = verifyToken({ token: refreshtoken, secretKey: process.env.JWT_SECRET_REFRESH_KEY });
        const accesstoken = createToken({ payload: { _id: decodedData._id, email: decodedData.email }, secretKey: process.env.JWT_SECRET_LOGIN_KEY, options: { expiresIn: '1h' } });
        res.status(200).json({ message: 'Token refreshed successfully', accesstoken });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}
// ✅ Logout Service
export const LogoutServices = async (req, res) => {
    try {
        const { accesstoken, refreshtoken } = req.headers;
        const decodedData = verifyToken({ token: accesstoken, secretKey: process.env.JWT_SECRET_LOGIN_KEY });
        const decodedRefreshToken = verifyToken({ token: refreshtoken, secretKey: process.env.JWT_SECRET_REFRESH_KEY });

        const revokeToken = [
            {
                tokenId: decodedData.jti,
                expiresAt: decodedData.exp
            },
            {
                tokenId: decodedRefreshToken.jti,
                expiresAt: decodedRefreshToken.exp
            }
        ]
        await BlackListTokens.insertMany(revokeToken);
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}
// ✅ Forget Password Service
export const ForgetPasswordServices = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'This email is not registered' });
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        // ✅ Send otp Email
        emitter.emit('sendEmail', [user.email, 'Reset Password', { text: `Your OTP code is ${otp}` }]);
        // ✅ Hash the otp
        const hashedOtp = hashSync(otp.toString(), +process.env.SALT_ROUNDS);
        // ✅ Update the db
        user.forgetOtp = hashedOtp;
        await user.save();
        res.status(200).json({ message: 'Otp sent successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}
// ✅ Reset Password Service
export const resetPasswordServices = async (req, res) => {
    try {
        const { email, otp, password, confirmpassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'This email is not registered' });
        }
        const isOtpValid = compareSync(otp.toString(), user.forgetOtp);
        if (!isOtpValid) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS);
        await user.updateOne({ password: hashedPassword, $unset: { forgetOtp: "" } });

        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}