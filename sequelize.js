const Sequelize = require("sequelize");
const tunnel = require("tunnel-ssh");
const fs = require("fs");
const seedData = require("./seedData");

const UserModel = require("./models/user");
const UserStatusModel = require("./models/userStatus");
const UserRoleModel = require("./models/userRole");
const PropertyModel = require("./models/property");
const EventModel = require("./models/event");
const CompanyModel = require("./models/company");
const InterestModel = require("./models/interest");

const seedDataProperties = seedData.properties;
const seedDataUsers = seedData.users;
const seedDataUserStatus = seedData.userStatus;
const seedDataUserRoles = seedData.userRoles;
const seedDataUserInterests = seedData.userInterests;
const seedDataEvents = seedData.events;
const seedDataCompanies = seedData.companies;

// let dialectOptions = {
// 	useUTC: false, // for reading from database
// 	dateStrings: true,
// 	typeCast: true,
// };

if (process.env.DB_SSL) {
	dialectOptions.ssl = process.env.DB_SSL;
}

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASS,
	{
		host: process.env.DB_HOST,
		dialect: "mysql",
		storage: "./session.mysql",
		operatorsAliases: "0",
		// dialectOptions: dialectOptions,
		timezone: "-06:00", // for writing to database
	}
);

if (process.env.NODE_ENV === "sshTunnel") {
	const sshTunnelConfig = {
		username: process.env.SSH_TUNNEL_USERNAME, // SSH username
		Password: process.env.SSH_TUNNEL_PASSWORD,
		host: process.env.SSH_TUNNEL_HOST, // SSH address
		port: process.env.SSH_TUNNEL_PORT,
		dstHost: process.env.SSH_TUNNEL_DESTINATION_HOST, // database connection url
		dstPort: process.env.SSH_TUNNEL_DESTINATION_PORT, // remote database connection port
		// localHost: '',
		// localPort: 0, // same as dstPort, It'll be the port you'll use for your local machine
		passphrase: process.env.SSH_TUNNEL_DESTINATION_PASSPHRASE,
		privateKey: fs.readFileSync(
			process.env.SSH_TUNNEL_DESTINATION_PRIVATE_KEY_PATH
		),
	};
	tunnel(sshTunnelConfig, function (error, server) {
		if (error) {
			return console.error(error);
		} else {
			// console.log('sshed to server:', server);
			// test sequelize connection
			// sequelize.authenticate().then(function(err) {
			// 	console.log('connection established');
			// }).catch(function(err) {
			// 	console.error('unable establish connection', err);
			// })
		}
	});
}

const User = UserModel(sequelize, Sequelize);
const UserStatus = UserStatusModel(sequelize, Sequelize);
const UserRole = UserRoleModel(sequelize, Sequelize);
const Property = PropertyModel(sequelize, Sequelize);
const Event = EventModel(sequelize, Sequelize);
const Company = CompanyModel(sequelize, Sequelize);
const Interest = InterestModel(sequelize, Sequelize);

// Relationships
User.belongsTo(Property);
User.belongsTo(UserRole);
User.belongsTo(UserStatus);
Property.belongsTo(User, { as: "owner", constraints: false });
Property.hasMany(User, { as: "users" });
// Property.belongsToMany(User, { through: 'property_user', foreignKey: 'propertyId', otherKey: 'userId' });
Interest.belongsTo(User);
User.hasMany(Interest);

// only seed data for development
if (
	process.env.NODE_ENV !== "production" &&
	process.env.NODE_ENV !== "sshTunnel"
) {
	// Create tables if don't exit
	sequelize.sync({ force: true }).then(() => {
		// Add seed data
		const seedProperty = Property.bulkCreate(seedDataProperties);
		const users = User.bulkCreate(seedDataUsers);
		const userStatus = UserStatus.bulkCreate(seedDataUserStatus);
		const userRole = UserRole.bulkCreate(seedDataUserRoles);
		const userInterest = Interest.bulkCreate(seedDataUserInterests);
		const events = Event.bulkCreate(seedDataEvents);
		const company = Company.bulkCreate(seedDataCompanies);
		Promise.all([seedProperty, users, userStatus, userRole, events, company])
			.then((response) => {
				// create seed relationships
				const propertyId = response[0][0].dataValues.id;

				const adminId = response[1][0].dataValues.id;
				const adminStatusId = response[2][1].dataValues.id;
				const adminRoleId = response[3][0].dataValues.id;

				const ownerId = response[1][1].dataValues.id;
				const ownerStatusId = response[2][1].dataValues.id;
				const ownerRoleId = response[3][1].dataValues.id;

				const userId = response[1][2].dataValues.id;
				const userStatusId = response[2][1].dataValues.id;
				const userRoleId = response[3][2].dataValues.id;

				const userId2 = response[1][3].dataValues.id;
				const userStatusId2 = response[2][1].dataValues.id;
				const userRoleId2 = response[3][2].dataValues.id;
				const propertyId2 = response[0][1].dataValues.id;

				const ownerId2 = response[1][4].dataValues.id;
				const ownerStatusId2 = response[2][1].dataValues.id;
				const ownerRoleId2 = response[3][1].dataValues.id;

				const userId3 = response[1][5].dataValues.id;
				const userStatusId3 = response[2][1].dataValues.id;
				const userRoleId3 = response[3][2].dataValues.id;

				const propertyId3 = response[0][2].dataValues.id;

				const ownerId3 = response[1][6].dataValues.id;
				const ownerStatusId3 = response[2][1].dataValues.id;
				const ownerRoleId3 = response[3][1].dataValues.id;

				const userId4 = response[1][7].dataValues.id;
				const userStatusId4 = response[2][1].dataValues.id;
				const userRoleId4 = response[3][2].dataValues.id;

				const propertyId4 = response[0][3].dataValues.id;

				const ownerId4 = response[1][8].dataValues.id;
				const ownerStatusId4 = response[2][1].dataValues.id;
				const ownerRoleId4 = response[3][1].dataValues.id;

				const userId5 = response[1][9].dataValues.id;
				const userStatusId5 = response[2][1].dataValues.id;
				const userRoleId5 = response[3][2].dataValues.id;

				// NO PROPERTY ATTACHED FOR ADMIN
				User.update(
					{
						// propertyId: propertyId,
						userRoleId: adminRoleId,
						userStatusId: adminStatusId,
					},
					{ where: { id: adminId } }
				);

				User.update(
					{
						propertyId: propertyId,
						userRoleId: ownerRoleId,
						userStatusId: ownerStatusId,
					},
					{ where: { id: ownerId } }
				);
				User.update(
					{
						propertyId: propertyId,
						userRoleId: userRoleId,
						userStatusId: userStatusId,
					},
					{ where: { id: userId } }
				);
				User.update(
					{
						propertyId: propertyId,
						userRoleId: userRoleId2,
						userStatusId: userStatusId2,
					},
					{ where: { id: userId2 } }
				);
				User.update(
					{
						propertyId: propertyId2,
						userRoleId: ownerRoleId2,
						userStatusId: ownerStatusId2,
					},
					{ where: { id: ownerId2 } }
				);
				User.update(
					{
						propertyId: propertyId2,
						userRoleId: userRoleId3,
						userStatusId: userStatusId3,
					},
					{ where: { id: userId3 } }
				);
				User.update(
					{
						propertyId: propertyId3,
						userRoleId: ownerStatusId3,
						userStatusId: ownerRoleId3,
					},
					{ where: { id: ownerId3 } }
				);
				User.update(
					{
						propertyId: propertyId3,
						userRoleId: userRoleId4,
						userStatusId: userStatusId4,
					},
					{ where: { id: userId4 } }
				);
				User.update(
					{
						propertyId: propertyId4,
						userRoleId: ownerStatusId4,
						userStatusId: ownerRoleId4,
					},
					{ where: { id: ownerId4 } }
				);
				User.update(
					{
						propertyId: propertyId4,
						userRoleId: userRoleId5,
						userStatusId: userStatusId5,
					},
					{ where: { id: userId5 } }
				);

				Property.update(
					{
						ownerId: ownerId4,
						users: [userId, userId2],
					},
					{ where: { streetAddress: "123 Demo Ave" } }
				);
				Property.update(
					{
						ownerId: ownerId,
						users: [userId3],
					},
					{ where: { streetAddress: "456 Demo Ave" } }
				);
				Property.update(
					{
						ownerId: ownerId2,
						users: [userId4],
					},
					{ where: { streetAddress: "789 Demo Ave" } }
				);
				Property.update(
					{
						ownerId: ownerId3,
						users: [userId5],
					},
					{ where: { streetAddress: "1011 Demo Ave" } }
				);
				// userInterest.update(
				// 	{
				// 		userId: 2
				// 	},
				// 	{ where: { id: 1 } }
				// );
				// Interest.update(
				// 	{
				// 		userId: 2
				// 	},
				// 	{ where: { id: 2 } }
				// );
				// Interest.update(
				// 	{
				// 		userId: 2
				// 	},
				// 	{ where: { id: 3 } }
				// );
				// Interest.update(
				// 	{
				// 		userId: 2
				// 	},
				// 	{ where: { id: 4 } }
				// );
				console.log(`Database & tables created!`);
			})
			.catch((err) => console.log(err));
	});
}

module.exports = {
	sequelize,
	User,
	UserStatus,
	UserRole,
	Property,
	Event,
	Company,
	Interest,
};
