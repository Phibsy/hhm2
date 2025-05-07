const Contact = require('../models/Contact');
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

// Kontaktanfrage erstellen
exports.createContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    
    // Kontaktanfrage in der Datenbank speichern
    const contact = await Contact.create({
      name,
      email,
      message
    });
    
    // Bestätigungs-E-Mail an den Absender
    await transporter.sendMail({
      from: `"Haas, Heil & Müller" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Vielen Dank für Ihre Kontaktanfrage',
      html: `
        <h1>Vielen Dank für Ihre Nachricht!</h1>
        <p>Hallo ${name},</p>
        <p>wir haben Ihre Nachricht erhalten und werden uns so schnell wie möglich bei Ihnen melden.</p>
        <p>Mit freundlichen Grüßen,<br>Ihr Team von Haas, Heil & Müller</p>
      `
    });
    
    // Benachrichtigung an die Imker
    await transporter.sendMail({
      from: `"Kontaktformular" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Neue Kontaktanfrage',
      html: `
        <h1>Neue Kontaktanfrage</h1>
        <p>Name: ${name}</p>
        <p>E-Mail: ${email}</p>
        <p>Nachricht:</p>
        <p>${message}</p>
      `
    });
    
    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Alle Kontaktanfragen abrufen (Admin)
exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
