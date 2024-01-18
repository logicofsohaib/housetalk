const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('member_log', {
    idlog: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    deletedon: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedby: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    parentid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    smsmessagecount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    child_user_allowed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    package: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    lang_chk: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    firstname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(155),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    zip: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cookie: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    session: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    activationkey: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    privs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    history: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    opt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    opts: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    profile_privacy: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    gender: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    aboutme: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    created: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lastlogin: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    profileviews: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    agreed: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    hidemature: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    viewerhistory: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    optoutofviewerlist: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    banned: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    allow_subscribtion: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    allow_upload_by_subscribers: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    subscriber_parent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    subscriber: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    subscriber_to: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    subscriber_pw: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    userapproved: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    group_checkbox: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'member_log',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idlog" },
        ]
      },
    ]
  });
};
