import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/errors.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    // 201 is standard for resource creation
    return res.status(201).json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if (listing.userRef.toString() !== req.user.id) {
      return next(errorHandler(401, "You can only delete your own listing"));
    }

    await Listing.findByIdAndDelete(listing._id);

    return res.status(200).json("Deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if (listing.userRef.toString() !== req.user.id) {
      return next(errorHandler(401, "You can only delete your own listing"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  // req.on('aborted', () => {
  //   console.log('Request was aborted by the client');
  // });

  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(404, "listing not found");
    }
    res.json(listing);
  } catch (err) {
    next(err);
  }
};
