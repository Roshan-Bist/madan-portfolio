const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    console.log("authorization------>", req.headers.authorization);
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("token authorization------>", token);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = user;
        next();
    });
}

module.exports = authenticate;