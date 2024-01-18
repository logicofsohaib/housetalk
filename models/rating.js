const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rating', {
    id: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: "",
      primaryKey: true
    },
    total_votes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    which_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    used_ips: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'rating',
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
