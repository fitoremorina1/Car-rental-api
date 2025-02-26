const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price_per_day: { type: Number, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    steering_type: { type: String, required: true },
    number_of_seats: { type: Number, required: true }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
