import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";

function Profile() {
  const fileref = useRef();
  const { currentUser } = useSelector((state) => state.user);

  // State for file upload
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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

  const handleFileUpload = async (file) => {
    // Reset states
    setFileUploadError(false);
    setFilePercentage(0);

    // Validate file
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setFileUploadError(true);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFileUploadError(true);
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    uploadFormData.append("folder", "avatars"); // Optional: organize in folders

    try {
      // Show initial progress
      setFilePercentage(10);

      console.log("📤 Starting upload to:", CLOUDINARY_URL);
      console.log("📁 Upload data:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      // Upload to Cloudinary (no fake progress)
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: uploadFormData,
      });

      console.log("📡 Response status:", response.status);

      // Check response
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response error:", errorText);

        if (response.status === 401) {
          throw new Error(
            "401: Check your Cloud Name and Upload Preset. Make sure preset is UNSIGNED!"
          );
        } else if (response.status === 400) {
          throw new Error("400: Invalid file or preset configuration");
        } else {
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }
      }

      const data = await response.json();
      console.log("📊 Upload response:", data);

      // Check if upload was successful
      if (data.secure_url) {
        setFilePercentage(100);

        // Update form data with new image URL
        setFormData((prevData) => ({
          ...prevData,
          avatar: data.secure_url,
        }));

        console.log("✅ Image uploaded successfully:", data.secure_url);
      } else {
        throw new Error("Upload failed - no URL returned");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      setFileUploadError(true);
      setFilePercentage(0);

      // Show specific error message
      if (error.message.includes("401")) {
        alert(
          "❌ Upload failed: Wrong Cloud Name or Upload Preset. Check your Cloudinary settings!"
        );
      }
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add your update user API call here
    console.log("Form data to submit:", formData);
  };

  return (
    <div className="mx-auto p-3 max-w-lg">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Hidden file input */}
        <input
          onChange={handleFileSelect}
          type="file"
          accept="image/*"
          ref={fileref}
          hidden
        />

        {/* Profile Image */}
        <img
          onClick={() => fileref.current.click()}
          className="w-24 h-24 rounded-full self-center mt-2 cursor-pointer object-cover hover:opacity-80 transition-opacity"
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />

        {/* Upload Status */}
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              ❌ Error uploading image (max 10MB, images only)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-blue-700">
              ⏳ Uploading {filePercentage}%
            </span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">
              ✅ Image successfully uploaded!
            </span>
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
          className="p-3 rounded-lg bg-white border"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
        />

        {/* Email Input */}
        <input
          onChange={handleInputChange}
          type="email"
          className="p-3 rounded-lg bg-white border"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
        />

        {/* Password Input */}
        <input
          onChange={handleInputChange}
          type="password"
          className="p-3 rounded-lg bg-white border"
          placeholder="password"
          id="password"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80"
          disabled={filePercentage > 0 && filePercentage < 100}
        >
          {filePercentage > 0 && filePercentage < 100
            ? "Uploading..."
            : "Update"}
        </button>
      </form>

      {/* Delete Account and Sign Out */}
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer hover:underline">
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer hover:underline">
          Sign Out
        </span>
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
