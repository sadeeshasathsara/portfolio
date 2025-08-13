import jwt from 'jsonwebtoken';

export const verifyAuthToken = (req, res, next) => {
    try {
        const token = req.cookies.token;

        // If token is not provided
        if (!token) {
            return res.status(401).json({ message: 'No token provided. Unauthorized.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token. Unauthorized.' });
    }
};
