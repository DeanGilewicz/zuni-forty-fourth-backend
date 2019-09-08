const Sequelize = require("sequelize");

const UserModel = require("./models/user");
const UserStatusModel = require("./models/userStatus");
const UserRoleModel = require("./models/userRole");
const PropertyModel = require("./models/property");
const EventModel = require("./models/event");
const CompanyModel = require("./models/company");
const InterestModel = require("./models/interest");

let dialectOptions = {
	useUTC: false, // for reading from database
	dateStrings: true,
	typeCast: true
};

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
		operatorsAliases: false,
		dialectOptions: dialectOptions,
		timezone: "-06:00" // for writing to database
	}
);

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
if (process.env.NODE_ENV !== "production") {
	// Create tables if don't exit
	sequelize.sync({ force: true }).then(() => {
		// Add seed data
		const seedProperty = Property.bulkCreate([
			{
				streetAddress: "2420 W 44th Ave",
				city: "Denver",
				state: "CO",
				zipCode: 80211
			},
			{
				streetAddress: "2416 W 44th Ave",
				city: "Denver",
				state: "CO",
				zipCode: 80211
			},
			{
				streetAddress: "2412 W 44th Ave",
				city: "Denver",
				state: "CO",
				zipCode: 80211
			},
			{
				streetAddress: "2408 W 44th Ave",
				city: "Denver",
				state: "CO",
				zipCode: 80211
			},
			{
				streetAddress: "2402 W 44th Ave",
				city: "Denver",
				state: "CO",
				zipCode: 80211
			},
			{
				streetAddress: "4375 Zuni Street",
				city: "Denver",
				state: "CO",
				zipCode: 80211
			},
			{
				streetAddress: "4379 Zuni Street",
				city: "Denver",
				state: "CO",
				zipCode: 80211
			},
			{
				streetAddress: "4383 Zuni Street",
				city: "Denver",
				state: "CO",
				zipCode: 80211
			},
			{
				streetAddress: "4387 Zuni Street",
				city: "Denver",
				state: "CO",
				zipCode: 80211
			},
			{
				streetAddress: "4391 Zuni Street",
				city: "Denver",
				state: "CO",
				zipCode: 80211
			},
			{
				streetAddress: "4395 Zuni Street",
				city: "Denver",
				state: "CO",
				zipCode: 80211
			}
		]);
		const users = User.bulkCreate([
			{
				verifyCode: "",
				verifyCodeExpiration: 1111111111,
				firstName: "admin",
				lastName: "user",
				emailAddress: "admin@test.com",
				password:
					"$2b$10$KooGtWwb6s/Dqe.gBjpyN.9Bt5lgNdTc88TH2d0.cEH2NGCQjc.m2",
				phoneNumber: "",
				image:
					"https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1565501442/zuni44/profile-placeholder.png"
			},
			{
				verifyCode: "",
				verifyCodeExpiration: 1212121212,
				firstName: "dean",
				lastName: "g",
				emailAddress: "dean@test.com",
				password:
					"$2b$10$KooGtWwb6s/Dqe.gBjpyN.9Bt5lgNdTc88TH2d0.cEH2NGCQjc.m2",
				phoneNumber: "1020121021",
				image:
					"https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1565501442/zuni44/profile-placeholder.png"
			},
			{
				verifyCode: "",
				verifyCodeExpiration: 2222222222,
				firstName: "julie",
				lastName: "g",
				emailAddress: "julie@test.com",
				password:
					"$2b$10$KooGtWwb6s/Dqe.gBjpyN.9Bt5lgNdTc88TH2d0.cEH2NGCQjc.m2",
				phoneNumber: "9992223333",
				image:
					"https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1565501442/zuni44/profile-placeholder.png"
			},
			{
				verifyCode: "",
				verifyCodeExpiration: 3333333333,
				firstName: "zoe",
				lastName: "smigs",
				emailAddress: "zoe@test.com",
				password:
					"$2b$10$KooGtWwb6s/Dqe.gBjpyN.9Bt5lgNdTc88TH2d0.cEH2NGCQjc.m2",
				phoneNumber: "2244668899",
				image:
					"https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1565501442/zuni44/profile-placeholder.png"
			},
			{
				verifyCode: "",
				verifyCodeExpiration: 4444444444,
				firstName: "andy",
				lastName: "hal",
				emailAddress: "andy@test.com",
				password:
					"$2b$10$KooGtWwb6s/Dqe.gBjpyN.9Bt5lgNdTc88TH2d0.cEH2NGCQjc.m2",
				phoneNumber: "8787878787",
				image:
					"https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1565501442/zuni44/profile-placeholder.png"
			},
			{
				verifyCode: "",
				verifyCodeExpiration: 5555555555,
				firstName: "lorna",
				lastName: "slats",
				emailAddress: "lorna@test.com",
				password:
					"$2b$10$KooGtWwb6s/Dqe.gBjpyN.9Bt5lgNdTc88TH2d0.cEH2NGCQjc.m2",
				phoneNumber: "7878787878",
				image:
					"https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1565501442/zuni44/profile-placeholder.png"
			},
			{
				verifyCode: "",
				verifyCodeExpiration: 6666666666,
				firstName: "danny",
				lastName: "allen",
				emailAddress: "danny@test.com",
				password:
					"$2b$10$KooGtWwb6s/Dqe.gBjpyN.9Bt5lgNdTc88TH2d0.cEH2NGCQjc.m2",
				phoneNumber: "6767676767",
				image:
					"https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1565501442/zuni44/profile-placeholder.png"
			},
			{
				verifyCode: "",
				verifyCodeExpiration: 7777777777,
				firstName: "kelly",
				lastName: "allen",
				emailAddress: "kelly@test.com",
				password:
					"$2b$10$KooGtWwb6s/Dqe.gBjpyN.9Bt5lgNdTc88TH2d0.cEH2NGCQjc.m2",
				phoneNumber: "3434343434",
				image:
					"https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1565501442/zuni44/profile-placeholder.png"
			},
			{
				verifyCode: "",
				verifyCodeExpiration: 8888888888,
				firstName: "lee",
				lastName: "iddy",
				emailAddress: "iddy@test.com",
				password:
					"$2b$10$KooGtWwb6s/Dqe.gBjpyN.9Bt5lgNdTc88TH2d0.cEH2NGCQjc.m2",
				phoneNumber: "5656565656",
				image:
					"https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1565501442/zuni44/profile-placeholder.png"
			},
			{
				verifyCode: "",
				verifyCodeExpiration: 9999999999,
				firstName: "clare",
				lastName: "sheen",
				emailAddress: "clare@test.com",
				password:
					"$2b$10$KooGtWwb6s/Dqe.gBjpyN.9Bt5lgNdTc88TH2d0.cEH2NGCQjc.m2",
				phoneNumber: "4545454545",
				image:
					"https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1565501442/zuni44/profile-placeholder.png"
			}
		]);
		const userStatus = UserStatus.bulkCreate([
			{
				status: "1",
				name: "Requested"
			},
			{
				status: "2",
				name: "Approved"
			},
			{
				status: "3",
				name: "Password"
			}
		]);
		const userRole = UserRole.bulkCreate([
			{
				role: "1",
				name: "Admin"
			},
			{
				role: "2",
				name: "Owner"
			},
			{
				role: "3",
				name: "User"
			}
		]);
		const userInterest = Interest.bulkCreate([
			{
				userId: 2,
				interest: "Coding"
			},
			{
				userId: 2,
				interest: "Golf"
			},
			{
				userId: 2,
				interest: "Soccer"
			},
			{
				userId: 3,
				interest: "Travel"
			},
			{
				userId: 3,
				interest: "Eating"
			},
			{
				userId: 4,
				interest: "Playing"
			},
			{
				userId: 3,
				interest: "Sleeping"
			},
			{
				userId: 3,
				interest: "Eating"
			}
		]);
		const events = Event.bulkCreate([
			{
				cost: 0,
				start: "2019-05-22 15:30:00",
				end: "2019-05-23 17:30:00",
				name: "El Jefe",
				address: "123 Cool Street",
				city: "Denver",
				state: "CO",
				zipCode: 80101
			},
			{
				cost: 10,
				start: "2019-05-19 14:00:00",
				end: "2019-05-19 16:00:00",
				name: "Conference",
				address: "343 West Lake",
				city: "Denver",
				state: "CO",
				zipCode: 80032
			},
			{
				cost: 40,
				start: "2019-06-10 10:45:00",
				end: "2019-06-10 11:45:00",
				name: "Common Grounds",
				address: "822 Nice Lance",
				city: "Denver",
				state: "CO",
				zipCode: 81121
			}
		]);
		const company = Company.bulkCreate([
			{
				type: "electrical",
				name: "Xcel Energy",
				email: "support@xcel.com",
				contactNumber: "3032123321",
				website: "https://www.xcelenergy.com",
				address: "222 Energy Lane",
				city: "Denver",
				state: "CO",
				zipCode: "80011"
			},
			{
				type: "builder",
				name: "Dawn Development",
				email: "",
				contactNumber: "",
				website: "",
				address: "812 Builder Lane",
				city: "Denver",
				state: "CO",
				zipCode: "80222"
			},
			{
				type: "internet-tv",
				name: "Century Link",
				email: "",
				contactNumber: "",
				website: "",
				address: "812 Century Road",
				city: "Denver",
				state: "CO",
				zipCode: "80111"
			}
		]);
		Promise.all([seedProperty, users, userStatus, userRole, events, company])
			.then(response => {
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
						userStatusId: adminStatusId
					},
					{ where: { id: adminId } }
				);

				User.update(
					{
						propertyId: propertyId,
						userRoleId: ownerRoleId,
						userStatusId: ownerStatusId
					},
					{ where: { id: ownerId } }
				);
				User.update(
					{
						propertyId: propertyId,
						userRoleId: userRoleId,
						userStatusId: userStatusId
					},
					{ where: { id: userId } }
				);
				User.update(
					{
						propertyId: propertyId,
						userRoleId: userRoleId2,
						userStatusId: userStatusId2
					},
					{ where: { id: userId2 } }
				);
				User.update(
					{
						propertyId: propertyId2,
						userRoleId: ownerRoleId2,
						userStatusId: ownerStatusId2
					},
					{ where: { id: ownerId2 } }
				);
				User.update(
					{
						propertyId: propertyId2,
						userRoleId: userRoleId3,
						userStatusId: userStatusId3
					},
					{ where: { id: userId3 } }
				);
				User.update(
					{
						propertyId: propertyId3,
						userRoleId: ownerStatusId3,
						userStatusId: ownerRoleId3
					},
					{ where: { id: ownerId3 } }
				);
				User.update(
					{
						propertyId: propertyId3,
						userRoleId: userRoleId4,
						userStatusId: userStatusId4
					},
					{ where: { id: userId4 } }
				);
				User.update(
					{
						propertyId: propertyId4,
						userRoleId: ownerStatusId4,
						userStatusId: ownerRoleId4
					},
					{ where: { id: ownerId4 } }
				);
				User.update(
					{
						propertyId: propertyId4,
						userRoleId: userRoleId5,
						userStatusId: userStatusId5
					},
					{ where: { id: userId5 } }
				);

				Property.update(
					{
						ownerId: ownerId4,
						users: [userId, userId2]
					},
					{ where: { streetAddress: "2408 W 44th Ave" } }
				);
				Property.update(
					{
						ownerId: ownerId,
						users: [userId3]
					},
					{ where: { streetAddress: "2420 W 44th Ave" } }
				);
				Property.update(
					{
						ownerId: ownerId2,
						users: [userId4]
					},
					{ where: { streetAddress: "2416 W 44th Ave" } }
				);
				Property.update(
					{
						ownerId: ownerId3,
						users: [userId5]
					},
					{ where: { streetAddress: "2412 W 44th Ave" } }
				);
				// Interest.update(
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
			.catch(err => console.log(err));
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
	Interest
};
