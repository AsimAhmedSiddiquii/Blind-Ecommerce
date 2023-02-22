var mongoose = require("mongoose");

var orderDataSchema = new mongoose.Schema({
    order_date: {
        type: String
    },
    order_id: {
        type: Number
    },
    user_name: {
        type: String
    },
    full_name: {
        type: String
    },
    address: {
        type: String
    },
    pincode: {
        type: String
    },
    city: {
        type: String
    },
    email_id: {
        type: String
    },
    contact: {
        type: String
    },
    payment_method: {
        type: String
    },
    sub_total: {
        type: String
    },
    total: {
        type: String
    },
    order_status: {
        type: String
    }

});
module.exports = mongoose.model('order_details', orderDataSchema);