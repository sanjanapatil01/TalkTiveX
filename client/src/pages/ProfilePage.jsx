import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile, loading } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Local loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Prevent double submissions
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (!selectedImg) {
        // ✅ Update without image
        await updateProfile({ fullName: name, bio });
      } else {
        // ✅ Convert image to base64 and update
        const reader = new FileReader();
        
        const base64Promise = new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(selectedImg);
        });

        const base64Image = await base64Promise;
        await updateProfile({ 
          profilePic: base64Image, 
          fullName: name, 
          bio 
        });
      }

      // ✅ Navigate after successful update
      navigate("/");
      
    } catch (error) {
      console.error("Profile update error:", error);
      // Error is already handled in AuthContext with toast
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle image selection with validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // ✅ Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG, JPG, and PNG files are allowed");
      return;
    }

    setSelectedImg(file);
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-xl shadow-lg">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1 w-full"
        >
          <h3 className="text-lg font-semibold">Profile Details</h3>

          {/* Upload Image */}
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={handleImageChange} // ✅ Use validation function
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
              disabled={isSubmitting} // ✅ Disable during submission
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser?.profilePic || assets.avatar_icon
              }
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span>Upload profile image</span>
          </label>

          {/* Name */}
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your name"
            disabled={isSubmitting} // ✅ Disable during submission
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
          />

          {/* Bio */}
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            required
            placeholder="Write profile bio"
            disabled={isSubmitting} // ✅ Disable during submission
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
          ></textarea>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || loading} // ✅ Disable during submission
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Submit"} {/* ✅ Show loading text */}
          </button>
        </form>

        {/* Side Image */}
        <img
          src={
            selectedImg
              ? URL.createObjectURL(selectedImg)
              : authUser?.profilePic || assets.logo_icon
          }
          alt="profile-preview"
          className="w-44 h-44 mr-4 rounded-full object-cover max-sm:mt-10"
        />
      </div>
    </div>
  );
};

export default ProfilePage;