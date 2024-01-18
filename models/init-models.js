var DataTypes = require("sequelize").DataTypes;
var _aaemails = require("./aaemails");
var _admins = require("./admins");
var _ban = require("./ban");
var _blockusers = require("./blockusers");
var _categories_by_admin = require("./categories_by_admin");
var _category = require("./category");
var _chemicals = require("./chemicals");
var _contactus = require("./contactus");
var _country = require("./country");
var _email = require("./email");
var _email_text = require("./email_text");
var _emails = require("./emails");
var _eventcategories = require("./eventcategories");
var _eventparticipents = require("./eventparticipents");
var _events = require("./events");
var _fcmnotifications = require("./fcmnotifications");
var _featuredpodcasting = require("./featuredpodcasting");
var _frontendtemplate = require("./frontendtemplate");
var _group = require("./group");
var _inviteds = require("./inviteds");
var _ips = require("./ips");
var _media = require("./media");
var _member = require("./member");
var _member_log = require("./member_log");
var _menu = require("./menu");
var _message = require("./message");
var _packagedetail = require("./packagedetail");
var _packages = require("./packages");
var _podbanners = require("./podbanners");
var _podcasting = require("./podcasting");
var _podchannel = require("./podchannel");
var _podfrontendtemplate = require("./podfrontendtemplate");
var _podfrontendtemplate_bu = require("./podfrontendtemplate_bu");
var _podstat = require("./podstat");
var _productcategorys = require("./productcategorys");
var _productchemicals = require("./productchemicals");
var _products = require("./products");
var _rating = require("./rating");
var _recordingpod = require("./recordingpod");
var _recordingpod_bu = require("./recordingpod_bu");
var _reportusers = require("./reportusers");
var _setting = require("./setting");
var _usercomments = require("./usercomments");
var _userevents = require("./userevents");
var _userlikeds = require("./userlikeds");
var _userlikes = require("./userlikes");
var _usernotifications = require("./usernotifications");
var _userpostes = require("./userpostes");
var _userproductgoods = require("./userproductgoods");
var _users = require("./users");
var _usersoldproductgoods = require("./usersoldproductgoods");
var _videorecording = require("./videorecording");
var _visit_stat = require("./visit_stat");

function initModels(sequelize) {
  var aaemails = _aaemails(sequelize, DataTypes);
  var admins = _admins(sequelize, DataTypes);
  var ban = _ban(sequelize, DataTypes);
  var blockusers = _blockusers(sequelize, DataTypes);
  var categories_by_admin = _categories_by_admin(sequelize, DataTypes);
  var category = _category(sequelize, DataTypes);
  var chemicals = _chemicals(sequelize, DataTypes);
  var contactus = _contactus(sequelize, DataTypes);
  var country = _country(sequelize, DataTypes);
  var email = _email(sequelize, DataTypes);
  var email_text = _email_text(sequelize, DataTypes);
  var emails = _emails(sequelize, DataTypes);
  var eventcategories = _eventcategories(sequelize, DataTypes);
  var eventparticipents = _eventparticipents(sequelize, DataTypes);
  var events = _events(sequelize, DataTypes);
  var fcmnotifications = _fcmnotifications(sequelize, DataTypes);
  var featuredpodcasting = _featuredpodcasting(sequelize, DataTypes);
  var frontendtemplate = _frontendtemplate(sequelize, DataTypes);
  var group = _group(sequelize, DataTypes);
  var inviteds = _inviteds(sequelize, DataTypes);
  var ips = _ips(sequelize, DataTypes);
  var media = _media(sequelize, DataTypes);
  var member = _member(sequelize, DataTypes);
  var member_log = _member_log(sequelize, DataTypes);
  var menu = _menu(sequelize, DataTypes);
  var message = _message(sequelize, DataTypes);
  var packagedetail = _packagedetail(sequelize, DataTypes);
  var packages = _packages(sequelize, DataTypes);
  var podbanners = _podbanners(sequelize, DataTypes);
  var podcasting = _podcasting(sequelize, DataTypes);
  var podchannel = _podchannel(sequelize, DataTypes);
  var podfrontendtemplate = _podfrontendtemplate(sequelize, DataTypes);
  var podfrontendtemplate_bu = _podfrontendtemplate_bu(sequelize, DataTypes);
  var podstat = _podstat(sequelize, DataTypes);
  var productcategorys = _productcategorys(sequelize, DataTypes);
  var productchemicals = _productchemicals(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var rating = _rating(sequelize, DataTypes);
  var recordingpod = _recordingpod(sequelize, DataTypes);
  var recordingpod_bu = _recordingpod_bu(sequelize, DataTypes);
  var reportusers = _reportusers(sequelize, DataTypes);
  var setting = _setting(sequelize, DataTypes);
  var usercomments = _usercomments(sequelize, DataTypes);
  var userevents = _userevents(sequelize, DataTypes);
  var userlikeds = _userlikeds(sequelize, DataTypes);
  var userlikes = _userlikes(sequelize, DataTypes);
  var usernotifications = _usernotifications(sequelize, DataTypes);
  var userpostes = _userpostes(sequelize, DataTypes);
  var userproductgoods = _userproductgoods(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var usersoldproductgoods = _usersoldproductgoods(sequelize, DataTypes);
  var videorecording = _videorecording(sequelize, DataTypes);
  var visit_stat = _visit_stat(sequelize, DataTypes);

  productchemicals.belongsTo(chemicals, { as: "chemical", foreignKey: "chemical_id"});
  chemicals.hasMany(productchemicals, { as: "productchemicals", foreignKey: "chemical_id"});
  userproductgoods.belongsTo(productcategorys, { as: "category", foreignKey: "category_id"});
  productcategorys.hasMany(userproductgoods, { as: "userproductgoods", foreignKey: "category_id"});
  productchemicals.belongsTo(userproductgoods, { as: "product", foreignKey: "product_id"});
  userproductgoods.hasMany(productchemicals, { as: "productchemicals", foreignKey: "product_id"});
  userevents.belongsTo(users, { as: "u", foreignKey: "u_id"});
  users.hasMany(userevents, { as: "userevents", foreignKey: "u_id"});
  userpostes.belongsTo(users, { as: "u", foreignKey: "u_id"});
  users.hasMany(userpostes, { as: "userpostes", foreignKey: "u_id"});
  userproductgoods.belongsTo(users, { as: "u", foreignKey: "u_id"});
  users.hasMany(userproductgoods, { as: "userproductgoods", foreignKey: "u_id"});

  return {
    aaemails,
    admins,
    ban,
    blockusers,
    categories_by_admin,
    category,
    chemicals,
    contactus,
    country,
    email,
    email_text,
    emails,
    eventcategories,
    eventparticipents,
    events,
    fcmnotifications,
    featuredpodcasting,
    frontendtemplate,
    group,
    inviteds,
    ips,
    media,
    member,
    member_log,
    menu,
    message,
    packagedetail,
    packages,
    podbanners,
    podcasting,
    podchannel,
    podfrontendtemplate,
    podfrontendtemplate_bu,
    podstat,
    productcategorys,
    productchemicals,
    products,
    rating,
    recordingpod,
    recordingpod_bu,
    reportusers,
    setting,
    usercomments,
    userevents,
    userlikeds,
    userlikes,
    usernotifications,
    userpostes,
    userproductgoods,
    users,
    usersoldproductgoods,
    videorecording,
    visit_stat,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
