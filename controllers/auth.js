const { check, validationResult } = require("express-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { User, UserRole, Property } = require("../sequelize");
const { hashPassword, comparePassword } = require("../handlers/auth");
const mail = require("../handlers/mail");

/* validate result fn */
exports.validateResult = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res
			.status(422)
			.json({ type: "error", action: "form errors", result: errors.array() });
	}
	return next();
};

/* START VALIDATION */

exports.validateRegisterOwnerArray = [
	check("propertyId", "You must supply a property").not().isEmpty(),
	check("firstName", "You must supply a first name")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("lastName", "You must supply a last name")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("emailAddress", "Email is not valid")
		.isEmail()
		.trim()
		.escape()
		.normalizeEmail({
			gmail_remove_dots: false,
			remove_extension: false,
		}),
];

exports.validateRegisterUserArray = [
	check("propertyId", "You must supply a property").not().isEmpty(),
	check("firstName", "You must supply a first name")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("lastName", "You must supply a last name")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("emailAddress", "Email is not valid")
		.isEmail()
		.trim()
		.escape()
		.normalizeEmail({
			gmail_remove_dots: false,
			remove_extension: false,
		}),
];

exports.validateLoginArray = [
	check("emailAddress", "Email is not valid")
		.isEmail()
		.trim()
		.escape()
		.normalizeEmail({
			gmail_remove_dots: false,
			remove_extension: false,
		}),
	check("password", "Password cannot be empty!")
		.not()
		.isEmpty()
		.trim()
		.escape(),
];

exports.validateForgotPasswordArray = [
	check("propertyId", "You must supply a property").not().isEmpty(),
	check("firstName", "You must supply a first name")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("lastName", "You must supply a last name")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("emailAddress", "Email is not valid")
		.isEmail()
		.trim()
		.escape()
		.normalizeEmail({
			gmail_remove_dots: false,
			remove_extension: false,
		}),
];

exports.validateForgotPasswordResetArray = [
	check("emailAddress", "Email is not valid")
		.isEmail()
		.trim()
		.escape()
		.normalizeEmail({
			gmail_remove_dots: false,
			remove_extension: false,
		}),
	check("verifyCode", "Verify Code cannot be empty!").not().isEmpty(),
	check("newPassword", "Password cannot be empty!").not().isEmpty(),
	check("confirmPassword", "Confirm Password cannot be empty").not().isEmpty(),
	check("confirmPassword", "Passwords do not match").custom(
		(value, { req }) => value === req.body.newPassword
	),
];

exports.validateConfirmationOwnerArray = [
	check("tempPassword", "You must supply a password").not().isEmpty(),
	check("verifyCode", "You must supply a verification code").not().isEmpty(),
	check("emailAddress", "Email is not valid")
		.isEmail()
		.trim()
		.escape()
		.normalizeEmail({
			gmail_remove_dots: false,
			remove_extension: false,
		}),
];

exports.validateConfirmationUserArray = [
	check("tempPassword", "You must supply a password").not().isEmpty(),
	check("verifyCode", "You must supply a verification code").not().isEmpty(),
	check("emailAddress", "Email is not valid")
		.isEmail()
		.trim()
		.escape()
		.normalizeEmail({
			gmail_remove_dots: false,
			remove_extension: false,
		}),
];

/* END VALIDATION */

function generatePassword() {
	const length = 12;
	const charset =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let retVal = "";
	for (let i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
}

exports.registerOwner = async (req, res, next) => {
	// create owner (user) object
	const owner = req.body;
	// if user exists then return error
	const existingOwner = await User.findOne({
		where: { emailAddress: owner.emailAddress },
		// include: [{ model: User }]
	});
	if (existingOwner) {
		return res.status(404).json({
			type: "error",
			action: "owner registration",
			result: "Owner already exists",
		});
	}
	const { propertyId } = req.body;
	// find property
	const property = await Property.findOne({
		where: { id: propertyId },
	});
	// if no property found
	if (!property)
		return res.status(404).json({
			type: "error",
			action: "no property exists",
			result: "No property found",
		});
	// check if property already has an owner since can't add another one
	if (property.ownerId)
		return res.status(404).json({
			type: "error",
			action: "owner exists",
			result: "Owner already exists!",
		});
	// create predefined password
	const generatedPassword = generatePassword();
	const passwordHash = await hashPassword(generatedPassword);
	owner.password = passwordHash;
	// set owner role as owner
	owner.userRoleId = 2;
	// set owner status as requested
	owner.userStatusId = 1;
	// set verify code
	owner.verifyCode = crypto.randomBytes(20).toString("hex");
	// set verify code expiration - 48 hours from now
	owner.verifyCodeExpiration = Date.now() + 60 * 60 * 48 * 1000; // 48 hours from now
	// set placeholder image
	owner.image =
		"https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1565501442/zuni44/profile-placeholder.png";
	// create owner
	const createdOwner = await User.create(owner);
	// req.user = createdOwner; // uncomment to make user available on the req
	// send an email to invite owner
	await mail.send({
		filename: "invitation-owner",
		user: createdOwner.dataValues,
		property: property.dataValues,
		registrationUrl: `${process.env.FE_HOST}/owner-registration-confirmation`,
		tempPassword: generatedPassword,
		subject: `${createdOwner.dataValues.firstName}, you have been invited to join Zuni Forty Fourth`,
	});
	return res.json({
		type: "success",
		action: "register owner",
		result: createdOwner,
	});
};

exports.confirmationOwner = async (req, res, next) => {
	const { emailAddress, verifyCode, tempPassword } = req.body;
	// find user
	const user = await User.findOne({
		where: {
			emailAddress,
			verifyCode,
		},
	});
	// check user exists
	if (!user)
		return res
			.status(404)
			.json({ type: "error", action: "no user", result: "No user found" });
	// check password match
	const isPasswordMatch = await comparePassword(tempPassword, user.password);
	if (!isPasswordMatch)
		return res
			.status(404)
			.json({ type: "error", action: "no user", result: "No user found" });
	// check verify code has not expired
	if (parseInt(user.verifyCodeExpiration, 10) < Date.now())
		return res.status(404).json({
			type: "error",
			action: "verification code expired",
			result: "Verification code expired",
		});
	user.verifyCode = null;
	user.verifyCodeExpiration = null;
	// grant user access
	user.userStatusId = 2;
	// save user
	const createdOwner = await user.save();
	// get associated property
	const associatedProperty = await Property.findOne({
		where: { id: createdOwner.propertyId },
	});
	// set property owner
	associatedProperty.ownerId = createdOwner.id;
	await associatedProperty.save();
	return res.json({
		type: "success",
		action: "confirmation owner",
		result: createdOwner.dataValues,
	});
};

exports.registerUser = async (req, res, next) => {
	// create user object
	const user = req.body;
	// if user exists then return error
	const existingUser = await User.findOne({
		where: { emailAddress: user.emailAddress },
		// include: [{ model: User }]
	});
	if (existingUser) {
		return res.status(404).json({
			type: "error",
			action: "user registration",
			result: "User already exists",
		});
	}
	const { propertyId } = req.body;
	// find property
	const property = await Property.findOne({
		where: { id: propertyId },
		// include: [{ model: User }]
	});
	// if no property found return error
	if (!property)
		return res.status(404).json({
			type: "error",
			action: "no property exists",
			result: "No property found",
		});
	// if no owner found then exit since need an owner before adding additional users
	if (!property.ownerId)
		return res.status(404).json({
			type: "error",
			action: "no owner",
			result: "Owner does not exist!",
		});
	// get owner info
	const owner = await User.findByPk(property.ownerId);
	// create predefined password
	const generatedPassword = generatePassword();
	const passwordHash = await hashPassword(generatedPassword);
	user.password = passwordHash;
	// set user role as user
	user.userRoleId = 3;
	// set user status as requested
	user.userStatusId = 1;
	// set verify code
	user.verifyCode = crypto.randomBytes(20).toString("hex");
	// set verify code expiration - 48 hours from now
	user.verifyCodeExpiration = Date.now() + 60 * 60 * 48 * 1000; // 48 hours from now
	// set placeholder image
	user.image =
		"https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1565501442/zuni44/profile-placeholder.png";
	// create user
	const createdUser = await User.create(user);
	// req.user = createdOwner; // uncomment to make user available on the req
	// send email to invite user
	await mail.send({
		filename: "invitation-user",
		user: createdUser.dataValues,
		owner: owner.dataValues,
		property: property.dataValues,
		registrationUrl: `${process.env.FE_HOST}/user-registration-confirmation`,
		tempPassword: generatedPassword,
		subject: `${createdUser.dataValues.firstName}, you have been invited to join Zuni Forty Fourth`,
	});
	return res.json({
		type: "success",
		action: "register user",
		result: createdUser,
	});
};

exports.confirmationUser = async (req, res, next) => {
	const { emailAddress, verifyCode, tempPassword } = req.body;
	// find user
	const user = await User.findOne({
		where: {
			emailAddress,
			verifyCode,
		},
	});
	// check user exists
	if (!user)
		return res
			.status(404)
			.json({ type: "error", action: "no user", result: "No user found" });
	// check password match
	const isPasswordMatch = await comparePassword(tempPassword, user.password);
	if (!isPasswordMatch)
		return res
			.status(404)
			.json({ type: "error", action: "no user", result: "No user found" });
	// check verify code has not expired
	if (parseInt(user.verifyCodeExpiration, 10) < Date.now())
		return res.status(404).json({
			type: "error",
			action: "verification code expired",
			result: "Verification code expired",
		});
	user.verifyCode = null;
	user.verifyCodeExpiration = null;
	// grant user access
	user.userStatusId = 2;
	// save user
	const registeredUser = await user.save();
	// no need to save property or push user in property users array - sequelize does this for you
	// const associatedProperty = await Property.findOne({ where: { id: createdUser.propertyId } });
	// await associatedProperty.save();
	return res.json({
		type: "success",
		action: "confirmation user",
		result: registeredUser.dataValues,
	});
};

exports.login = async (req, res, next) => {
	const { emailAddress, password } = req.body;
	// find user based on email
	const user = await User.findOne({
		where: { emailAddress },
		include: [{ model: UserRole }],
	});
	// no user found by email address
	if (!user)
		return res
			.status(404)
			.json({ type: "error", action: "no user", result: "No user found" });
	// check password match
	const isPasswordMatch = await comparePassword(password, user.password);
	if (!isPasswordMatch)
		return res
			.status(404)
			.json({ type: "error", action: "no user", result: "No user found" });
	// check user status is approved
	if (user && user.userStatusId != 2)
		return res.status(401).json({
			type: "error",
			action: "unapproved",
			result: "User does not have access",
		});
	// create token
	const token = jwt.sign(
		{
			userId: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.userRole.dataValues.name,
		},
		process.env.SECRET
	);
	// split token into 2 - JWT header and Payload, JWT signature
	const tokenSplitArr = token.split(".");
	const jwtHeaderAndPayload = `${tokenSplitArr[0]}.${tokenSplitArr[1]}`;
	const jwtSignature = tokenSplitArr[tokenSplitArr.length - 1];
	// set user id on the session
	req.session.user = user.id;
	// set jwt token signature on the session to access later
	req.session.token = jwtSignature;
	// set the jwt header and payload as a cookie on the response
	res.cookie("token", jwtHeaderAndPayload, {
		httpOnly: false, // can access in browser with JS
		maxAge: 1800000, // 30 mins
	});
	// send response - user is authorized
	return res
		.status(200)
		.json({ type: "success", action: "login", result: "User authorized" });
};

// make sure user is logged in before doing anything
exports.isLoggedIn = (req, res, next) => {
	// reconstruct jwt token
	const tokenSignature = req.session.token;
	const tokenHeaderPayload = req.cookies.token;
	if (tokenSignature && tokenHeaderPayload) {
		const jwtToken = `${tokenHeaderPayload}.${tokenSignature}`;
		return jwt.verify(jwtToken, process.env.SECRET, (err, decoded) => {
			if (err) {
				return res.status(403).json({
					type: "error",
					action: "no session and session user",
					result: "Token is not valid",
				});
			} else {
				// update cookie to reset max age for another 30 mins
				res.cookie("token", tokenHeaderPayload, {
					httpOnly: false, // can access in browser with JS
					maxAge: 24 * 60 * 60 * 1000, // 24hrs - The maximum age (in milliseconds) of a valid cookie
				});
				// set user on request
				req.jwtDecoded = decoded;
				return next();
			}
		});
	} else {
		return res.status(403).clearCookie("token").json({
			type: "error",
			action: "no session and session user",
			result: "Auth token is not supplied",
		});
	}
};

exports.isAdmin = (req, res, next) => {
	const { role } = req.jwtDecoded;
	if (role.indexOf("Admin") < 0) {
		return res.status(403).json({
			type: "error",
			action: "permission error",
			result: "User does not have permission",
		});
	}
	next();
};

exports.isAdminOrOwner = (req, res, next) => {
	const { role } = req.jwtDecoded;
	if (role.indexOf("Admin") < 0 && role.indexOf("Owner") < 0) {
		return res.status(403).json({
			type: "error",
			action: "permission error",
			result: "User does not have permission",
		});
	}
	next();
};

exports.isOwner = (req, res, next) => {
	const { role } = req.jwtDecoded;
	if (role.indexOf("Owner") < 0) {
		return res.status(403).json({
			type: "error",
			action: "permission error",
			result: "User does not have permission",
		});
	}
	next();
};

exports.isSameUserRequested = (req, res, next) => {
	const tokenUserId = req.jwtDecoded.userId;
	const sessionUserId = req.session.user;
	if (tokenUserId !== sessionUserId) {
		return res.status(403).json({
			type: "error",
			action: "is same user requested",
			result: "User does not have permission",
		});
	}
	next();
};

exports.logout = (req, res, next) => {
	// delete client (browser) cookie
	res.clearCookie("token");
	// delete server (backend) session
	req.session.destroy();
	return res.clearCookie("token").json({
		type: "success",
		action: "logout",
		result: "You are logged out",
	});
};

// forgot password - (after form validation) find user and send email
exports.forgotPasswordSendEmail = async (req, res, next) => {
	const { firstName, lastName, emailAddress, propertyId } = req.body;
	// find user by several factors
	const user = await User.findOne({
		where: {
			firstName,
			lastName,
			emailAddress,
			propertyId,
		},
	});
	// no user found
	if (!user)
		return res
			.status(404)
			.json({ type: "error", action: "no user", result: "No user found" });
	// update verify code, verify expiration and user status to 3
	user.verifyCode = crypto.randomBytes(20).toString("hex");
	user.verifyCodeExpiration = Date.now() + 3600000; // 1 hour from now
	user.userStatusId = 3;
	// update user
	await user.save();
	// email user
	await mail.send({
		filename: "password-reset",
		user: user.dataValues,
		resetUrl: `${process.env.FE_HOST}/forgot-password-reset`,
		subject: "Zuni Forty Fourth password reset request",
	});
	return res.json({
		type: "success",
		action: "forgot password",
		result: "A password reset email has been sent",
	});
};

exports.forgotPasswordReset = async (req, res, next) => {
	const { emailAddress, verifyCode, newPassword, confirmPassword } = req.body;
	// check new password and confirm match
	if (newPassword !== confirmPassword)
		return res.status(404).json({
			type: "error",
			action: "forgot password reset",
			result: "Passwords do not match",
		});
	// find user by email
	const user = await User.findOne({
		where: {
			emailAddress,
			verifyCode,
		},
	});
	// check user exists
	if (!user)
		return res
			.status(404)
			.json({ type: "error", action: "no user", result: "No user found" });
	// check verify code has not expired
	if (parseInt(user.verifyCodeExpiration, 10) < Date.now())
		return res.status(404).json({
			type: "error",
			action: "verification code expired",
			result: "Verification code expired",
		});
	// hash new password
	const passwordHash = await hashPassword(newPassword);
	user.password = passwordHash;
	user.verifyCode = null;
	user.verifyCodeExpiration = null;
	user.userStatusId = 2;
	// save new password for user
	await user.save();
	return res.json({
		type: "success",
		action: "forgot password reset",
		result: "Password reset",
	});
};

// user logged in - edit profile account
exports.changeCurrentUserPassword = async (req, res, next) => {
	// use session
	const userId = req.session.user;
	const { password, newPassword, confirmPassword } = req.body;
	// check current password, new password and confirm password isn't empty
	if (!password || !newPassword || !confirmPassword) {
		return res.status(404).json({
			type: "error",
			action: "change password",
			result: "Please complete all fields",
		});
	}
	// check new password matches confirm password
	if (newPassword !== confirmPassword) {
		return res.status(404).json({
			type: "error",
			action: "change password",
			result: "Passwords do not match",
		});
	}
	// query db for user
	const user = await User.findOne({
		where: { id: userId },
	});
	// compare provided password with user password
	const isPasswordMatch = await comparePassword(password, user.password);
	if (!isPasswordMatch) {
		return res.status(404).json({
			type: "error",
			action: "change password",
			result: "Incorrect password",
		});
	}
	// check new password isn't the same as current password
	const isPasswordSame = await comparePassword(newPassword, user.password);
	if (isPasswordSame) {
		return res.status(404).json({
			type: "error",
			action: "change password",
			result: "Please provide a new password",
		});
	}
	// hash new password
	const passwordHash = await hashPassword(newPassword);
	// save new password for user
	await user.update({ password: passwordHash });
	return res.json({
		type: "success",
		action: "change password",
		result: "Password updated",
	});
};
