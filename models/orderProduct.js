var mongoose = require("mongoose");
var orderdProductSchema = new mongoose.Schema({
    order_id: {
        type: Number
    },
    product_name: {
        type: String
    },
    product_total: {
        type: String
    },
});
module.exports = mongoose.model('order_product', orderdProductSchema);