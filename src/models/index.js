import Sequelize from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

import adminModel from './admin.js'
import emailModel from './email.js'
import memberModal from './member.js'
import recordingpodModel from './recordingpod.js'
import frontendtemplateModel from './frontendtemplate.js'
import podcastingModel from './podcasting.js'
import visitStateModel from './visitstate.js'
import smsModel from './sms.js'
import incomingCustomerModel from './inComingCustomer.js'

const config = {
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.PORT,
    database: process.env.DATABASE
}
console.log('show===>>>>>>>>>>>', config.password, config.username, config.database, config.host)
const db = {}
const {Op, QueryTypes} = Sequelize
let sequelize = new Sequelize(config.database, config.username, config.password, config)

db.Op = Op
db.QueryTypes = QueryTypes
db.sequelize = sequelize


db.incomingCustomer = incomingCustomerModel(sequelize, Sequelize.DataTypes)
db.Admin = adminModel(sequelize, Sequelize.DataTypes)
db.email = emailModel(sequelize, Sequelize.DataTypes)
db.member = memberModal(sequelize, Sequelize.DataTypes)
db.recordingpod = recordingpodModel(sequelize, Sequelize.DataTypes)
db.frontendtemplate = frontendtemplateModel(sequelize, Sequelize.DataTypes)
db.podcasting = podcastingModel(sequelize, Sequelize.DataTypes)
db.visitstate = visitStateModel(sequelize, Sequelize.DataTypes)

db.sms = smsModel(sequelize, Sequelize.DataTypes)


db.member.hasMany(db.frontendtemplate, {foreignKey: 'templateuserid'})
/* db.userLikes = userLikeModel(sequelize, Sequelize.DataTypes)
db.productChemical = productChemicalModel(sequelize, Sequelize.DataTypes)
db.Chemical = ChemicalModel(sequelize, Sequelize.DataTypes)
db.userComments = userCommentModel(sequelize, Sequelize.DataTypes)
db.productCategorys = productCategoryModel(sequelize, Sequelize.DataTypes)
db.userSoldProductGood = userSoldGoodProductModel(sequelize, Sequelize.DataTypes)
db.User = userModel(sequelize, Sequelize.DataTypes)
db.UserNotification = userNotificationModel(sequelize, Sequelize.DataTypes)
db.FcmNotification = fcmNotificationModel(sequelize, Sequelize.DataTypes)
db.InvitedUser = invitedModel(sequelize, Sequelize.DataTypes)
db.ReportUser = reportUserModel(sequelize, Sequelize.DataTypes)
db.BlockUser = blockUserModel(sequelize, Sequelize.DataTypes)
db.LikeUser = likeUserModel(sequelize, Sequelize.DataTypes)
db.userProductGood = userProductGoodModel(sequelize, Sequelize.DataTypes)
db.UserPostes = userPostModel(sequelize, Sequelize.DataTypes)
db.UserEvents = userEventsModel(sequelize, Sequelize.DataTypes)
db.Events = eventsModel(sequelize, Sequelize.DataTypes)
db.EventParticipents = eventParticipentsModel(sequelize, Sequelize.DataTypes)
db.EventCategory = eventCategoryModel(sequelize, Sequelize.DataTypes)
db.Product = productModel(sequelize, Sequelize.DataTypes) */

// relations
/* db.User.hasMany(db.userProductGood, {foreignKey: 'u_id', as: 'userProductGood'})
db.userProductGood.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'user'
})

db.productCategorys.hasMany(db.userProductGood, {foreignKey: 'category_id', as: 'userCategory'})
db.userProductGood.belongsTo(db.productCategorys, {
    foreignKey: 'category_id',
    as: 'userCategory'
})

db.User.hasMany(db.UserPostes, {foreignKey: 'u_id', as: 'userPostes'})
db.UserPostes.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'user'
}) */
/* 
db.UserPostes.hasMany(db.userLikes, {foreignKey: 'Post_id', as: 'userLike'})
db.userLikes.belongsTo(db.UserPostes, {foreignKey: 'Post_id', as: 'userLike'})

db.UserPostes.hasMany(db.userComments, {foreignKey: 'Post_id', as: 'userComment'})
db.userComments.belongsTo(db.UserPostes, {foreignKey: 'Post_id', as: 'userComment'})

//chemical relation with product good

db.userProductGood.hasMany(db.productChemical, {foreignKey: 'product_id', as: 'chemical'})
db.productChemical.belongsTo(db.userProductGood, {foreignKey: 'product_id', as: 'chemical'})

db.Chemical.hasMany(db.productChemical, {foreignKey: 'chemical_id', as: 'chemical_List'})
db.productChemical.belongsTo(db.Chemical, {foreignKey: 'chemical_id', as: 'chemical_List'})

db.User.hasMany(db.UserEvents, {foreignKey: 'u_id', as: 'userEvents'})
db.UserEvents.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'userEvents'
})

db.User.hasMany(db.Events, {foreignKey: 'u_id', as: 'user'})
db.Events.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'user'
})

db.Events.hasMany(db.EventCategory, {foreignKey: 'event_id', as: 'eventDetails'})
db.EventCategory.belongsTo(db.Events, {
    foreignKey: 'event_id',
    as: 'eventDetails'
})

db.Events.hasMany(db.EventParticipents, {foreignKey: 'event_id', as: 'event_participents'})
db.EventParticipents.belongsTo(db.Events, {
    foreignKey: 'event_id',
    as: 'event_participents'
})

db.User.hasMany(db.EventParticipents, {foreignKey: 'u_id', as: 'participents_user'})
db.EventParticipents.belongsTo(db.User, {
    foreignKey: 'u_id',
    as: 'participents_user'
})

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
}) */

export default db
