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
  FaSearchLocation,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Listing() {
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

  // Loading state
  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <p className="text-2xl">Loading...</p>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-red-600">Something went wrong!</p>
      </main>
    );
  }

  // No listing data
  if (!listing) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <p className="text-2xl">No listing found</p>
      </main>
    );
  }

  return (
    <main>
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
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="h-[500px] bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      )}

      <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied!");
          }}
        >
          <FaShare />
        </button>
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

        <div className="flex gap-4 mt-4">
          <p className="bg-red-900 text-white text-center py-3 px-6   rounded-md">
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
      </div>
    </main>
  );
}

export default Listing;
