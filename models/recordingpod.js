const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('recordingpod', {
    recpodid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    recpod: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    pod_type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    recpoduser: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    recpoddate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    converted: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "0"
    }
  }, {
    sequelize,
    tableName: 'recordingpod',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "recpodid" },
        ]
      },
    ]
  });
};
