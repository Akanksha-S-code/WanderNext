const mongoose = require("mongoose");
const initData = require("./data-local.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/WanderNext";

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, owner: '6a9ac302f6bdfaa6a2a5c55b',
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};
initDB();