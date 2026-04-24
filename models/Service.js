import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Service = sequelize.define("Service",{

id:{
type:DataTypes.UUID,
defaultValue:DataTypes.UUIDV4,
primaryKey:true
},

saloon_id:{
type:DataTypes.UUID,
allowNull:false
},

name:{
type:DataTypes.STRING,
allowNull:false
},

price:{
type:DataTypes.FLOAT,
allowNull:false
},

serviceImg:{
type:DataTypes.TEXT,
allowNull:false
},
category: {
type: DataTypes.STRING,
allowNull: false,
defaultValue: 'Haircut'
}

},{
timestamps:true,
tableName:"services"
})

export default Service
