const { Op } = require("sequelize");
const { Property, User, Interest } = require("../sequelize"); // import Sequelize modals
const { check } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

exports.validatePropertyUsersArray = [
	check("propertyId", "You must supply a propertyId")
		.not()
		.isEmpty(),
	sanitizeBody("propertyId")
];

exports.validatePropertyChangeOwnerArray = [
	check("propertyId", "You must supply a property")
		.not()
		.isEmpty(),
	sanitizeBody("propertyId"),
	check("userId", "You must supply a user")
		.not()
		.isEmpty(),
	sanitizeBody("userId")
];

exports.validateOwnerArray = [
	check("ownerId", "You must supply an owner")
		.not()
		.isEmpty(),
	sanitizeBody("ownerId")
];

exports.validatePropertiesNoOwnerArray = [];

exports.validatePropertiesHasOwnerArray = [];

exports.getProperties = async (req, res) => {
	const properties = await Property.findAll();
	if (!properties)
		return res.status(404).json({
			type: "error",
			action: "no properties",
			result: "No properties found"
		});
	return res.json(properties);
};

exports.getAllPropertiesNoOwner = async (req, res) => {
	const properties = await Property.findAll({
		where: {
			ownerId: null
		}
	});
	if (!properties)
		return res.status(404).json({
			type: "error",
			action: "no properties",
			result: "No properties found"
		});
	return res.json(properties);
};

exports.getAllPropertiesHasOwner = async (req, res) => {
	const properties = await Property.findAll({
		where: {
			ownerId: {
				[Op.not]: null
			}
		}
	});
	if (!properties)
		return res.status(404).json({
			type: "error",
			action: "no properties",
			result: "No properties found"
		});
	return res.json(properties);
};

exports.getAllProperties = async (req, res) => {
	const properties = await Property.findAll({
		include: [{ model: User, as: "owner" }, { model: User, as: "users" }]
	});
	if (!properties)
		return res.status(404).json({
			type: "error",
			action: "no properties",
			result: "No properties found"
		});
	return res.json(properties);
};

exports.getAllPropertiesWithUsers = async (req, res) => {
	const properties = await Property.findAll({
		include: [
			{
				model: User,
				as: "users",
				include: [Interest]
			}
		]
	});
	if (!properties)
		return res.status(404).json({
			type: "error",
			action: "no properties",
			result: "No properties found"
		});
	return res.json(properties);
};

exports.getPropertyUsers = async (req, res) => {
	const { propertyId } = req.body;
	const properties = await Property.findOne({
		where: { id: propertyId },
		include: [{ model: User, as: "users" }]
	});
	if (!properties)
		return res.status(404).json({
			type: "error",
			action: "no properties",
			result: "No properties found"
		});
	return res.json(properties);
};

exports.getPropertyByOwner = async (req, res) => {
	const { ownerId } = req.body;
	// find property
	const property = await Property.findOne({
		where: { ownerId: ownerId },
		include: [{ model: User, as: "users" }]
	});
	if (!property)
		return res.status(404).json({
			type: "error",
			action: "no property",
			result: "No property found"
		});
	return res.json(property);
};

exports.changeOwner = async (req, res) => {
	const { propertyId, userId } = req.body;
	// find property
	const property = await Property.findByPk(propertyId);
	if (!property)
		return res.status(404).json({
			type: "error",
			action: "no property",
			result: "No property found"
		});
	// find owner
	const owner = await User.findByPk(property.dataValues.ownerId);
	if (!owner)
		return res
			.status(404)
			.json({ type: "error", action: "no owner", result: "No owner found" });
	// find user
	const user = await User.findByPk(userId);
	if (!user)
		return res
			.status(404)
			.json({ type: "error", action: "no user", result: "No user found" });
	// update property, owner and user
	const updateAll = async () => {
		try {
			return await Promise.all([
				property.update({ ownerId: userId }), // update property owner
				owner.update({ userRoleId: 3 }), // update owner to user
				user.update({ userRoleId: 2 }) // update user to owner
			]);
		} catch (err) {
			return res.status(404).json({
				type: "error",
				action: "no change of owner",
				result: err
			});
		}
	};
	// save promises
	const allUpdated = await updateAll();
	// if save fails then return error
	if (!allUpdated) {
		return res.status(404).json({
			type: "error",
			action: "no change of owner",
			result: "Property owner could not be updated"
		});
	}
	// find property
	const updatedProperty = await Property.findOne({
		where: { id: propertyId },
		include: [{ model: User, as: "owner" }, { model: User, as: "users" }]
	});
	// if no property then return error
	if (!updatedProperty) {
		return res.status(404).json({
			type: "error",
			action: "update property",
			result: "Updated property can not be retrieved"
		});
	}
	// return updated property
	return res.json(updatedProperty);
};
