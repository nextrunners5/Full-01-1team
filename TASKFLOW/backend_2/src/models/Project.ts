import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";

class Project extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public startDate!: Date;
  public endDate!: Date;
}

Project.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Project",
    timestamps: true,
  }
);

export default Project; 