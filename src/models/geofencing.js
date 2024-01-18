const geoFencingModal = (sequelize, DataTypes) => {
    const geoFencing = sequelize.define(
        'geofencing',
        {
            templateid: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },

            latitude: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            longitude: {
                type: DataTypes.STRING(255),
                allowNull: true
            }
        },
        {
            sequelize,
            tableName: 'podfrontendtemplate',
            timestamps: false,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [{name: 'templateid'}]
                }
            ]
        }
    )
    return geoFencing
}
export default geoFencingModal
