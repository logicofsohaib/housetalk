const memberModel = (sequelize, DataTypes) => {
    const member = sequelize.define(
        'member',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            parentid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            smsmessagecount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            child_user_allowed: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            package: {
                type: DataTypes.TINYINT,
                allowNull: false
            },
            type: {
                type: DataTypes.ENUM('user', 'subuser', 'admin'),
                allowNull: false,
                defaultValue: 'user'
            },
            language: {
                type: DataTypes.ENUM('en', 'fr'),
                allowNull: false,
                defaultValue: 'en'
            },
            lang_chk: {
                type: DataTypes.ENUM('0', '1'),
                allowNull: false,
                defaultValue: '0'
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
                allowNull: false
            },
            password: {
                type: DataTypes.STRING(32),
                allowNull: false,
                defaultValue: ''
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ''
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
                allowNull: false,
                defaultValue: ''
            },
            session: {
                type: DataTypes.STRING(32),
                allowNull: false,
                defaultValue: ''
            },
            ip: {
                type: DataTypes.STRING(15),
                allowNull: false,
                defaultValue: ''
            },
            activationkey: {
                type: DataTypes.STRING(32),
                allowNull: false,
                defaultValue: ''
            },
            privs: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            history: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            avatar: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ''
            },
            opt: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            opts: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            profile_privacy: {
                type: DataTypes.SMALLINT,
                allowNull: false,
                defaultValue: 0
            },
            gender: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 0
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
                allowNull: false,
                defaultValue: ''
            },
            created: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ''
            },
            lastlogin: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ''
            },
            profileviews: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            agreed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            hidemature: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            viewerhistory: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            optoutofviewerlist: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            banned: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            country: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            allow_subscribtion: {
                type: DataTypes.CHAR(1),
                allowNull: false,
                defaultValue: '0'
            },
            allow_upload_by_subscribers: {
                type: DataTypes.CHAR(1),
                allowNull: false,
                defaultValue: '0'
            },
            subscriber_parent: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            subscriber: {
                type: DataTypes.CHAR(1),
                allowNull: false,
                defaultValue: '0'
            },
            subscriber_to: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: 'web_tv'
            },
            subscriber_pw: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            userapproved: {
                type: DataTypes.CHAR(1),
                allowNull: false,
                defaultValue: '0'
            },
            auth_token: {
                type: DataTypes.STRING(555)
            },
            login_token: {type: DataTypes.STRING(555)},
            group_checkbox: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            youtube_welcome_link: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            facebook_pixel: {
                type: DataTypes.STRING(855),
                allowNull: true
            },
            ask_for_email: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            ask_for_tel: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            ask_for_facebook: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            ask_for_gmail: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            show_welcome_video: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            email_notifications_on_visitor_activity: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            sequelize,
            tableName: 'member',
            hasTrigger: true,
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{name: 'id'}]
                }
            ]
        }
    )
    return member
}
export default memberModel
