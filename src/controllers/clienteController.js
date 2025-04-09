import Cliente from "../models/Cliente.js";
import { clienteCreatedEvent } from "../services/rabbitServiceEvent.js";

export const crearCliente = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    
    // Publicar el evento de cliente creado para que se cree el usuario correspondiente
    await clienteCreatedEvent({
      id: cliente.id,
      username: cliente.correo,
      phone: cliente.telefono,
      password: "Cliente" + cliente.id + "!"
    });
    
    res.json({ 
      message: "Cliente creado con éxito. Se generará un usuario automáticamente.",
      cliente 
    });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ error: error.message });
  }
};

export const obtenerClientes = async (req, res) => {
  const clientes = await Cliente.findAll();
  res.json(clientes);
};

export const obtenerClientePorId = async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  cliente
    ? res.json(cliente)
    : res.status(404).json({ error: "Cliente no encontrado" });
};

export const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellidos, correo, telefono, fechaNacimiento, direccion } = req.body;
  
  // Validación preliminar
  if (!id) {
    return res.status(400).json({ error: "El ID del cliente es requerido" });
  }
  
  if (correo && !correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: "El formato del correo electrónico no es válido" });
  }
  
  if (telefono && !telefono.match(/^\d{10}$/)) {
    return res.status(400).json({ error: "El teléfono debe contener exactamente 10 dígitos" });
  }
  
  try {
    // Verificar si el cliente existe antes de actualizar
    const clienteExistente = await Cliente.findByPk(id);
    if (!clienteExistente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    
    // Si el correo cambia, verificar que no exista ya
    if (correo && correo !== clienteExistente.correo) {
      const correoExistente = await Cliente.findOne({ where: { correo } });
      if (correoExistente) {
        return res.status(400).json({ error: "El correo ya está registrado" });
      }
    }
    
    // Actualizar el cliente
    await clienteExistente.update(req.body);
    
    res.json({ 
      mensaje: "Cliente actualizado correctamente",
      cliente: clienteExistente
    });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ error: error.message });
  }
};

export const eliminarCliente = async (req, res) => {
  const deleted = await Cliente.destroy({ where: { id: req.params.id } });
  deleted
    ? res.json({ mensaje: "Cliente eliminado" })
    : res.status(404).json({ error: "Cliente no encontrado" });
};
