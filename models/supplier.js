const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 50 },
  address: { type: String, required: true, minLength: 1, maxLength: 100 },
  contact_number: { type: String },
  registration_number: { type: Number },
});

// Virtual for suppler's URL
SupplierSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/supplier/${this._id}`;
});

// Export model
module.exports = mongoose.model("Supplier", SupplierSchema);