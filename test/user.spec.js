import supertest from 'supertest'
import app from '../app/app.js'

describe('/api/register and /api/login', () => {
    const restype= 'application/json; charset=utf-8'
    var token = null

    it('post /register ', async () => {
      await supertest(app)
        .post('/api/register')
        .set('Accept', 'application/json')
        .send({
            name: 'mari',
            email: 'mari@zold.lan',
            password: 'titok',
            password_confirmation: 'titok'
        })
        .expect('Content-Type', restype)
        .expect(201)

    })
    it('post /login ', async () => {
      const res = await supertest(app)
        .post('/api/login')
        .set('Accept', 'application/json')
        .send({
            name: 'mari',
            password: 'titok'
        })
        .expect('Content-Type', restype)
        .expect(200)
        token = res.body.accessToken
        if(!token) {
          throw new Error('No token')
        }        
    })
    it('get /users ', async () => {
      await supertest(app)
        .get('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
    })
  })