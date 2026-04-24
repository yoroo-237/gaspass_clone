import sequelize from '../config/db.js';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB OK');

    // ── PRODUCTS ────────────────────────────────────────────────────
    const existingProducts = await Product.count();
    if (existingProducts > 0) {
      console.log(`✅ Produits déjà présents (${existingProducts}) — seed produits ignoré`);
    } else {
      const products = [
        {
          name: 'HITCH HIKER',
          slug: 'hitch-hiker',
          grade: '91',
          tier: 'SUPREME',
          color: '#9effa5',
          thc: '30%',
          cbd: '0.1%',
          type: 'Hybrid',
          lineage: 'Dosidos × Sherbert',
          terpenes: ['Limonene', 'Caryophyllene', 'Myrcene'],
          description: 'A euphoric, full-body hybrid that hits from every angle.',
          pricing: { '3.5g': 12, '7g': 22, '14g': 40, '28g': 75, 'QP': 140, 'HP': 260, 'LB': 500 },
          stock:   { '3.5g': 100, '7g': 100, '14g': 100, '28g': 50, 'QP': 25, 'HP': 10, 'LB': 5 },
          active: true
        },
        {
          name: 'PURPLE LEMONADE',
          slug: 'purple-lemonade',
          grade: '89',
          tier: 'PREMIUM',
          color: '#cab171',
          thc: '26%',
          cbd: '0.2%',
          type: 'Indica',
          lineage: 'Purple Punch × Lemon OG',
          terpenes: ['Terpinolene', 'Ocimene', 'Myrcene'],
          description: 'Deep purple hues and a punchy lemon aroma.',
          pricing: { '3.5g': 11, '7g': 20, '14g': 38, '28g': 70, 'QP': 130, 'HP': 240, 'LB': 460 },
          stock:   { '3.5g': 100, '7g': 100, '14g': 100, '28g': 50, 'QP': 25, 'HP': 10, 'LB': 5 },
          active: true
        },
        {
          name: 'SUNDAE DRIVER',
          slug: 'sundae-driver',
          grade: '93',
          tier: 'HIGH OCTANE',
          color: '#ba0b20',
          thc: '33%',
          cbd: '0.1%',
          type: 'Hybrid',
          lineage: 'Fruity Pebbles OG × Grape Pie',
          terpenes: ['Caryophyllene', 'Limonene', 'Linalool'],
          description: 'Creamy, dessert-like smoke with top tier effects.',
          pricing: { '3.5g': 15, '7g': 28, '14g': 50, '28g': 90, 'QP': 170, 'HP': 320, 'LB': 600 },
          stock:   { '3.5g': 80, '7g': 80, '14g': 80, '28g': 40, 'QP': 20, 'HP': 8, 'LB': 4 },
          active: true
        },
        {
          name: 'GELONADE SMALLS',
          slug: 'gelonade-smalls',
          grade: '87',
          tier: 'REGULAR',
          color: 'rgba(255,255,255,0.55)',
          thc: '22%',
          cbd: '0.3%',
          type: 'Sativa',
          lineage: 'Gelato 41 × Lemon Tree',
          terpenes: ['Limonene', 'Linalool', 'Myrcene'],
          description: 'Budget-friendly smalls with brightness.',
          pricing: { '3.5g': 8, '7g': 15, '14g': 28, '28g': 50, 'QP': 95, 'HP': 180, 'LB': 340 },
          stock:   { '3.5g': 150, '7g': 150, '14g': 150, '28g': 75, 'QP': 35, 'HP': 15, 'LB': 7 },
          active: true
        },
        {
          name: 'PERMANENT MARKER',
          slug: 'permanent-marker',
          grade: '93',
          tier: 'HIGH OCTANE',
          color: '#ba0b20',
          thc: '31%',
          cbd: '0.1%',
          type: 'Hybrid',
          lineage: 'Biscotti × Jealousy × Sherb Bx',
          terpenes: ['Caryophyllene', 'Limonene', 'Bisabolol'],
          description: 'One of the most sought-after cuts.',
          pricing: { '3.5g': 15, '7g': 28, '14g': 52, '28g': 95, 'QP': 175, 'HP': 330, 'LB': 620 },
          stock:   { '3.5g': 60, '7g': 60, '14g': 60, '28g': 30, 'QP': 15, 'HP': 6, 'LB': 3 },
          active: true
        },
        {
          name: 'BISCOTTI CAKE',
          slug: 'biscotti-cake',
          grade: '91',
          tier: 'SUPREME',
          color: '#9effa5',
          thc: '29%',
          cbd: '0.2%',
          type: 'Indica',
          lineage: 'Biscotti × Wedding Cake',
          terpenes: ['Caryophyllene', 'Myrcene', 'Limonene'],
          description: 'Rich, doughy terps with sugary exhale.',
          pricing: { '3.5g': 13, '7g': 24, '14g': 44, '28g': 80, 'QP': 150, 'HP': 280, 'LB': 530 },
          stock:   { '3.5g': 90, '7g': 90, '14g': 90, '28g': 45, 'QP': 22, 'HP': 9, 'LB': 4 },
          active: true
        }
      ];

      await Product.bulkCreate(products);
      console.log(`✅ ${products.length} produits créés`);
    }

    // ── SUPER ADMIN ─────────────────────────────────────────────────
    const User    = (await import('../models/User.js')).default;
    const bcrypt  = (await import('bcryptjs')).default;

    const superAdminEmail    = process.env.SEED_ADMIN_EMAIL;
    const superAdminPassword = process.env.SEED_ADMIN_PASSWORD;

    if (!superAdminEmail || !superAdminPassword) {
      console.error('❌ SEED_ADMIN_EMAIL et SEED_ADMIN_PASSWORD requis dans .env');
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ where: { email: superAdminEmail } });
    if (existingAdmin) {
      console.log(`✅ Super admin déjà présent (${superAdminEmail}) — ignoré`);
    } else {
      const hash = await bcrypt.hash(superAdminPassword, 10);
      await User.create({
        email:        superAdminEmail,
        passwordHash: hash,
        role:         'superadmin',
        verified:     true
      });
      console.log(`✅ Super admin créé: ${superAdminEmail}`);
    }

    console.log('✅ Seed terminé!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur seed:', error);
    process.exit(1);
  }
};

seedDb();