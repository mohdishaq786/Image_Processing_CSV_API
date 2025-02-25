const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  requestId: String,
  productName: String,
  inputImages: [String],
  outputImages: [String],
  status: { type: String, default: 'Pending' },
});

module.exports = mongoose.model('Request', RequestSchema);