import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "descending",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMoreBtn, setShowMoreBtn] = useState(true);
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({
        ...sidebarData,
        type: e.target.id,
      });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked === true || e.target.checked === "true"
            ? true
            : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "descending";
      setSidebarData({
        ...sidebarData,
        sort,
        order,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "descending",
      });
    }

    // Fetch listings function
    const fetchListings = async () => {
      setShowMoreBtn(false);

      setLoading(true);
      const searchQuery = urlParams.toString();
      const response = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await response.json();
      setListings(data);
      setLoading(false);
      if (data.length < 9) setShowMoreBtn(false);
      else setShowMoreBtn(true);
    };

    fetchListings();
  }, [location.search]);

  // console.log(listings);

  const handleShowMore = async () => {
    setShowMoreBtn(false);
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    const response = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await response.json();
    setListings((prev) => [...prev, ...data]);
    if (data.length < 9) setShowMoreBtn(fasle);
    else setShowMoreBtn(true);
  };

  return (
    <div className="md:flex md:min-h-screen">
      <div className="border-b-2 md:border-r-2 md:border-b-0 p-7 md:w-1/4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div>
            <label className="font-semibold">Type:</label>
            <div className="flex flex-wrap gap-2 items-center mt-2">
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="all"
                  onChange={handleChange}
                  checked={sidebarData.type === "all"}
                  className="h-5 w-5 cursor-pointer"
                />
                <span>Rent & Sale</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="rent"
                  onChange={handleChange}
                  checked={sidebarData.type === "rent"}
                  className="h-5 w-5 cursor-pointer"
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="sale"
                  onChange={handleChange}
                  checked={sidebarData.type === "sale"}
                  className="h-5 w-5 cursor-pointer"
                />
                <span>Sale</span>
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold">Amenities:</label>
            <div className="flex flex-wrap gap-2 items-center mt-2">
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="parking"
                  onChange={handleChange}
                  checked={sidebarData.parking}
                  className="h-5 w-5 cursor-pointer"
                />
                <span>Parking</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="furnished"
                  onChange={handleChange}
                  checked={sidebarData.furnished}
                  className="h-5 w-5 cursor-pointer"
                />
                <span>Furnished</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="offer"
                  onChange={handleChange}
                  checked={sidebarData.offer}
                  className="h-5 w-5 cursor-pointer"
                />
                <span>Offer</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              onChange={handleChange}
              defaultValue="createdAt_descending"
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
            >
              <option value="regularPrice_descending">Price high to low</option>
              <option value="regularPrice_ascending">Price low to high</option>
              <option value="createdAt_descending">Latest</option>
              <option value="createdAt_ascending">Oldest</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 transition-opacity cursor-pointer font-medium"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex-1 md:w-2/3">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>

        <div className="p-7">
          {loading && <p>Loading...</p>}
          {!loading && listings.length === 0 && <p>No listings found!</p>}
          {!loading && listings.length > 0 && (
            <div className="flex gap-4 flex-wrap mt-4 ">
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          )}
          {showMoreBtn && (
            <button
              type="button"
              onClick={handleShowMore}
              className="text-center    w-full  p-7 text-green-700 hover:underline"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
