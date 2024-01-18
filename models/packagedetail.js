const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('packagedetail', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    packagefeatured: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    package1: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    package2: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    package3: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    package_video: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'packagedetail',
    timestamps: false,
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
