const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    code: { type: String },
    name: { type: String, required: true },
    gender: { type: Boolean },
    birthdate: { type: Date },
    contactNumber: { type: String },
    address: { type: String },
    locationName: { type: String }, 
    email: { type: String }, 
    organization: { type: String }, 
    comment: { type: String }, 
    taxCode: { type: String },
    debt: { type: mongoose.Schema.Types.Decimal128 }, 
    totalInvoiced: { type: mongoose.Schema.Types.Decimal128 }, 
    totalPoint: { type: Number }, 
    totalRevenue: { type: mongoose.Schema.Types.Decimal128 }, 
    retailerId: { type: Number, required: true }, 
    modifiedDate: { type: Date },  
    createdDate: { type: Date },  
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
