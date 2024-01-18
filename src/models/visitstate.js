const visitStateModel = (sequelize, DataTypes) => {
    const visitstate = sequelize.define(
        'visit_stat',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            visitor_ip: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            visited_on: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            },
            property_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            member_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            inquirer_email_tel: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            referrer: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            friend: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            requested_call_back: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            new: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            }
        },
        {
            sequelize,
            tableName: 'visit_stat',
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
    return visitstate
}

export default visitStateModel
