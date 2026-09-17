const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { data } = require("./init/data.js");

const imageFolder = path.join(__dirname, "public", "images");

// Create public/images if it doesn't exist
if (!fs.existsSync(imageFolder)) {
    fs.mkdirSync(imageFolder, { recursive: true });
}

async function downloadImages() {
    for (let i = 0; i < data.length; i++) {
        const listing = data[i];

        try {
            const response = await axios({
                method: "GET",
                url: listing.image.url,
                responseType: "arraybuffer"
            });

            const fileName = `listing${i + 1}.jpg`;
            const filePath = path.join(imageFolder, fileName);

            fs.writeFileSync(filePath, response.data);

            // Change URL in data
            listing.image.url = `/images/${fileName}`;

            console.log(`Downloaded: ${fileName}`);
        } catch (error) {
            console.log(`Failed: listing${i + 1}`, error.message);
        }
    }

    // Create updated data.js
    const newData = `
const sampleListings = ${JSON.stringify(data, null, 2)};

module.exports = { data: sampleListings };
`;

    fs.writeFileSync("./init/data-local.js", newData);

    console.log("\n✅ All images downloaded!");
    console.log("✅ Updated data saved as init/data-local.js");
}

downloadImages();