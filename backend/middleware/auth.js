const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;  // Attach user ID to the request
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};