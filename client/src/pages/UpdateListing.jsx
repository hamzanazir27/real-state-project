import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function UpdateListing() {
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",

    // Property type (radio-style checkboxes)
    type: "rent", // Default to rent

    parking: false,
    furnished: false,
    offer: false,

    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,

    imageUrls: [],
  });

  //   console.log(formData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  // At the top of your component, add your Cloudinary config
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  useEffect(() => {
    let abortController = new AbortController(); //  cleanup for fetch for industory standard

    const getListing = async (id) => {
      try {
        setError(null); // reset error before request

        const res = await fetch(`/api/listing/get/${id}`, {
          signal: abortController.signal,
        });

        if (!res.ok) {
          console.log("Failed to fetch listing");
        }

        const data = await res.json();
        // console.log(data); // only if not aborted
        setFormData(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err.message);
        }
      }
    };

    getListing(params.listingid);

    return () => {
      abortController.abort(); //  cancel request on unmount
    };
  }, []);

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      uploadFormData.append("folder", "listings");

      fetch(CLOUDINARY_URL, {
        method: "POST",
        body: uploadFormData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Upload failed");
          }
          return response.json();
        })
        .then((data) => {
          if (data.secure_url) {
            resolve(data.secure_url);
          } else {
            throw new Error("No URL returned");
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];

      // Create upload promises for each file
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      try {
        // Wait for all uploads to complete
        const urls = await Promise.all(promises);

        // Update form data with new URLs
        setFormData((prevData) => ({
          ...prevData,
          imageUrls: formData.imageUrls.concat(urls),
        }));

        setImageUploadError(false);
        setUploading(false);
      } catch (error) {
        setImageUploadError("Image upload failed (2 MB max per image)");
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    // Handle sale/rent type selection (radio-style behavior)
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    } else if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    } else if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  //update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validation checks
      if (formData.imageUrls.length < 1) {
        return setError("You must upload at least one image");
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        return setError("Discount price must be lower than regular price");
      }

      // Set loading states
      setLoading(true);
      setError(false);

      // Prepare data for submission
      const submitData = {
        ...formData,
        userRef: currentUser._id, // Add user reference
      };

      // Submit to backend API
      const res = await fetch(`/api/listing/update/${formData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      } else {
        // Success - navigate to the created listing
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Optional: Reset form after successful submission
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      address: "",
      type: "rent",
      parking: false,
      furnished: false,
      offer: false,
      bedrooms: 1,
      bathrooms: 1,
      regularPrice: 50,
      discountPrice: 0,
      imageUrls: [],
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form
        className="flex flex-col  sm:flex-row gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 flex-1 ">
          <input
            placeholder="Name"
            id="name"
            type="text"
            maxLength="62"
            minLength="10"
            className="bg-white p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            id="description"
            type="text"
            className="bg-white p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            placeholder="Address"
            id="address"
            type="text"
            className="bg-white p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.address}
          />
          {/* Checkboxes Section */}
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          {/* Number Inputs Section */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        {/*left end side in desktop */}

        {/* Right column start  */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="ml-2 font-normal text-gray-700">
              The first Image will be cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update listing"}
          </button>
          {imageUploadError && (
            <p className="text-red-700 text-sm">{imageUploadError}</p>
          )}
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>

        {/* Right column end  */}
      </form>
    </main>
  );
}

export default UpdateListing;
