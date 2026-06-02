const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    durationMinutes: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);
