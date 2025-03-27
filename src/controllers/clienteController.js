import Cliente from "../models/Cliente.js";
import { clienteCreatedEvent } from "../services/rabbitServiceEvent.js";

export const crearCliente = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    
    // Publicar el evento de cliente creado para que se cree el usuario correspondiente
    await clienteCreatedEvent({
      id: cliente.id,
      username: cliente.correo, // Usamos el correo como username
      phone: cliente.telefono,
      password: "Cliente" + cliente.id + "!" // Contraseña temporal segura con el ID
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
  try {
    const [updated] = await Cliente.update(req.body, {
      where: { id: req.params.id },
    });
    updated
      ? res.json({ mensaje: "Cliente actualizado" })
      : res.status(404).json({ error: "Cliente no encontrado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarCliente = async (req, res) => {
  const deleted = await Cliente.destroy({ where: { id: req.params.id } });
  deleted
    ? res.json({ mensaje: "Cliente eliminado" })
    : res.status(404).json({ error: "Cliente no encontrado" });
};
