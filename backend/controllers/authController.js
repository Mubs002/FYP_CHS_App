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
            'secretkey',
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

module.exports = {
    registerUser,
    loginUser
};