import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    // 201 is standard for resource creation
    return res.status(201).json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};
