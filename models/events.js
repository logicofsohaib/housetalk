const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('events', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    category: {
      type: DataTypes.JSON,
      allowNull: true
    },
    age_range: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    participents: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    lat: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    lng: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    dress_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    },
    photos: {
      type: DataTypes.JSON,
      allowNull: true
    },
    budget: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    use_passes: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    start_date: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    end_date: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    time: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'events',
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
