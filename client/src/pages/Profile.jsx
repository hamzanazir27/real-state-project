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
<<<<<<< HEAD
  const [imageError, setImageError] = useState(false);
=======
>>>>>>> 94168805edda9ef9108ba9836007762ee5f762a3

  const [file, setFile] = useState(null);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState("");
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listingError, setListingError] = useState(false);
  const [allListing, setAllLising] = useState([]);
  const dispatch = useDispatch();

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

<<<<<<< HEAD
  // Create a fallback avatar using data URL (always works offline)
  const fallbackAvatar =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='Arial' font-size='14'%3EAvatar%3C/text%3E%3C/svg%3E";

=======
>>>>>>> 94168805edda9ef9108ba9836007762ee5f762a3
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

<<<<<<< HEAD
  // Reset image error when formData.avatar or currentUser.avatar changes
  useEffect(() => {
    setImageError(false);
  }, [formData.avatar, currentUser.avatar]);

=======
>>>>>>> 94168805edda9ef9108ba9836007762ee5f762a3
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
<<<<<<< HEAD
=======
      // Implement delete account logic here
>>>>>>> 94168805edda9ef9108ba9836007762ee5f762a3
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
<<<<<<< HEAD
=======
      //
>>>>>>> 94168805edda9ef9108ba9836007762ee5f762a3
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

  const handleShowListing = async () => {
<<<<<<< HEAD
=======
    // allListing,setAllLising
>>>>>>> 94168805edda9ef9108ba9836007762ee5f762a3
    try {
      setListingError(false);

      const res = await fetch(`/api/users/listing/${currentUser._id}`);
      const data = await res.json();
      if (!res.ok || data.success === false) {
        setListingError(true);
        setAllLising([]);
      } else {
<<<<<<< HEAD
=======
        // console.log(data);
>>>>>>> 94168805edda9ef9108ba9836007762ee5f762a3
        setAllLising(data);
      }
    } catch (error) {
      setListingError(true);
      setAllLising([]);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        console.log("Error occurred during delete listing");
        return;
      }

<<<<<<< HEAD
=======
      // console.log("Listing deleted successfully");
>>>>>>> 94168805edda9ef9108ba9836007762ee5f762a3
      setAllLising((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

<<<<<<< HEAD
  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    }
  };

  // Determine which image source to use
  const getImageSource = () => {
    if (imageError) {
      return fallbackAvatar;
    }
    return formData.avatar || currentUser.avatar || fallbackAvatar;
  };

=======
>>>>>>> 94168805edda9ef9108ba9836007762ee5f762a3
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
<<<<<<< HEAD
            src={getImageSource()}
            alt="profile"
            onError={handleImageError}
=======
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/96/cccccc/ffffff?text=Avatar";
            }}
>>>>>>> 94168805edda9ef9108ba9836007762ee5f762a3
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
<<<<<<< HEAD
          className="bg-green-700 text-white uppercase p-3 text-center rounded-lg hover:opacity-95 disabled:cursor-not-allowed"
=======
          className="bg-green-700 text-white uppercase p-3 text-center rounded-lg hover:opacity-95 disabled:cursor-not-allowed 
           "
>>>>>>> 94168805edda9ef9108ba9836007762ee5f762a3
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
<<<<<<< HEAD

      <button
        onClick={handleShowListing}
        className="text-green-700 text-center w-full my-4 hover:underline"
=======
      <button
        onClick={handleShowListing}
        className="text-green-700 text-center  w-full my-4 hover:underline"
>>>>>>> 94168805edda9ef9108ba9836007762ee5f762a3
      >
        Show Listing
      </button>

      {listingError && (
<<<<<<< HEAD
        <span className="text-red-700 mt-5">Error showing listings</span>
=======
        <span className=" text-red-700 mt-5">Errors Showing Listing </span>
>>>>>>> 94168805edda9ef9108ba9836007762ee5f762a3
      )}

      {allListing && allListing.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="font-semibold text-2xl text-center my-5">
<<<<<<< HEAD
            Your Listings
=======
            Your Listing
>>>>>>> 94168805edda9ef9108ba9836007762ee5f762a3
          </h1>

          {allListing.map((listing) => {
            return (
              <div
                key={listing._id}
                className="flex justify-between items-center w-full bg-gray-50 rounded-md p-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    className="w-16 h-16 object-contain"
<<<<<<< HEAD
                    alt={listing.name}
                    onError={(e) => {
                      e.target.src = fallbackAvatar;
                    }}
=======
>>>>>>> 94168805edda9ef9108ba9836007762ee5f762a3
                  />
                </Link>
                <Link to={`/listing/${listing._id}`}>
                  <h3 className="text-slate-700 font-semibold hover:underline truncate">
                    {listing.name}
                  </h3>
                </Link>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleDeleteListing(listing._id)}
                    className="text-red-700 hover:underline uppercase"
                  >
                    delete
                  </button>
                  <Link
                    to={`/updatelisting/${listing._id}`}
                    className="text-green-700 hover:underline uppercase"
                  >
                    edit
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Profile;
