import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const register = async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Mot de passe minimum 6 caractères' });
    }
    
    if (phone && !/^\d{10,}$/.test(phone.replace(/\D/g, ''))) {
      return res.status(400).json({ error: 'Numéro téléphone invalide' });
    }
    
    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existing) return res.status(400).json({ error: 'Email déjà utilisé' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      email: email.toLowerCase(), 
      passwordHash: hash, 
      phone: phone || null,
      role: 'customer'
    });
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ 
      token, 
      user: { id: user.id, email: user.email, role: user.role, phone: user.phone } 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Erreur enregistrement' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(401).json({ error: 'Email/password invalide' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Email/password invalide' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, role: user.role, phone: user.phone } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erreur connexion' });
  }
};

export const logout = (req, res) => {
  res.json({ message: 'Logged out' });
};
