const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('podbanners', {
    podbannerid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    poduserid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    podbannerimage: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    podbannerlink: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    podbannerposition: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    podstatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'podbanners',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "podbannerid" },
        ]
      },
    ]
  });
};
