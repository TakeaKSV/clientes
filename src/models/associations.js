import Cliente from './Cliente.js';
import Direccion from './Direccion.js';

export default function setupAssociations() {
  // Relaciones Cliente-Direccion (si existe esta relación)
  Cliente.hasMany(Direccion, { foreignKey: 'clienteId', as: 'direcciones' });
  Direccion.belongsTo(Cliente, { foreignKey: 'clienteId' });
  
  console.log('✅ Asociaciones del servicio de Clientes establecidas');
}