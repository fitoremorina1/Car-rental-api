const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


//sign up
exports.signUp = async (req, res) => {
    try {
        const { full_name, email, username, password } = req.body;

        if (!full_name || !email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }


        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            full_name,
            email,
            username,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully', newUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error during sign-up' });
    }
};
//login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Please provide username and password" });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error during login' });
    }
};

//  user's profile
exports.myProfile = async (req, res) => {
    try {

        const token = req.headers.authorization?.split(' ')[1]; // assuming the token is sent as 'Bearer <token>'

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;


        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            full_name: user.full_name,
            username: user.username,
            email: user.email
        });

    } catch (error) {
        console.error('Error during profile retrieval:', error);
        res.status(500).json({ message: 'Server error while retrieving profile' });
    }
};
//list of rental cars
exports.rentalCars = async (req, res) => {
    try {

        const cars = await Car.find().sort({ price_per_day: 1 });

        if (!cars || cars.length === 0) {
            return res.status(404).json({ message: 'No cars available for rent' });
        }


        res.status(200).json({ cars });
    } catch (error) {
        console.error('Error during fetching cars:', error);
        res.status(500).json({ message: 'Server error while retrieving cars' });
    }
};