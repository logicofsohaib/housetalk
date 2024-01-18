const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('frontendtemplate', {
    templateid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    templatename: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    templatebgcolor: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    templatelogotype: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    templatelogo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    headerbanner: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    templageslogantype: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    templageslogan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    templagerighttype: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    templageright: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    templatemodule: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    templatenavbarbg: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    templatenavlinkbg: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    templatenavelinkoverbg: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    templatenavfontcolor: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    templatenavfontovercolor: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    templatenavseperatecolor: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    templateuserid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    templatestatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'frontendtemplate',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "templateid" },
        ]
      },
    ]
  });
};
