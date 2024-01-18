const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('email_text', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ident: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phrase: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    applied_to_module: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    datecreated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'email_text',
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
