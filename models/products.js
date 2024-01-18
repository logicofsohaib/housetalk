const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    p_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    price: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    p_image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    details: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'products',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
