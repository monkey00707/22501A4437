const express = require('express');
const { nanoid } = require('nanoid');
const Url = require('../url.model');

const router = express.Router();

router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ error: 'originalUrl is required' });

  const shortCode = nanoid(7);
  const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;

  const url = new Url({ originalUrl, shortCode });
  await url.save();

  res.json({ shortUrl });
});

router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  const url = await Url.findOne({ shortCode });
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).json({ error: 'Short URL not found' });
  }
});

router.get('/', async (req, res) => {
    try {
        const urls = await Url.find({});
        res.status(200).json(urls);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = router;