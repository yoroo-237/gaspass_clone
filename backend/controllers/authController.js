import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email déjà utilisé' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash: hash, phone });
    
    const token = jwt.sign({ id: user.id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Erreur enregistrement' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Email/password invalide' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Email/password invalide' });

    const token = jwt.sign({ id: user.id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Erreur connexion' });
  }
};

export const logout = (req, res) => {
  res.json({ message: 'Déconnexion OK' });
};
