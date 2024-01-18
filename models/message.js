const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('message', {
    messageid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fromid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    toid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sentdate: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "0"
    },
    msgread: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    auto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'message',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "messageid" },
        ]
      },
    ]
  });
};
