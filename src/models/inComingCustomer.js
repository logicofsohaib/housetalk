const incomingCustomerModel = (sequelize, DataTypes) => {
    const incomingCustomer = sequelize.define(
        'incomingcustomer',
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            lat: {
                type: DataTypes.FLOAT, 
                allowNull: true
            },
            lng: {
                type: DataTypes.FLOAT, 
                allowNull: true
            },
            email: {
                type: DataTypes.STRING(255), 
                allowNull: true
            },
            platform: {
                type: DataTypes.STRING(255), 
                allowNull: true
            },
            is_visited: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false 
            },
            property_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            member_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            count: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            ip: {
                type: DataTypes.STRING(45), 
                allowNull: true
            },
            phone: {
                type: DataTypes.STRING(20), 
                allowNull: true
            }
        },
        {
            sequelize,
            tableName: 'incomingcustomer',
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
    return incomingCustomer
}

export default incomingCustomerModel
