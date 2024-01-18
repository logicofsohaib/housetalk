const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('productchemicals', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'userproductgoods',
        key: 'id'
      }
    },
    chemical_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'chemicals',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'productchemicals',
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
      {
        name: "product_id",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
      {
        name: "chemical_id",
        using: "BTREE",
        fields: [
          { name: "chemical_id" },
        ]
      },
    ]
  });
};
