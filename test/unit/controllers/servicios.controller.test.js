import { ServicioController } from '../../../src/controllers/servicio.controller.js';
import { ServicioService } from '../../../src/services/servicio.services.js';
import { ValidationError } from 'sequelize';

jest.mock('../../../src/services/servicio.services.js');

const mockReq = (data = {}) => ({
  body: {},
  params: {},
  query: {},
  user: { id: 1 },
  ...data
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('ServicioController', () => {
  let controller;
  let servicioServiceMock;

  beforeEach(() => {
    ServicioService.mockClear();
    controller = new ServicioController();
    servicioServiceMock = ServicioService.mock.instances[0];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearServicio', () => {
    it('debe crear un servicio correctamente', async () => {
      const req = mockReq({ body: { nombre: 'Servicio A' }, user: { id: 1 } });
      const res = mockRes();

      servicioServiceMock.obtenerServicioPorNombre.mockResolvedValue(null);
      servicioServiceMock.crearServicio.mockResolvedValue({ id: 1, nombre: 'Servicio A' });

      await controller.crearServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'Servicio creado correctamente',
        data: expect.any(Object)
      }));
    });

    it('debe retornar error si el nombre ya existe', async () => {
      const req = mockReq({ body: { nombre: 'Existente' }, user: { id: 1 } });
      const res = mockRes();

      servicioServiceMock.obtenerServicioPorNombre.mockResolvedValue({ id: 1, nombre: 'Existente' });

      await controller.crearServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('debe manejar errores de validación', async () => {
      const req = mockReq({ body: {}, user: { id: 1 } });
      const res = mockRes();

      const error = new ValidationError('Error', [{ message: 'Campo requerido' }]);
      servicioServiceMock.obtenerServicioPorNombre.mockResolvedValue(null);
      servicioServiceMock.crearServicio.mockRejectedValue(error);

      await controller.crearServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        errors: ['Campo requerido']
      }));
    });
    
    it('debe manejar errores generales al crear servicio', async () => {
      const req = mockReq({ body: { nombre: 'Servicio Error' } });
      const res = mockRes();

      servicioServiceMock.obtenerServicioPorNombre.mockResolvedValue(null);
      servicioServiceMock.crearServicio.mockRejectedValue(new Error('Error de servidor'));

      await controller.crearServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Error al crear el servicio.'
      }));
    });
  });

  describe('obtenerServicioPorId', () => {
    it('debe retornar un servicio si existe', async () => {
      const req = mockReq({ params: { id: 1 } });
      const res = mockRes();

      servicioServiceMock.obtenerServicioPorId.mockResolvedValue({ id: 1 });

      await controller.obtenerServicioPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('debe retornar 404 si no existe', async () => {
      const req = mockReq({ params: { id: 999 } });
      const res = mockRes();

      servicioServiceMock.obtenerServicioPorId.mockResolvedValue(null);

      await controller.obtenerServicioPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
    
    it('debe manejar errores generales al obtener servicio por ID', async () => {
      const req = mockReq({ params: { id: 1 } });
      const res = mockRes();

      servicioServiceMock.obtenerServicioPorId.mockRejectedValue(new Error('Error de servidor'));

      await controller.obtenerServicioPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Error al obtener el servicio.'
      }));
    });
  });

  describe('obtenerServicioPorNombre', () => {
    it('debe retornar el servicio si existe', async () => {
      const req = mockReq({ params: { nombre: 'Nombre' } });
      const res = mockRes();

      servicioServiceMock.obtenerServicioPorNombre.mockResolvedValue({ nombre: 'Nombre' });

      await controller.obtenerServicioPorNombre(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('debe retornar 404 si no existe', async () => {
      const req = mockReq({ params: { nombre: 'NoExiste' } });
      const res = mockRes();

      servicioServiceMock.obtenerServicioPorNombre.mockResolvedValue(null);

      await controller.obtenerServicioPorNombre(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
    
    it('debe manejar errores generales al obtener servicio por nombre', async () => {
      const req = mockReq({ params: { nombre: 'Servicio' } });
      const res = mockRes();

      servicioServiceMock.obtenerServicioPorNombre.mockRejectedValue(new Error('Error de servidor'));

      await controller.obtenerServicioPorNombre(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Error al obtener el servicio.'
      }));
    });
  });

  describe('buscarServicios', () => {
    it('debe retornar servicios si hay término', async () => {
      const req = mockReq({ query: { termino: 'mantenimiento' } });
      const res = mockRes();

      servicioServiceMock.buscarServicios.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await controller.buscarServicios(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('debe retornar 400 si no hay término', async () => {
      const req = mockReq({ query: { termino: '' } });
      const res = mockRes();

      await controller.buscarServicios(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
    
    it('debe retornar 400 si el término solo contiene espacios', async () => {
      const req = mockReq({ query: { termino: '   ' } });
      const res = mockRes();

      await controller.buscarServicios(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'El término de búsqueda es requerido'
      }));
    });
    
    it('debe manejar errores generales al buscar servicios', async () => {
      const req = mockReq({ query: { termino: 'mantenimiento' } });
      const res = mockRes();

      servicioServiceMock.buscarServicios.mockRejectedValue(new Error('Error de servidor'));

      await controller.buscarServicios(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Error al buscar servicios.'
      }));
    });
  });

  describe('obtenerServicios', () => {
    it('debe retornar todos los servicios', async () => {
      const req = mockReq();
      const res = mockRes();

      servicioServiceMock.obtenerServicios.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await controller.obtenerServicios(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
    
    it('debe manejar errores generales al obtener todos los servicios', async () => {
      const req = mockReq();
      const res = mockRes();

      servicioServiceMock.obtenerServicios.mockRejectedValue(new Error('Error de servidor'));

      await controller.obtenerServicios(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Error al obtener los servicios.'
      }));
    });
  });

  describe('obtenerServiciosActivos', () => {
    it('debe retornar servicios activos', async () => {
      const req = mockReq();
      const res = mockRes();

      servicioServiceMock.obtenerServiciosActivos.mockResolvedValue([{ id: 1 }]);

      await controller.obtenerServiciosActivos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
    
    it('debe manejar errores generales al obtener servicios activos', async () => {
      const req = mockReq();
      const res = mockRes();

      servicioServiceMock.obtenerServiciosActivos.mockRejectedValue(new Error('Error de servidor'));

      await controller.obtenerServiciosActivos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Error al obtener los servicios activos.'
      }));
    });
  });

  describe('actualizarServicio', () => {
    it('debe actualizar el servicio si existe y no hay conflicto de nombre', async () => {
      const req = mockReq({ params: { id: 1 }, body: { nombre: 'Nuevo' }, user: { id: 1 } });
      const res = mockRes();

      servicioServiceMock.obtenerServicioPorId.mockResolvedValue({ id: 1, nombre: 'Viejo' });
      servicioServiceMock.obtenerServicioPorNombre.mockResolvedValue(null);
      servicioServiceMock.actualizarServicio.mockResolvedValue({ id: 1, nombre: 'Nuevo' });

      await controller.actualizarServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('debe retornar 404 si no existe el servicio', async () => {
      const req = mockReq({ params: { id: 999 }, body: {} });
      const res = mockRes();

      servicioServiceMock.obtenerServicioPorId.mockResolvedValue(null);

      await controller.actualizarServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('debe retornar error si nombre ya existe', async () => {
      const req = mockReq({ params: { id: 1 }, body: { nombre: 'Repetido' } });
      const res = mockRes();

      servicioServiceMock.obtenerServicioPorId.mockResolvedValue({ id: 1, nombre: 'Anterior' });
      servicioServiceMock.obtenerServicioPorNombre.mockResolvedValue({ id: 2, nombre: 'Repetido' });

      await controller.actualizarServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
    
    it('debe actualizar el servicio cuando no se cambia el nombre', async () => {
      const servicioExistente = { id: 1, nombre: 'Mismo Nombre' };
      const req = mockReq({ 
        params: { id: 1 }, 
        body: { nombre: 'Mismo Nombre', descripcion: 'Actualizada' },
        user: { id: 1 }
      });
      const res = mockRes();

      servicioServiceMock.obtenerServicioPorId.mockResolvedValue(servicioExistente);
      servicioServiceMock.actualizarServicio.mockResolvedValue({ 
        ...servicioExistente, 
        descripcion: 'Actualizada' 
      });

      await controller.actualizarServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(servicioServiceMock.obtenerServicioPorNombre).not.toHaveBeenCalled();
    });
    
    it('debe manejar errores de validación al actualizar servicio', async () => {
      const req = mockReq({ params: { id: 1 }, body: { nombre: 'Invalido' }, user: { id: 1 } });
      const res = mockRes();

      servicioServiceMock.obtenerServicioPorId.mockResolvedValue({ id: 1, nombre: 'Anterior' });
      servicioServiceMock.obtenerServicioPorNombre.mockResolvedValue(null);
      
      const error = new ValidationError('Error', [{ message: 'Nombre inválido' }]);
      servicioServiceMock.actualizarServicio.mockRejectedValue(error);

      await controller.actualizarServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        errors: ['Nombre inválido']
      }));
    });
    
    it('debe manejar errores generales al actualizar servicio', async () => {
      const req = mockReq({ params: { id: 1 }, body: { nombre: 'Nuevo' } });
      const res = mockRes();

      servicioServiceMock.obtenerServicioPorId.mockRejectedValue(new Error('Error de servidor'));

      await controller.actualizarServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Error al actualizar el servicio.'
      }));
    });
  });

  describe('eliminarServicio', () => {
    it('debe eliminar el servicio si existe', async () => {
      const req = mockReq({ params: { id: 1 } });
      const res = mockRes();

      servicioServiceMock.eliminarServicio.mockResolvedValue(true);

      await controller.eliminarServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('debe retornar 404 si no se encuentra el servicio', async () => {
      const req = mockReq({ params: { id: 999 } });
      const res = mockRes();

      servicioServiceMock.eliminarServicio.mockResolvedValue(false);

      await controller.eliminarServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
    
    it('debe manejar errores generales al eliminar servicio', async () => {
      const req = mockReq({ params: { id: 1 } });
      const res = mockRes();

      servicioServiceMock.eliminarServicio.mockRejectedValue(new Error('Error de servidor'));

      await controller.eliminarServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Error al eliminar el servicio.'
      }));
    });
  });

  describe('deshabilitarServicio', () => {
    it('debe deshabilitar el servicio si existe', async () => {
      const req = mockReq({ params: { id: 1 } });
      const res = mockRes();

      servicioServiceMock.deshabilitarServicio.mockResolvedValue({ id: 1 });

      await controller.deshabilitarServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('debe retornar 404 si no existe', async () => {
      const req = mockReq({ params: { id: 999 } });
      const res = mockRes();

      servicioServiceMock.deshabilitarServicio.mockResolvedValue(null);

      await controller.deshabilitarServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
    
    it('debe manejar errores generales al deshabilitar servicio', async () => {
      const req = mockReq({ params: { id: 1 } });
      const res = mockRes();

      servicioServiceMock.deshabilitarServicio.mockRejectedValue(new Error('Error de servidor'));

      await controller.deshabilitarServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Error al deshabilitar el servicio.'
      }));
    });
  });

  describe('habilitarServicio', () => {
    it('debe habilitar el servicio si existe', async () => {
      const req = mockReq({ params: { id: 1 } });
      const res = mockRes();

      servicioServiceMock.habilitarServicio.mockResolvedValue({ id: 1 });

      await controller.habilitarServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('debe retornar 404 si no existe', async () => {
      const req = mockReq({ params: { id: 999 } });
      const res = mockRes();

      servicioServiceMock.habilitarServicio.mockResolvedValue(null);

      await controller.habilitarServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
    
    it('debe manejar errores generales al habilitar servicio', async () => {
      const req = mockReq({ params: { id: 1 } });
      const res = mockRes();

      servicioServiceMock.habilitarServicio.mockRejectedValue(new Error('Error de servidor'));

      await controller.habilitarServicio(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Error al habilitar el servicio.'
      }));
    });
  });
});