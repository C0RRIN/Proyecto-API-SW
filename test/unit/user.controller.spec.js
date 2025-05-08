// test/unit/user.controller.spec.js

// 1) Mockeamos todo lo que exporte ../models/user.model
jest.mock('../../src/models/user.model');

const User = require('../../src/models/user.model');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../../src/controllers/user.controller');

describe('User Controller — Unit Tests', () => {
  // Antes de cada test limpiamos los mocks
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('debe invocar res.json con la lista de usuarios', async () => {
      // 2) Preparamos el valor de retorno de User.findAll
      const fakeUsers = [
        { id: 1, firstName: 'A', lastName: 'B', email: 'a@b.com' }
      ];
      User.findAll.mockResolvedValue(fakeUsers);

      // 3) Creamos req/res simulados
      const req = {};
      const res = { json: jest.fn() };
      const next = jest.fn();

      // 4) Llamamos al controller
      await getAllUsers(req, res, next);

      // 5) Aserciones
      expect(User.findAll).toHaveBeenCalledWith({
        attributes: ['id', 'firstName', 'lastName', 'email']
      });
      expect(res.json).toHaveBeenCalledWith(fakeUsers);
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar a next(error) si User.findAll lanza', async () => {
      const error = new Error('DB fail');
      User.findAll.mockRejectedValue(error);

      const req = {};
      const res = { json: jest.fn() };
      const next = jest.fn();

      await getAllUsers(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getUserById', () => {
    it('debe devolver 404 si no existe el usuario', async () => {
      User.findByPk.mockResolvedValue(null);

      const req = { params: { id: '99' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await getUserById(req, res, next);

      expect(User.findByPk).toHaveBeenCalledWith('99', {
        attributes: ['id', 'firstName', 'lastName', 'email']
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
      expect(next).not.toHaveBeenCalled();
    });

    it('debe devolver el usuario si existe', async () => {
      const fakeUser = { id: 2, firstName: 'X', lastName: 'Y', email: 'x@y.com' };
      User.findByPk.mockResolvedValue(fakeUser);

      const req = { params: { id: '2' } };
      const res = { json: jest.fn() };
      const next = jest.fn();

      await getUserById(req, res, next);

      expect(res.json).toHaveBeenCalledWith(fakeUser);
      expect(next).not.toHaveBeenCalled();
    });

    it('debe llamar a next(error) si User.findByPk lanza', async () => {
      const error = new Error('DB fail');
      User.findByPk.mockRejectedValue(error);

      const req = { params: { id: '1' } };
      const res = { json: jest.fn() };
      const next = jest.fn();

      await getUserById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // Puedes seguir el mismo patrón para updateUser y deleteUser:
  // - mockear User.findByPk
  // - simular user.update() o user.destroy()
  // - chequear status/json o next(err)

});