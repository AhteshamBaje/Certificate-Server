import jwt from "jsonwebtoken";

const authMiddleware = (req, res) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || "Ahtesham006");
        req.user = verified; // Attach user info to request
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};

export default authMiddleware;
