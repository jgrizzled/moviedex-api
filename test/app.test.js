const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('/movie', () => {
  it('responds HTTP 400 without authorization token', () => {
    supertest(app)
      .get('/movie')
      .expect(400);
  });

  it('responds with non-empty JSON array by default', () => {
    supertest(app)
      .get('/movie')
      .set('Authorization', 'Bearer ' + process.env.API_TOKEN)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body).to.be.a('array');
        expect(res.body).to.not.be.empty;
      });
  });

  it('responds with empty JSON array with impossible query params', () => {
    const query = { genre: '0', country: '0', avg_score: '9999' };
    supertest(app)
      .get('/movie')
      .query(query)
      .set('Authorization', 'Bearer ' + process.env.API_TOKEN)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body).to.be.a('array');
        expect(res.body).to.be.empty;
      });
  });
});
