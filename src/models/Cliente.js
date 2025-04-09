import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Cliente = sequelize.define(
  "Cliente",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    apellidos: { type: DataTypes.STRING, allowNull: false },
    correo: { type: DataTypes.STRING, allowNull: false, unique: true },
    telefono: { type: DataTypes.STRING, allowNull: false },
    fechaNacimiento: { type: DataTypes.DATEONLY, allowNull: false },
    direccion: { type: DataTypes.STRING, allowNull: false },
    estatus: { type: DataTypes.BOOLEAN, defaultValue: true },
    fechaCreacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
    tableName: "clientes",
  }
);

export default Cliente;
