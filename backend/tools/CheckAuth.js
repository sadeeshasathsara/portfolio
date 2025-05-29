import jwt from 'jsonwebtoken';

export const verifyAuthToken = (req, res, next) => {

    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Invalid or expired token. Unauthorized.' });
    }
};