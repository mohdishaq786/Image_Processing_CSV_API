const { Worker, Queue } = require('bullmq');
const redisConnection = require('../confiq/redis');
const sharp = require('sharp');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const Request = require('../models/requestModel');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();
const imageQueue = new Queue('image-processing', { connection: redisConnection });

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log(" MongoDB connected FOR QUEUE!");

  new Worker('image-processing', async (job) => {
    const folderName = 'src/workers/processed';

    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }

    console.log(`Processing job: ${job.id}`);

    const { mongoDocId, inputImages } = job.data;
    const processedImages = [];

    for (const imageUrl of inputImages) {
      try {
        const imageName = `output-${uuidv4()}.jpg`;
        const outputPath = `${folderName}/${imageName}`;
  
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        await sharp(Buffer.from(response.data))
          .jpeg({ quality: 50 })
          .toFile(outputPath);

        processedImages.push(outputPath);
      } catch (err) {
        console.error(`Failed to process image ${imageUrl}`, err);
      }
    }

    try {
      const result = await Request.updateOne(
        { _id: mongoDocId },
        { $set: { outputImages: processedImages, status: 'Completed' } }
      );
      // console.log("MongoDB Update Result:", result);
    } catch (err) {
      console.error(" MongoDB Update Error:", err);
    }

    console.log(` Job ${job.id} completed successfully!`);
  }, { connection: redisConnection, concurrency: 1 });

}).catch((err) => {
  console.error(" MongoDB Connection Error:", err);
});

module.exports = imageQueue;
