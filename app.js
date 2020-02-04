// Moviedex API server
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();
// movie db
const movies = require('./movies-data-small');

// max returned movies
const MAX_MOVIES = 10;

app.use(morgan('dev')); // logging
app.use(helmet()); // secure headers

const validateBearerToken = (req, res, next) => {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
};

// /movie route
// params: genre, country, avg_vote
app.get('/movie', cors(), validateBearerToken, (req, res) => {
  const { query = {} } = req;
  let returnMovies = movies;

  if (query.genre) {
    if (typeof query.genre === 'string')
      returnMovies = returnMovies.filter(m =>
        m.genre.toLowerCase().includes(query.genre.toLowerCase())
      );
    else return res.status(400).json({ error: 'bad genre' });
  }

  if (query.country) {
    if (typeof query.country === 'string')
      returnMovies = returnMovies.filter(m =>
        m.country.toLowerCase().includes(query.country.toLowerCase())
      );
    else return res.status(400).json({ error: 'bad country' });
  }

  if (query.avg_vote) {
    if (!isNaN(Number(query.avg_vote)))
      returnMovies = returnMovies.filter(
        m => Number(m.avg_vote) >= Number(query.avg_vote)
      );
    else return res.status(400).json({ error: 'bad avg_vote' });
  }

  if (returnMovies.length > MAX_MOVIES)
    returnMovies = returnMovies.slice(0, MAX_MOVIES);

  res.json(returnMovies);
});

module.exports = app;
