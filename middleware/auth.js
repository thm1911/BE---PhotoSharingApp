const jwt = require('jsonwebtoken');
const { APP_MESSAGES } = require('../constants/message');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRES_IN = '1h';

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRES_IN }
    )
}

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: APP_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please login again.'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
}

module.exports = {
    generateToken,
    verifyToken,
    TOKEN_EXPIRES_IN
}; 