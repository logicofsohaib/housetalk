const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('podcasting', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    podcount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    addresslat: {
      type: DataTypes.STRING(33),
      allowNull: true
    },
    addresslng: {
      type: DataTypes.STRING(33),
      allowNull: true
    },
    addresslatlngdate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    facebook_bot_link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    youtube_virtual_tour_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ask_for_email_tel_fb: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    receive_email_notifications: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    channel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tags: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mediaurl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    poster: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    added: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    prerollpod: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    prerollpodtype: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    postrollpod: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    postrollpodtype: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    emailsms10: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "Thanks for requesting a HouseTalk audio link for:"
    },
    emailsms30: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "FREE hotlist of homes matching your buying criteria! You will not find these properties online (distress sales, bank foreclosures and company owned homes)."
    },
    emailsms40: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "Call me now to get your free hotlist."
    },
    show_welcome_video: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'podcasting',
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
