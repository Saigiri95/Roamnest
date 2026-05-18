const Listing = require("../models/listing");
const axios = require("axios");

// index route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}

// nwe route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
}

// show route 

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({path :"reviews",
    populate:{
      path:"author"
    }
  })
  .populate("owner");
  if(!listing) {
    req.flash("error", "Listing you requested for data not exist!")
    res.redirect("/listings")
  }
  console.log(listing)
  res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res) => {
  console.log(process.env.OPENCAGE_API_KEY);
   let response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${req.body.listing.location},${req.body.listing.country}&key=${process.env.OPENCAGE_API_KEY}`
   );

   let coordinates = response.data.results[0].geometry;

   let url = req.file.path;
   let filename = req.file.filename;

   const newListing = new Listing(req.body.listing);

   newListing.owner = req.user._id;

   newListing.image = { url, filename };

   newListing.geometry = {
      type: "Point",
      coordinates: [coordinates.lng, coordinates.lat],
   };
   console.log(newListing);

   console.log(newListing.geometry);

   await newListing.save();

   req.flash("success","new listing created!");

   res.redirect("/listings");
}

// edit route
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
   if(!listing) {
    req.flash("error", "Listing you requested for data not exist!")
    res.redirect("/listings")
  }
  let originalImageUrl = listing.image.url;

originalImageUrl = originalImageUrl.replace(
  "/upload",
  "/upload/h_300,w_250"
);
 
  res.render("listings/edit.ejs", { listing,originalImageUrl });
}

// update route

module.exports.updatelisting= async (req, res) => {
   let { id } = req.params;
   
   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

   if(typeof req.file !== "undefined"){
     let url = req.file.path;
   let filename = req.file.filename;
   listing.image = {url ,filename}; 
   await listing.save();


   }
  


    req.flash("success", "listing updated!");
    res.redirect(`/listings/${id}`);
}

// delete listing 

module.exports.deletelisting = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
    req.flash("success"," listing deleted!");
  res.redirect("/listings");
}