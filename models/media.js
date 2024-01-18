const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('media', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tags: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    mediaurl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    video_shortcode: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    extern: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "false"
    },
    thumb: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    visits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    poster: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "0"
    },
    memberid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    added: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "false"
    },
    useraw: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "false"
    },
    embed: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    groupid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    requires_agreement: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    dayviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    weekviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    monthviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    allviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    checkday: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: ""
    },
    checkweek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    checkmonth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    mediatype: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: ""
    },
    defaultthumb: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    flagged: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    mediaAD: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    md5: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    lastviewed: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    media_url_iphone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    video_duration: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    disabled: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "0"
    }
  }, {
    sequelize,
    tableName: 'media',
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
      {
        name: "title",
        type: "FULLTEXT",
        fields: [
          { name: "title" },
        ]
      },
      {
        name: "tags",
        type: "FULLTEXT",
        fields: [
          { name: "tags" },
        ]
      },
      {
        name: "discription",
        type: "FULLTEXT",
        fields: [
          { name: "description" },
        ]
      },
    ]
  });
};
