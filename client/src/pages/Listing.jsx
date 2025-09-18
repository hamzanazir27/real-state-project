import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  FaBed,
  FaBath,
  FaParking,
  FaChair,
  FaShare,
  FaLocationArrow,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Contact from "../components/Contact";
import { useSelector } from "react-redux";

function Listing() {
  const [contact, setContact] = useState(false);
  const [copied, setCopied] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();

  useEffect(() => {
    let abortController = new AbortController();

    const getListing = async (id) => {
      try {
        setLoading(true);
        setError(false);

        const res = await fetch(`/api/listing/get/${id}`, {
          signal: abortController.signal,
        });

        if (!res.ok) {
          throw new Error("Failed to fetch listing");
        }

        const data = await res.json();

        // Check if API returned success: false
        if (data.success === false) {
          setError(true);
          return;
        }

        setListing(data);
        setError(false);
        console.log(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err.message);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    // Make sure we have the listing ID before making the request
    if (params.listingId) {
      console.log("Fetching listing with ID:", params.listingId);
      getListing(params.listingId);
    }

    return () => {
      abortController.abort();
    };
  }, [params.listingId]);

  // Handle share functionality with better UX
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading state with spinner
  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-700"></div>
          <p className="text-xl text-slate-600">Loading listing...</p>
        </div>
      </main>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-2xl text-red-600 mb-4">Something went wrong!</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-700 text-white px-6 py-2 rounded hover:opacity-95"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // No listing data
  if (!listing) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-slate-600">No listing found</p>
      </main>
    );
  }

  return (
    <main>
      {/* Image Gallery */}
      {listing.imageUrls && listing.imageUrls.length > 0 ? (
        <Swiper
          modules={[Navigation]}
          navigation={true}
          spaceBetween={20}
          slidesPerView={1}
          className="h-[500px]"
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-navigation-size": "44px",
          }}
        >
          {listing.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-[500px] w-full"
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                role="img"
                aria-label={`Property image ${index + 1} of ${
                  listing.imageUrls.length
                }`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="h-[500px] bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      )}

      <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer hover:bg-slate-200 transition-colors">
        <button
          onClick={handleShare}
          title={copied ? "Link copied!" : "Share this listing"}
          className={`transition-colors ${
            copied ? "text-green-600" : "text-slate-600"
          }`}
        >
          <FaShare />
        </button>
        {copied && (
          <div className="absolute -bottom-10 right-0 bg-green-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            Link copied!
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto p-3 my-7">
        <h1 className="text-2xl font-semibold">
          {listing.name} - $
          {listing.offer
            ? listing.discountPrice?.toLocaleString("en-US")
            : listing.regularPrice?.toLocaleString("en-US")}
          {listing.type === "rent" ? " / month" : ""}
        </h1>

        <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
          <span className="text-green-700">
            <FaLocationArrow />
          </span>
          {listing.address}
        </p>

        <div className="flex gap-4 mt-4 flex-wrap">
          <p className="bg-red-900 text-white text-center py-3 px-6 rounded-md">
            {listing.type === "rent" ? "For Rent" : "For Sale"}
          </p>
          {listing.offer && (
            <p className="bg-green-900 text-white text-center py-3 px-6 rounded-md">
              $
              {(listing.regularPrice - listing.discountPrice).toLocaleString(
                "en-US"
              )}{" "}
              discount
            </p>
          )}
        </div>

        <p className="text-slate-800 mt-4">
          <span className="font-semibold text-black">Description - </span>
          {listing.description}
        </p>

        {/* Property Features */}
        <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6 mt-4">
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaBed className="text-lg" />
            {listing.bedrooms} {listing.bedrooms > 1 ? "beds" : "bed"}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaBath className="text-lg" />
            {listing.bathrooms} {listing.bathrooms > 1 ? "baths" : "bath"}
          </li>
          {listing.parking && (
            <li className="flex items-center gap-1 whitespace-nowrap">
              <FaParking className="text-lg" />
              Parking spot
            </li>
          )}
          {listing.furnished && (
            <li className="flex items-center gap-1 whitespace-nowrap">
              <FaChair className="text-lg" />
              Furnished
            </li>
          )}
        </ul>

        <div className="max-w-3xl mt-8">
          {currentUser._id &&
            listing &&
            listing.userRef !== currentUser._id &&
            !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white w-full text-center   rounded uppercase hover:opacity-95 p-3  transition-opacity "
              >
                Contact Landlord
              </button>
            )}

          {!currentUser._id && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                Please{" "}
                <Link to="/signin" className="underline font-semibold">
                  sign in
                </Link>{" "}
                to contact the landlord.
              </p>
            </div>
          )}

          {currentUser && listing && listing.userRef === currentUser._id && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">
                This is your listing
              </p>
            </div>
          )}

          {contact && <Contact listing={listing} />}
        </div>
      </div>
    </main>
  );
}

export default Listing;
