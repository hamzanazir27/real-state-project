import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";
const ListingItem = ({ listing }) => {
  const formatPrice = (price) => {
    return price.toLocaleString("en-US");
  };

  return (
    <Link
      to={`/listing/${listing._id}`}
      className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden w-full sm:w-[320px]"
    >
      <div className="relative">
        <img
          src={
            listing.imageUrls?.[0] ||
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
          }
          alt="listing cover"
          className="h-80 sm:h-52 w-full object-cover hover:scale-105 transition-scale duration-300"
        />
      </div>

      <div className="p-3 flex flex-col gap-2 w-full">
        <p className="text-lg font-semibold text-slate-700 truncate">
          {listing.name}
        </p>

        <div className="flex items-center gap-1">
          <MdLocationOn className="h-4 w-4 text-green-700" />
          <p className="text-sm text-gray-600 truncate w-full">
            {listing.address}
          </p>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {listing.description}
        </p>

        <p className="text-slate-500 mt-2 font-semibold flex items-center">
          $
          {listing.offer
            ? formatPrice(listing.discountPrice)
            : formatPrice(listing.regularPrice)}
          {listing.type === "rent" && "/month"}
        </p>

        {listing.offer && (
          <p className="text-green-600 text-sm">
            ${formatPrice(listing.regularPrice - listing.discountPrice)} OFF
          </p>
        )}

        <div className="text-slate-700 flex gap-4">
          <div className="font-bold text-xs">
            {listing.bedrooms > 1
              ? `${listing.bedrooms} beds`
              : `${listing.bedrooms} bed`}
          </div>
          <div className="font-bold text-xs">
            {listing.bathrooms > 1
              ? `${listing.bathrooms} baths`
              : `${listing.bathrooms} bath`}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingItem;
