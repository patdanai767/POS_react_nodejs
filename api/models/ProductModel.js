const conn = require('../connect');
const { DataTypes } = require('sequelize');
const ProductModel = conn.define('product', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement:true,
        primaryKey: true
    },
    barcode:{
        type: DataTypes.STRING(255)
    },
    name:{
        type : DataTypes.STRING(255)
    },
    price:{
        type: DataTypes.BIGINT
    },
    funding:{
        type: DataTypes.BIGINT
    },
    details:{
        type: DataTypes.STRING(255)
    },
    userId: {
        type: DataTypes.BIGINT
    }
    
})

ProductModel.sync({alter:true});

module.exports = ProductModel;