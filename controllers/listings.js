const Listing = require("../models/listing");
const axios = require("axios");

module.exports.index = async (req, res) => {
    const { search } = req.query;
    let allListings;
    if (search) {
        allListings = await Listing.find({
            $or: [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    location: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    country: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ]
        });
    } else {
        allListings = await Listing.find({});
    }
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {  
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews", 
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
    console.log(listing);
};

module.exports.createListings = async (req, res) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // Geocoding
    const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: `${req.body.listing.location}, ${req.body.listing.country}`,
                format: "json",
                limit: 1
            },
            headers: {
                "User-Agent": "WanderNext/1.0"
            }
        }
    );

    if (response.data.length > 0) {
        newListing.geometry = {
            type: "Point",
            coordinates: [
                parseFloat(response.data[0].lon),
                parseFloat(response.data[0].lat)
            ]
        };
    }

    // Cloudinary image
    if (req.file) {
        newListing.image = {
            filename: req.file.filename,
            url: req.file.path
        };
    }
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
};

module.exports.editListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_fill,h_300,w_250/e_blur:100")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListings = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename};
        await listing.save();
    } 
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destoryListings = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};