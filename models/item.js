const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  imgUrl: { type: String },
});

// Virtual for item's URL
ItemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/item/${this._id}`;
});


// Export model
module.exports = mongoose.model("Item", ItemSchema);