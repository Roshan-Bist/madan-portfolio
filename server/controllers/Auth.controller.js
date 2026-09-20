const Auth = require("../Models/AuthModel");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const auth = await Auth.findOne({ email });
        if (!auth) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const isPasswordValid = await auth.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = jwt.sign({ id: auth._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const user = { id: auth._id, email: auth.email };
        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const auth = new Auth({ name, email, password });
        await auth.save();
        res.status(201).json({ message: "User registered successfully", auth });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}