// authMiddleware.js
import jwt from "jsonwebtoken"
function ensureLoggedIn(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if token does not exist
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, 'U2FsdGVkX1+gvqvXLk8VcSx7+xHJbbEX3uQyEzzRfKM=');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}
export default ensureLoggedIn;
