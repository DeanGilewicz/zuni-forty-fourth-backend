const { User, Property, Interest } = require("../sequelize"); // import Sequelize modals
const { check } = require("express-validator");
const { dataUri } = require("../handlers/fileUpload.js");
const { uploader } = require("cloudinary");

exports.getUsers = async (req, res) => {
	const users = await User.findAll({
		include: [{ model: Property }],
	});
	if (!users)
		return res
			.status(404)
			.json({ type: "error", action: "get users", result: "No users found" });
	// remove passwords
	if (users.length > 0) {
		users.forEach((user) => delete user.dataValues.password);
	}
	return res.json({ type: "success", action: "get users", result: users });
};

exports.getCurrentUser = async (req, res) => {
	const userId = req.session.user;
	const user = await User.findOne({
		where: { id: userId },
		include: [{ model: Interest }],
	});
	if (!user)
		return res
			.status(404)
			.json({ type: "error", action: "no user", result: "No user found" });
	// remove password
	delete user.dataValues.password;
	return res.json({
		type: "success",
		action: "get user",
		result: user.dataValues,
	});
};

exports.getUser = async (req, res) => {
	const { userId } = req.body;
	const user = await User.findByPk(userId);
	if (!user)
		return res
			.status(404)
			.json({ type: "error", action: "no user", result: "No user found" });
	// remove password
	delete user.dataValues.password;
	return res.json({
		type: "success",
		action: "get the user",
		result: user.dataValues,
	});
};

exports.updateUser = async (req, res) => {
	const user = await User.findByPk(req.body.user.id);
	if (!user)
		return res
			.status(404)
			.json({ type: "error", action: "no user", result: "No user found" });
	const updatedUser = await user.update(req.body.user);
	return res.json({
		type: "success",
		action: "update user",
		result: updatedUser.dataValues,
	});
};

exports.validateCurrentUserUpdateArray = [
	check("firstName", "You must supply a first name")
		.optional({ checkFalsy: false })
		.trim()
		.escape(),
	check("lastName", "You must supply a last name").optional().trim().escape(),
	check("phoneNumber", "You must supply a phone number")
		.optional()
		.trim()
		.isNumeric()
		.isLength({ min: 10, max: 10 }),
];

exports.validateCurrentUserPasswordUpdateArray = [
	check("password", "You must supply a password").trim().escape(),
	check("newPassword", "You must supply a new password").trim().escape(),
	check("confirmPassword", "You must supply a new password").trim().escape(),
];

exports.validateUserArray = [
	check("userId", "You must supply a userId").not().isEmpty(),
];

exports.validateUserUpdateArray = [
	check("user.propertyId", "You must supply a property").not().isEmpty(),
	check("user.firstName", "You must supply a first name")
		.optional({ checkFalsy: false })
		.trim()
		.escape(),
	check("user.lastName", "You must supply a last name")
		.optional()
		.trim()
		.escape(),
	check("user.phoneNumber", "You must supply a phone number")
		.optional()
		.trim()
		.isNumeric()
		.isLength({ min: 10, max: 10 }),
];

exports.validateUserDeleteArray = [
	check("userId", "You must supply a user").not().isEmpty(),
];

exports.validateOwnerUpdateArray = [
	check("owner.propertyId", "You must supply a property").not().isEmpty(),
	check("owner.firstName", "You must supply a first name")
		.optional({ checkFalsy: false })
		.trim()
		.escape(),
	check("owner.lastName", "You must supply a last name")
		.optional()
		.trim()
		.escape(),
	check("owner.phoneNumber", "You must supply a phone number")
		.optional()
		.trim()
		.isNumeric()
		.isLength({ min: 10, max: 10 }),
];

exports.validateOwnerDeleteArray = [
	check("ownerId", "You must supply an owner").not().isEmpty(),
];

exports.updateCurrentUser = async (req, res) => {
	const userId = req.session.user;
	const user = await User.findOne({
		where: { id: userId },
		include: [{ model: Interest }],
	});
	if (!user)
		return res
			.status(404)
			.json({ type: "error", action: "no user", result: "No user found" });
	let interests;
	if (typeof req.body.interests !== "undefined") {
		interests = req.body.interests;
		delete req.body.interests;
	}
	let additionalInterest;
	if (typeof req.body.additionalInterest !== "undefined") {
		additionalInterest = req.body.additionalInterest;
		delete req.body.additionalInterest;
	}
	const data = req.body; // user data
	if (additionalInterest) {
		additionalInterest.userId = user.id;
		await Interest.create(additionalInterest);
	}
	if (interests) {
		(async () => {
			for (const int of interests) {
				try {
					await Interest.update(
						{ interest: int.interest },
						{ where: { id: int.id, userId: user.id } }
					);
				} catch (err) {
					let errorMessage = "Failed to update interest";
					if (
						typeof err.errors !== "undefined" &&
						typeof err.errors[0] !== "undefined" &&
						typeof err.errors[0].message !== "undefined" &&
						err.errors[0].message !== ""
					) {
						errorMessage = err.errors[0].message;
					}
					await user.update(data);
					return res.status(404).json({
						type: "error",
						action: "update user",
						result: errorMessage,
					});
				}
			}
			// save user
			let userWithInterests = await user.update(data);
			// add additional interest to returned user object
			if (additionalInterest) {
				userWithInterests.dataValues.interests.push(additionalInterest);
			} else {
				userWithInterests.dataValues.interests = interests;
			}
			return res.json({
				type: "success",
				action: "update user",
				result: userWithInterests.dataValues,
			});
		})();
	} else {
		return res.json({
			type: "success",
			action: "update user",
			result: userWithInterests.dataValues,
		});
	}
};

exports.updateCurrentUserProfileImage = async (req, res) => {
	/// TEST THE ELSE CLAUSE IF NEEDED e.g. if( banane ) what happens?
	if (req.file) {
		const userId = req.session.user;
		const file = await dataUri(req).content;
		if (!file)
			return res.status(404).json({
				type: "error",
				action: "converting file to string",
				result: "Unable to convert file",
			});
		const uploadedFile = await uploader.upload(file, null, {
			folder: "zuni44",
			use_filename: true,
		});
		if (!uploadedFile)
			return res.status(404).json({
				type: "error",
				action: "uploading file",
				result: "Failed to upload image",
			});
		// cloudinary image upload ref
		const image = uploadedFile.secure_url;
		// find user
		const user = await User.findOne({
			where: { id: userId },
			include: [{ model: Interest }],
		});
		if (!user)
			return res.status(404).json({
				type: "error",
				action: "no user",
				result: "Image unable to be saved for user",
			});
		// delete current profile image for user from Cloudinary - except for profile-placeholder image
		if (user.image && user.image.indexOf("profile-placeholder") === -1) {
			const strArray = user.image.split("/");
			const strArrayLastItem = strArray[strArray.length - 1];
			const cloudinaryPublicId = strArrayLastItem.split(".")[0];
			await uploader.destroy(`zuni44/${cloudinaryPublicId}`);
		}
		// update user's image in db
		const updatedUser = await user.update({
			image: image,
		});
		return res.json({
			type: "success",
			action: "update user profile image",
			result: updatedUser.dataValues,
		});
	}
};

exports.resetCurrentUserProfileImage = async (req, res) => {
	const userId = req.session.user;
	const user = await User.findOne({
		where: { id: userId },
		include: [{ model: Interest }],
	});
	if (!user)
		return res.status(404).json({
			type: "error",
			action: "no user",
			result: "Image unable to be saved for user",
		});
	// ref placeholder image
	const placeholderImage =
		"https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1565501442/zuni44/profile-placeholder.png";
	// delete current profile image for user from Cloudinary - except for profile-placeholder image
	if (user.image && user.image.indexOf("profile-placeholder") === -1) {
		const strArray = user.image.split("/");
		const strArrayLastItem = strArray[strArray.length - 1];
		const cloudinaryPublicId = strArrayLastItem.split(".")[0];
		await uploader.destroy(`zuni44/${cloudinaryPublicId}`);
	}
	// update user's image in db
	const updatedUser = await user.update({
		image: placeholderImage,
	});
	return res.json({
		type: "success",
		action: "reset user profile image",
		result: updatedUser.dataValues,
	});
};

exports.deleteCurrentUser = async (req, res) => {
	const user = await User.findByPk(req.body.userId);
	if (!user)
		return res
			.status(404)
			.json({ type: "error", action: "no user", result: "No user found" });
	const deletedUser = await user.destroy();
	delete deletedUser.dataValues.password;
	return res.json({
		type: "success",
		action: "delete user",
		result: deletedUser,
	});
};

exports.deleteUser = async (req, res) => {
	const user = await User.findByPk(req.body.userId);
	if (!user)
		return res
			.status(404)
			.json({ type: "error", action: "no user", result: "No user found" });
	// delete user interests if any exist
	await Interest.destroy({
		where: { userId: user.id },
	});
	const deletedUser = await user.destroy();
	delete deletedUser.dataValues.password;
	return res.json({
		type: "success",
		action: "delete user",
		result: deletedUser,
	});
};

exports.updateOwner = async (req, res) => {
	const userId = req.body.owner.id;
	const owner = await User.findByPk(userId);
	if (!owner)
		return res
			.status(404)
			.json({ type: "error", action: "no owner", result: "No owner found" });
	const data = req.body.owner;
	const updatedOwner = await owner.update(data);
	return res.json({
		type: "success",
		action: "update owner",
		result: updatedOwner.dataValues,
	});
};

exports.deleteOwner = async (req, res) => {
	// get owner (user)
	const owner = await User.findByPk(req.body.ownerId);
	if (!owner)
		return res
			.status(404)
			.json({ type: "error", action: "no owner", result: "No owner found" });
	// get property for this owner
	const property = await Property.findOne({
		where: { ownerId: owner.id },
		include: [
			{ model: User, as: "owner" },
			{ model: User, as: "users" },
		],
	});
	if (!property)
		return res.status(404).json({
			type: "error",
			action: "property owner does not exist",
			result: "No property found",
		});
	// check property doesn't have any users - using 1 since owner is included in users array
	if (property.users.length > 1) {
		return res.status(404).json({
			type: "error",
			action: "delete owner",
			result: "Cannot delete owner as users exist",
		});
	}
	// delete owner interests if any exist
	await Interest.destroy({
		where: { userId: owner.id },
	});
	// delete owner (user)
	const deletedOwner = await owner.destroy();
	delete deletedOwner.dataValues.password;
	// update property
	await property.update({
		ownerId: null,
	});
	// return deleted owner
	return res.json({
		type: "success",
		action: "delete owner",
		result: deletedOwner,
	});
};
