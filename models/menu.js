const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('menu', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    header: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    attributes: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    useronly: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    adminonly: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    showindex: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    showlist: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    showplayer: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'menu',
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
