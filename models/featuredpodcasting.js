const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('featuredpodcasting', {
    featuredpodcastingid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    featuredvid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    memberid: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'featuredpodcasting',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "featuredpodcastingid" },
        ]
      },
    ]
  });
};
