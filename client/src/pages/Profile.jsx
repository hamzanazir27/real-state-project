import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateStart,
  userUpdateSuccess,
  userUpdateFailure,
  deleteStart,
  userDeleteFailure,
  userDeleteSuccess,
  signoutStart,
  userSigoutFailure,
  userSigoutSucess,
} from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const fileRef = useRef();
  const navigate = useNavigate();
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [isSuccess, setSuccess] = useState(false);

  const [file, setFile] = useState(null);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState("");
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  // Trigger upload when file is selected
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleFileUpload = async (file) => {
    setFileUploadError("");
    setFilePercentage(0);

    // Validate file
    if (!file) return;

    // File size validation (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileUploadError("File size must be less than 10MB");
      return;
    }

    // File type validation
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setFileUploadError(
        "Please select a valid image file (JPG, PNG, GIF, WEBP)"
      );
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    uploadFormData.append("folder", "avatars");

    try {
      setFilePercentage(10);

      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorText = await response.text();

        let errorMessage = "Upload failed. Please try again.";

        if (response.status === 401) {
          errorMessage =
            "Authentication failed. Check your Cloudinary configuration.";
        } else if (response.status === 400) {
          errorMessage = "Invalid file or configuration error.";
        } else if (response.status === 413) {
          errorMessage = "File too large. Please choose a smaller image.";
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.secure_url) {
        setFilePercentage(100);
        setFormData((prevData) => ({
          ...prevData,
          avatar: data.secure_url,
        }));
      } else {
        throw new Error("Upload failed - no URL returned");
      }
    } catch (error) {
      setFileUploadError(error.message);
      setFilePercentage(0);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Clear previous errors
      setFileUploadError("");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    // Clear success message when user starts editing
    if (isSuccess) {
      setSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Don't submit if file is still uploading
    if (filePercentage > 0 && filePercentage < 100) {
      return;
    }

    // Check if there's anything to update
    const hasChanges = Object.keys(formData).length > 0;
    if (!hasChanges) {
      setFileUploadError("No changes to update");
      return;
    }

    setIsSubmitting(true);
    dispatch(updateStart());

    try {
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(userUpdateFailure(data.message || "Update failed"));
      } else {
        dispatch(userUpdateSuccess(data));
        setSuccess(true);
        setFormData({});
        setFilePercentage(0);
        setFile(null);
      }
    } catch (error) {
      dispatch(userUpdateFailure("Network error. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // Implement delete account logic here
      dispatch(deleteStart());
      try {
        const res = await fetch(`/api/users/delete/${currentUser._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        if (!res.ok || data.success === false) {
          dispatch(userDeleteFailure(data.message || "delete failed"));
        } else {
          const initialState = {
            currentUser: null,
            error: null,
            loading: false,
          };
          dispatch(userSigoutSucess(initialState));
          navigate("/signin");
        }
      } catch (error) {
        dispatch(userDeleteFailure("Network error. Please try again."));
      }
    }
  };

  const handleSignOut = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      dispatch(signoutStart());
      //
      try {
        const res = await fetch(`/api/auth/signout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (!res.ok || data.success === false) {
          dispatch(userSigoutFailure(data.message || "sign out failed"));
        } else {
          const initialState = {
            currentUser: null,
            error: null,
            loading: false,
          };
          dispatch(userSigoutSucess(initialState));
          navigate("/signin");
          console.log("signout");
        }
      } catch (error) {
        dispatch(userSigoutFailure("network error"));
      }
    }
  };

  return (
    <div className="mx-auto p-3 max-w-lg">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>

      <div className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Hidden file input */}
        <input
          onChange={handleFileSelect}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          ref={fileRef}
          hidden
        />

        {/* Profile Image */}
        <div className="relative self-center">
          <img
            onClick={() => fileRef.current.click()}
            className="w-24 h-24 rounded-full mt-2 cursor-pointer object-cover hover:opacity-80 transition-opacity border-4 border-gray-200"
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/96/cccccc/ffffff?text=Avatar";
            }}
          />
          {filePercentage > 0 && filePercentage < 100 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <span className="text-white text-xs font-semibold">
                {filePercentage}%
              </span>
            </div>
          )}
        </div>

        {/* Upload Status */}
        <p className="text-sm self-center text-center max-w-xs">
          {fileUploadError ? (
            <span className="text-red-700">{fileUploadError}</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-blue-700">Uploading {filePercentage}%</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            <span className="text-gray-500">
              Click image to upload new photo
            </span>
          )}
        </p>

        {/* Username Input */}
        <input
          onChange={handleInputChange}
          type="text"
          className="p-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Username"
          defaultValue={currentUser.username}
          id="username"
          autoComplete="username"
        />

        {/* Email Input */}
        <input
          onChange={handleInputChange}
          type="email"
          className="p-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Email"
          defaultValue={currentUser.email}
          id="email"
          autoComplete="email"
        />

        {/* Password Input */}
        <input
          onChange={handleInputChange}
          type="password"
          className="p-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="New Password (leave blank to keep current)"
          id="password"
          autoComplete="new-password"
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <span className="text-green-700 text-sm">
              Profile updated successfully!
            </span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80 disabled:cursor-not-allowed transition-opacity"
          disabled={
            (filePercentage > 0 && filePercentage < 100) ||
            isSubmitting ||
            loading
          }
        >
          {isSubmitting || loading
            ? "Updating..."
            : filePercentage > 0 && filePercentage < 100
            ? "Uploading..."
            : "Update Profile"}
        </button>

        <Link
          to="/createlisting"
          className="bg-green-700 text-white uppercase p-3 text-center rounded-lg hover:opacity-95 disabled:cursor-not-allowed 
           "
        >
          Create Listing
        </Link>
      </div>

      {/* Delete Account and Sign Out */}
      <div className="flex justify-between mt-5">
        <button
          onClick={handleDeleteAccount}
          className="text-red-700 cursor-pointer hover:underline focus:outline-none focus:underline"
        >
          Delete Account
        </button>
        <button
          onClick={handleSignOut}
          className="text-red-700 cursor-pointer hover:underline focus:outline-none focus:underline"
        >
          Sign Out
        </button>
      </div>

      {/* Upload Info */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          Supported: JPG, PNG, GIF, WEBP • Max size: 10MB
        </p>
      </div>
    </div>
  );
}

export default Profile;
