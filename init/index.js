const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL ="mongodb://127.0.0.1:27017/Wonderlust";

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("MongoDB connected");
};

const initDB = async () => {
    await Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({
  ...obj,
  owner:"69ff1836f0585e04fa3c3ede",

  geometry: {
    type: "Point",
    coordinates: [73.8567, 18.5204],
  },

}));
     await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
