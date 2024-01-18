const adminModel = (sequelize, DataTypes) => {
    const admin = sequelize.define('admin', {
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        login_token: DataTypes.STRING
    })
    return admin
}

export default adminModel
