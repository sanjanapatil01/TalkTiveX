import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudanary.js";

//signup
export const signup = async (req, res) => {
    const { email, password, fullName, profilePic, bio } = req.body;
    
    try {
        if(!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing required fields"});
        }
        
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.json({success: false, message: "Account already exists with this email"});
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        });

        const token = generateToken(newUser._id);
        
        // ✅ Fixed: Return 'user' instead of 'userData' to match frontend
        res.json({
            success: true,
            user: newUser,  // Changed from userData to user
            token,
            message: "Account created successfully!"
        });
  
    } catch(error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if(!email || !password) {
            return res.json({success: false, message: "Email and password are required"});
        }
        
        const userData = await User.findOne({ email });
        if(!userData) {
            return res.json({success: false, message: "Invalid email or password"});
        }

        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if(!isPasswordValid) {
            return res.json({success: false, message: "Invalid email or password"});
        }  
        
        const token = generateToken(userData._id);
        
        // ✅ Fixed: Return 'user' instead of 'userData' to match frontend
        res.json({
            success: true,
            user: userData,  // Changed from userData to user
            token,
            message: "Login successful!"
        });

    } catch(error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//update profile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, profilePic, bio } = req.body;
        const userId = req.user._id;
        let updatedUser;

        if(!profilePic) {
            // ✅ Update without profile picture
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { bio, fullName },
                { new: true }
            );
        } else {
            // ✅ Upload image to cloudinary and update
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { 
                    profilePic: upload.secure_url,
                    bio,
                    fullName 
                },
                { new: true }
            );
        }

        // ✅ Fixed: Proper success response
        res.json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully"
        });
        
    } catch(error) {
        console.log(error.message);
        // ✅ Fixed: Proper error response (was incomplete before)
        res.json({
            success: false,
            message: error.message
        });
    }
}

// ✅ Add check auth endpoint
export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json({
            success: true,
            user
        });
    } catch(error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
}
