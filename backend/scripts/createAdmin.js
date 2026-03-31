import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import sequelize from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const createDefaultAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion PostgreSQL OK');

    // Créer les tables si elles n'existent pas
    await sequelize.sync({ alter: true });

    const email = 'dr-mko@gaspass.com';
    const password = 'Azert12345';

    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Hasher le password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur
      user = await User.create({
        email,
        passwordHash: hashedPassword,
        firstName: 'Dr',
        lastName: 'MKO',
        phone: '+33600000000',
        role: 'admin',
        verified: true,
        address: {
          street: 'Admin Street',
          city: 'Paris',
          zipCode: '75000',
          country: 'France'
        }
      });

      console.log('✅ Utilisateur admin créé:', email);
    } else {
      console.log('ℹ️  Utilisateur admin existe déjà:', email);
      // Mettre à jour le rôle à admin si ce n'est pas le cas
      if (user.role !== 'admin') {
        await user.update({ role: 'admin' });
        console.log('✅ Rôle utilisateur mis à jour en admin');
      }
    }

    // Créer ou mettre à jour l'entrée Admin
    const adminRecord = await Admin.findOne({ where: { userId: user.id } });
    
    if (!adminRecord) {
      await Admin.create({
        userId: user.id,
        permissions: [
          'create:products',
          'read:products',
          'update:products',
          'delete:products',
          'create:orders',
          'read:orders',
          'update:orders',
          'delete:orders',
          'read:users',
          'update:users',
          'delete:users',
          'access:dashboard'
        ],
        notes: 'Super administrateur par défaut',
        active: true,
        lastLogin: new Date()
      });
      console.log('✅ Enregistrement Admin créé');
    } else {
      await adminRecord.update({
        permissions: [
          'create:products',
          'read:products',
          'update:products',
          'delete:products',
          'create:orders',
          'read:orders',
          'update:orders',
          'delete:orders',
          'read:users',
          'update:users',
          'delete:users',
          'access:dashboard'
        ],
        active: true
      });
      console.log('✅ Enregistrement Admin mis à jour');
    }

    console.log('\n📋 Identifiants admin:');
    console.log(`   Email: ${email}`);
    console.log(`   Mot de passe: ${password}`);
    console.log('\n⚠️  CHANGEZ CE MOT DE PASSE EN PRODUCTION!\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await sequelize.close();
  }
};

createDefaultAdmin();
