const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('podfrontendtemplate', {
    templateid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    banner_type: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    templatename: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    templatebgcolor: {
      type: DataTypes.STRING(255),
      allowNull: true
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
      allowNull: true
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
      type: DataTypes.STRING(255),
      allowNull: true
    },
    templatenavbarbg: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    templatenavlinkbg: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    templatenavelinkoverbg: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    templatenavfontcolor: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    templatenavfontovercolor: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    templatenavseperatecolor: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    templatefooterbgcolor: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    templatefootertext: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    templateuserid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    templatestatus: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    banner_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'podfrontendtemplate',
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
