const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('packages', {
    packageid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pacakgename: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lite: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    pacakgedetail: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    packageprice: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "0"
    },
    webtv: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    videoemail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    videolibrary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    podcasting: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    presentationmodule: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    mobile: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'packages',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "packageid" },
        ]
      },
    ]
  });
};
