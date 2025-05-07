const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentifizierungsschutz für Routen
exports.protect = async (req, res, next) => {
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Bearer Token aus Header extrahieren
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Token aus Cookie extrahieren
    token = req.cookies.token;
  }
  
  // Überprüfen, ob Token existiert
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Kein Zugriff auf diese Route'
    });
  }
  
  try {
    // Token verifizieren
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Benutzer finden
    req.user = await User.findById(decoded.id);
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Kein Zugriff auf diese Route'
    });
  }
};

// Rollenbasierte Autorisierung
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Die Rolle ${req.user.role} hat keinen Zugriff auf diese Route`
      });
    }
    next();
  };
};
