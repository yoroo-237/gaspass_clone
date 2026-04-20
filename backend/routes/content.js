import express from 'express';

const router = express.Router();

// GET /api/content/specs - Specs section
router.get('/specs', (req, res) => {
  const specs = [
    { id: 1, label: 'THC POTENCY', icon: 'thc' },
    { id: 2, label: 'TRIM STYLE', icon: 'trim' },
    { id: 3, label: 'SUPERB STRUCTURE', icon: 'structure' },
    { id: 4, label: 'FIRST HARVEST', icon: 'harvest' },
    { id: 5, label: '0% FILLERS', icon: 'fillers' },
    { id: 6, label: '100% REAL FLOWER', icon: 'flower' },
  ];
  res.json(specs);
});

// GET /api/content/faqs - Order section FAQs
router.get('/faqs', (req, res) => {
  const faqs = [
    {
      id: 1,
      q: 'How fast is Shipping?',
      a: 'We ship within 24–48 hours of order confirmation via discreet, stealthy packaging.'
    },
    {
      id: 2,
      q: 'When will my order be fulfilled?',
      a: 'Orders are typically processed same day if placed before 2PM. You will receive tracking once shipped.'
    },
    {
      id: 3,
      q: 'Do you ship internationally?',
      a: 'At this time, we only ship within the continental US. International orders are not available.'
    },
  ];
  res.json(faqs);
});

// GET /api/content/ticker - Marquee ticker items
router.get('/ticker', (req, res) => {
  const items = [
    'SMALL BATCH EXOTICS',
    'STEALTHY PACKAGING',
    'QUICK DELIVERY',
    'UNIQUE STRAINS',
    'QUALITY SMOKE',
    'LOWEST PRICES',
  ];
  res.json(items);
});

export default router;
