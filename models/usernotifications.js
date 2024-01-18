const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usernotifications', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    u_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    like_my_post: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    comment_my_post: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    bookmark_my_post: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    someone_follow: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    share_my_post: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'usernotifications',
    timestamps: true,
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
