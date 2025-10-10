import express from 'express';
import { ServicioController } from '../controllers/servicio.controller.js';
import { authenticate, isAdmin} from '../middlewares/autenticacion.js';

const router = express.Router();
const servicioController = new ServicioController();

// Rutas públicas
router.get('/api/servicios/activos', servicioController.obtenerServiciosActivos);

// Buscar servicios por nombre o descripción
router.get('/api/servicios/buscar', servicioController.buscarServicios);

// Rutas protegidas - requieren autenticación

// Crear servicio (solo lo peude hacer administradores)
router.post('/api/servicios', authenticate, isAdmin, servicioController.crearServicio);

// Obtener todos los servicios
router.get('/api/servicios', servicioController.obtenerServicios);

// Obtener servicio por ID
router.get('/api/servicios/:id', servicioController.obtenerServicioPorId);

// Obtener servicio por nombre
router.get('/api/servicios/nombre/:nombre', servicioController.obtenerServicioPorNombre);

// Actualizar servicio (Solo administradores tiene este permiso)
router.put('/api/servicios/:id', authenticate, isAdmin, servicioController.actualizarServicio);

// Eliminar servicio (Solo administradores tienen este permiso)
router.delete('/api/servicios/:id', authenticate, isAdmin, servicioController.eliminarServicio);

// Deshabilitar servicio (Solo administradores tienen este permiso)
router.patch('/api/servicios/:id/deshabilitar', authenticate, isAdmin, servicioController.deshabilitarServicio);

// Habilitar servicio (Solo administradores tienen este permiso)
router.patch('/api/servicios/:id/habilitar', authenticate, isAdmin, servicioController.habilitarServicio);

export default router;