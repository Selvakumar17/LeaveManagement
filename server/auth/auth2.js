const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.STUDENT_TOKEN;

const auth = (req, res, next) => {
    
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Authorization denied, token missing' });
    }

    try {
        
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        } else {
            console.error("Token verification failed:", err.message);
            return res.status(401).json({ error: 'Invalid token' });
        }
    }
};

module.exports = auth;
