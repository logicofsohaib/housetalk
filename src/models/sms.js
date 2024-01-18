const smsModel = (sequelize, DataTypes) => {
    const sms = sequelize.define(
        'sms',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            customer_number: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: ''
            },
            property_id: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: ''
            }
        },
        {
            sequelize,
            tableName: 'sms',
            timestamps: true,
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
    return sms
}
export default smsModel
