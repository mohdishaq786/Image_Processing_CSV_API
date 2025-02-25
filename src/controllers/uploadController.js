const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Request = require('../models/requestModel');
const imageQueue = require('../workers/imageWorker');

const upload = multer({ dest: 'uploads/' });
/**
 * Handles CSV file upload, parses the file, saves data to the database, and queues image processing tasks.
 *
 * @param {Object} req - The request object containing the uploaded CSV file (Express.js request object).
 * @param {Object} res - The response object to send success or error messages (Express.js response object).
 * @returns {Promise<void>} Responds with a JSON message indicating successful upload and a generated requestId.
 *                          Provides sarcastic console logs when queuing tasks because humans love logs.
 * @throws {500} When the server decides it's had enough and crashes or fails to process images.
 *
 * @example
 * POST /api/upload (with CSV file attached)
 * Response: JSON message confirming file upload and the generated requestId.
 */
const uploadCSV = async (req, res) => {
  const filePath = req.file.path;
  const requestId = uuidv4();
  const records = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row['Product Name'] && row['Input Image Urls']) {
        const inputImages = row['Input Image Urls'].split(',');
        records.push({ requestId, productName: row['Product Name'], inputImages, outputImages: [] });
      }
    })
    .on('end', async () => {
      const insertedDocs = await Request.insertMany(records);
      insertedDocs.forEach(doc => { 
          console.log("Queuing doc ID:", doc._id, doc.productName);
        imageQueue.add('processImages', { 
          mongoDocId: doc._id, 
          inputImages: doc.inputImages 
        });
      });
    
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    
      res.status(201).json({ message: "File uploaded successfully", requestId });
    });
   
    //   fs.unlinkSync(filePath);
  
};

module.exports = { upload, uploadCSV };