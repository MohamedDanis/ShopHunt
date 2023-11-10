const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor', // Reference to the Vendor model
  },
  availability: {
    type: Boolean,
    default: true,
  },
  // You can add more fields as per your requirements
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
