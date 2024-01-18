const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('videorecording', {
    rvid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rvideo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rvuserid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rvdate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'videorecording',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "rvid" },
        ]
      },
    ]
  });
};
