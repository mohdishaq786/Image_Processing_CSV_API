const Request = require('../models/requestModel');
const { Parser } = require('json2csv');

/**
 * Generates and downloads a CSV file containing request details based on the provided requestId.
 *
 * @param {Object} req - The request object from the client (Express.js request object).
 * @param {Object} res - The response object to send the CSV file or error messages (Express.js response object).
 * @returns {Promise<void>} Sends a CSV file as a downloadable attachment if data is found,
 *                          otherwise returns a sarcastically appropriate error message.
 * @throws {500} If MongoDB throws a tantrum during data retrieval or CSV conversion spectacularly fails.
 * @throws {404} If your beloved requestId has mysteriously vanished or never existed at all.
 *
 * @example
 * GET /api/download/12345
 * Response: Downloads "request-12345.csv" or gets mocked by a 404 message.
 */
const downloadCSV = async (req, res) => {
  const { requestId } = req.params;

  let requests;
  try {
    requests = await Request.find({ requestId });
  } catch (err) {
    return res.status(500).json({ message: 'Oops! MongoDB ghosted us again.' });
  }

  if (!requests.length) {
    return res.status(404).json({ message: `Nothing here, buddy! requestId '${requestId}' vanished into thin air.` });
  }

  const csvFields = ['S. No.', 'Product Name', 'Input Image Urls', 'Output Image Urls'];

  const csvData = requests.map((req, index) => ({
    'S. No.': index + 1,
    'Product Name': req.productName,
    'Input Image Urls': req.inputImages.join(','),
    'Output Image Urls': req.outputImages.join(','),
  }));

  try {
    const json2csvParser = new Parser({ fields: csvFields });
    const csv = json2csvParser.parse(csvData);
    res.header('Content-Type', 'text/csv');
    res.attachment(`request-${requestId}.csv`);
    return res.status(200).send(csv);
  } catch (err) {
    return res.status(500).json({ message: 'Well, converting to CSV just failed spectacularly.' });
  }
}
module.exports= {downloadCSV};