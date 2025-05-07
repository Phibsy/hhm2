const Order = require('../models/Order');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');

// E-Mail-Transporter konfigurieren
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Bestellung erstellen (Vormerkung)
exports.createOrder = async (req, res, next) => {
  try {
    const { name, email, productId, quantity, message } = req.body;
    
    // Überprüfen, ob das Produkt existiert
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produkt nicht gefunden'
      });
    }
    
    // Bestellung erstellen
    const order = await Order.create({
      name,
      email,
      product: productId,
      quantity,
      message
    });
    
    // Bestätigungs-E-Mail senden
    await transporter.sendMail({
      from: `"Haas, Heil & Müller" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Vielen Dank für Ihre Vormerkung!',
      html: `
        <h1>Vormerkung für ${product.name}</h1>
        <p>Hallo ${name},</p>
        <p>vielen Dank für Ihre Vormerkung. Wir werden Sie benachrichtigen, sobald der Honig verfügbar ist.</p>
        <p>Mit freundlichen Grüßen,<br>Ihr Team von Haas, Heil & Müller</p>
      `
    });
    
    // Admin-Benachrichtigung senden
    await transporter.sendMail({
      from: `"Bestellsystem" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Neue Honig-Vormerkung',
      html: `
        <h1>Neue Vormerkung</h1>
        <p>Name: ${name}</p>
        <p>E-Mail: ${email}</p>
        <p>Produkt: ${product.name}</p>
        <p>Menge: ${quantity}</p>
        <p>Nachricht: ${message || 'Keine Nachricht'}</p>
      `
    });
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Alle Bestellungen abrufen (Admin)
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('product');
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Bestellstatus aktualisieren (Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('product');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Bestellung nicht gefunden'
      });
    }
    
    // Bei Statusänderung E-Mail senden
    if (status === 'bestätigt') {
      await transporter.sendMail({
        from: `"Haas, Heil & Müller" <${process.env.EMAIL_USER}>`,
        to: order.email,
        subject: 'Ihre Honig-Bestellung ist bereit!',
        html: `
          <h1>Gute Nachrichten!</h1>
          <p>Hallo ${order.name},</p>
          <p>Ihr Honig ist jetzt verfügbar! Bitte kontaktieren Sie uns, um die Abholung oder Lieferung zu vereinbaren.</p>
          <p>Mit freundlichen Grüßen,<br>Ihr Team von Haas, Heil & Müller</p>
        `
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
