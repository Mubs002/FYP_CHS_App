const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const registerUser = async (req, res) => {
    try {
        const {
            role,
            first_name,
            last_name,
            email,
            password
        } = req.body;

        const hashedPassword = await bcrypt.hash(password,10);
        const user = await userModel.createUser(
            role,
            first_name,
            last_name,
            email,
            hashedPassword
        );

        // i created the profile in a separate try catch so if it fails
        // it does not show the wrong error message to the user
        try {
            if (role === 'patient') {
                await userModel.createPatientProfile(user.user_id);
            }
            if (role === 'professional') {
                await userModel.createProfessionalProfile(user.user_id);
            }
        } catch (profileErr) {
            console.error('profile creation failed:', profileErr);
        }

        res.json(user);

    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).send('Email already exists');
        }

        console.error(err);
        res.status(500).send('Error registering user');
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.getUserByEmail(email);

        if (!user) {
            return res.status(401).send('User not found');
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);

        if(!validPassword) {
            return res.status(401).send('Invalid password');
        }

        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({
            token,
            user_id: user.user_id,
            role: user.role
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Login error');
    }
};

// i added this so the settings page can load the users current info
const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.getUserById(id);
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching user');
    }
};

// i added this so users can update their name and email
const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email } = req.body;
        const user = await userModel.updateUserProfile(id, first_name, last_name, email);
        res.json(user);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).send('Email already in use');
        }
        console.error(err);
        res.status(500).send('Error updating profile');
    }
};

// i added this so users can change their password
const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { current_password, new_password } = req.body;

        // i fetched the user by id so i can check the current password is correct
        const user = await userModel.getUserById(id);
        const fullUser = await userModel.getUserByEmail(user.email);
        const valid = await bcrypt.compare(current_password, fullUser.password_hash);

        if (!valid) {
            return res.status(401).send('Current password is incorrect');
        }

        const hashed = await bcrypt.hash(new_password, 10);
        await userModel.updateUserPassword(id, hashed);
        res.json({ message: 'Password updated' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating password');
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateProfile,
    updatePassword
};