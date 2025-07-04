require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const linkShortenerRouter = require('./router/linkshortner');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/', linkShortenerRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));