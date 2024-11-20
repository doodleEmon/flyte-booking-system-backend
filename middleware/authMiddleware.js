import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalid" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};