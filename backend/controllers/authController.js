import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    
    // Validation
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: 'Email et mot de passe (min 6 caractères) requis' });
    }
    
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email déjà utilisé' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      email, 
      passwordHash: hash, 
      phone,
      role: 'user'
    });
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ 
      token, 
      user: { id: user.id, email: user.email, role: user.role, phone: user.phone } 
    });
  } catch (err) {
    console.error('Erreur enregistrement:', err);
    res.status(500).json({ error: 'Erreur enregistrement' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Email/password invalide' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Email/password invalide' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, role: user.role, phone: user.phone } 
    });
  } catch (err) {
    console.error('Erreur connexion:', err);
    res.status(500).json({ error: 'Erreur connexion' });
  }
};

export const logout = (req, res) => {
  res.json({ message: 'Déconnexion OK' });
};
