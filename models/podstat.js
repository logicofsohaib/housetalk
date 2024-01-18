const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('podstat', {
    statid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    podstatid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    podBanner_link: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    podstatdate: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    poduserip: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    member_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'podstat',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "statid" },
        ]
      },
    ]
  });
};
