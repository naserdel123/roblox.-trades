const mongoose = require("mongoose");

module.exports = mongoose.model("Trade", {
  name: String,
  price: String,
  tiktok: String,
  itemImg: String,
  wantImg: String
});
