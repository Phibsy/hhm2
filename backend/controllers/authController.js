const User = require('../models/User');

// Registrierung (nur für Admins zum Erstellen weiterer Nutzer)
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Benutzer erstellen
    const user = await User.create({
      name,
      email,
      password,
      role
    });
    
    // Token erstellen
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Überprüfen, ob E-Mail und Passwort angegeben wurden
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Bitte geben Sie eine E-Mail und ein Passwort an'
      });
    }
    
    // Benutzer suchen
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Ungültige Anmeldedaten'
      });
    }
    
    // Passwort überprüfen
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Ungültige Anmeldedaten'
      });
    }
    
    // Token erstellen
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Aktuellen Benutzer abrufen
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Logout
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    success: true,
    data: {}
  });
};

// Token-Response senden
const sendTokenResponse = (user, statusCode, res) => {
  // Token erstellen
  const token = user.getSignedJwtToken();
  
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};
