const conn = require('../connect');
const { DataTypes } = require('sequelize');
const changePackageModel = conn.define('changePackage', {
    id:{
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    packageId:{
        type: DataTypes.BIGINT
    },
    userId:{
        type: DataTypes.BIGINT
    },
    payDate: {
        type: DataTypes.DATE
    },
    payHour: {
        type: DataTypes.BIGINT
    },
    payMinute: {
        type: DataTypes.BIGINT
    },
    payRemark: {
        type: DataTypes.STRING
    }
})

changePackageModel.sync({alter:true});
module.exports = changePackageModel;