// test/integration/user.routes.spec.js

const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');  // tu instancia de Express

describe('User Routes — Integration Tests', () => {
  let createdUserId;

  describe('GET /api/users', () => {
    it('debe responder 200 y un array JSON', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Accept', 'application/json');
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('POST /api/users', () => {
    it('debe crear un usuario y devolver 201 + objeto', async () => {
      const newUser = {
        firstName: 'Integración',
        lastName: 'Test',
        email: 'integ@test.com',
        password: 'secret'
      };

      const res = await request(app)
        .post('/api/users')
        .send(newUser)
        .set('Accept', 'application/json');
      
      expect(res.status).to.equal(201);
      expect(res.body).to.include.keys('id', 'firstName', 'lastName', 'email');
      expect(res.body.email).to.equal(newUser.email);

      // guardamos el ID para los siguientes tests
      createdUserId = res.body.id;
    });
  });

  describe('GET /api/users/:id', () => {
    it('debe devolver 200 y el usuario creado', async () => {
      const res = await request(app)
        .get(`/api/users/${createdUserId}`)
        .set('Accept', 'application/json');
      
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body.id).to.equal(createdUserId);
    });

    it('debe devolver 404 si no existe', async () => {
      const res = await request(app)
        .get('/api/users/999999')
        .set('Accept', 'application/json');
      
      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ message: 'Usuario no encontrado' });
    });
  });

  describe('PUT /api/users/:id', () => {
    it('debe actualizar el usuario y devolver mensaje', async () => {
      const updates = { firstName: 'Actualizado', lastName: 'Test' };
      
      const res = await request(app)
        .put(`/api/users/${createdUserId}`)
        .send(updates)
        .set('Accept', 'application/json');
      
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ message: 'Usuario actualizado' });
    });

    it('debe devolver 404 si el usuario no existe', async () => {
      const res = await request(app)
        .put('/api/users/999999')
        .send({ firstName: 'X' })
        .set('Accept', 'application/json');
      
      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ message: 'Usuario no encontrado' });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('debe eliminar el usuario y devolver mensaje', async () => {
      const res = await request(app)
        .delete(`/api/users/${createdUserId}`)
        .set('Accept', 'application/json');
      
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ message: 'Usuario eliminado' });
    });

    it('debe devolver 404 si el usuario ya no existe', async () => {
      const res = await request(app)
        .delete(`/api/users/${createdUserId}`)
        .set('Accept', 'application/json');
      
      expect(res.status).to.equal(404);
      expect(res.body).to.deep.equal({ message: 'Usuario no encontrado' });
    });
  });
});
