const express = require("express");
const router = express.Router();

const { multerUploads } = require("../handlers/fileUpload.js");
const { catchErrors } = require("../handlers/errorHandlers");

const authController = require("../controllers/auth");
const propertyController = require("../controllers/property");
const userController = require("../controllers/user");
const eventController = require("../controllers/event");
const companyController = require("../controllers/company");

/*** registration ***/

router.post(
	"/api/register-owner",
	authController.validateRegisterOwnerArray,
	authController.validateResult,
	catchErrors(authController.registerOwner)
);

router.post(
	"/api/confirmation-owner",
	authController.validateConfirmationOwnerArray,
	authController.validateResult,
	catchErrors(authController.confirmationOwner)
);

router.post(
	"/api/register-user",
	authController.validateRegisterUserArray,
	authController.validateResult,
	catchErrors(authController.registerUser)
);

router.post(
	"/api/confirmation-user",
	authController.validateConfirmationUserArray,
	authController.validateResult,
	catchErrors(authController.confirmationUser)
);

/*** forgot password ***/

router.post(
	"/api/forgot-password",
	authController.validateForgotPasswordArray,
	authController.validateResult,
	catchErrors(authController.forgotPasswordSendEmail)
);

router.post(
	"/api/forgot-password-reset",
	authController.validateForgotPasswordResetArray,
	authController.validateResult,
	catchErrors(authController.forgotPasswordReset)
);

/*** login / logout ***/

router.post(
	"/api/login",
	authController.validateLoginArray,
	authController.validateResult,
	catchErrors(authController.login)
);

router.post("/api/logout", authController.isLoggedIn, authController.logout);

/*** properties ***/

// get all properties (unprotected)
router.get("/api/properties", catchErrors(propertyController.getProperties));

// no update or delete routes

/*** logged in user (admin, owner, or user) ***/

// get currently logged in user
router.post(
	"/api/user/current",
	authController.isLoggedIn,
	authController.isSameUserRequested,
	authController.validateResult,
	catchErrors(userController.getCurrentUser)
);

// update currently logged in user
router.put(
	"/api/user/current/update",
	authController.isLoggedIn,
	authController.isSameUserRequested,
	userController.validateCurrentUserUpdateArray,
	authController.validateResult,
	catchErrors(userController.updateCurrentUser)
);

// update currently logged in user's profile image
router.post(
	"/api/user/current/profile-image",
	authController.isLoggedIn,
	authController.isSameUserRequested,
	multerUploads,
	catchErrors(userController.updateCurrentUserProfileImage)
);

// reset currently logged in user's profile image
router.post(
	"/api/user/current/profile-image/reset",
	authController.isLoggedIn,
	authController.isSameUserRequested,
	catchErrors(userController.resetCurrentUserProfileImage)
);

// delete currently logged in user
// router.delete(
// 	"/api/user/current/delete",
// 	authController.isLoggedIn,
// 	authController.isSameUserRequested,
// 	userController.validateCurrentUserDeleteArray,
// 	authController.validateResult,
// 	catchErrors(userController.deleteCurrentUser)
// );

// change currently logged in user's password
router.put(
	"/api/user/current/change-password",
	authController.isLoggedIn,
	authController.isSameUserRequested,
	userController.validateCurrentUserPasswordUpdateArray,
	authController.validateResult,
	catchErrors(authController.changeCurrentUserPassword)
);

// get all properties and their users
router.post(
	"/api/properties/all",
	authController.isLoggedIn,
	catchErrors(propertyController.getAllPropertiesWithUsers)
);

/*** Admin Only ***/

// get all properties (and associated users)
router.post(
	"/api/properties",
	authController.isLoggedIn,
	authController.isAdmin,
	// propertyController.validatePropertiesArray,
	// authController.validateResult,
	catchErrors(propertyController.getAllProperties)
);

router.post(
	"/api/properties/no-owner",
	authController.isLoggedIn,
	authController.isAdmin,
	propertyController.validatePropertiesNoOwnerArray,
	authController.validateResult,
	catchErrors(propertyController.getAllPropertiesNoOwner)
);

router.post(
	"/api/properties/has-owner",
	authController.isLoggedIn,
	authController.isAdmin,
	propertyController.validatePropertiesHasOwnerArray,
	authController.validateResult,
	catchErrors(propertyController.getAllPropertiesHasOwner)
);

// get all other users
router.post(
	"/api/users",
	authController.isLoggedIn,
	authController.isAdmin,
	// userController.validateUsersArray,
	// authController.validateResult,
	catchErrors(userController.getAllUsers)
);

// get other user
router.post(
	"/api/user",
	authController.isLoggedIn,
	authController.isAdmin,
	userController.validateUserArray,
	authController.validateResult,
	catchErrors(userController.getUser)
);

// update other user
router.put(
	"/api/user/update",
	authController.isLoggedIn,
	authController.isAdmin,
	userController.validateUserUpdateArray,
	authController.validateResult,
	catchErrors(userController.updateUser)
);

router.put(
	"/api/owner/update",
	authController.isLoggedIn,
	authController.isAdmin,
	userController.validateOwnerUpdateArray,
	authController.validateResult,
	catchErrors(userController.updateOwner)
);

// delete other owner
router.post(
	"/api/owner/delete",
	authController.isLoggedIn,
	authController.isAdmin,
	userController.validateOwnerDeleteArray,
	authController.validateResult,
	catchErrors(userController.deleteOwner)
);

// change property owner

router.put(
	"/api/property/changeOwner",
	authController.isLoggedIn,
	authController.isAdmin,
	propertyController.validatePropertyChangeOwnerArray,
	authController.validateResult,
	catchErrors(propertyController.changeOwner)
);

router.post(
	"/api/events",
	authController.isLoggedIn,
	catchErrors(eventController.getEvents)
);

router.post(
	"/api/event/create",
	authController.isLoggedIn,
	authController.isAdmin,
	eventController.validateEventsArray,
	authController.validateResult,
	catchErrors(eventController.createEvent)
);

router.put(
	"/api/event/update",
	authController.isLoggedIn,
	authController.isAdmin,
	eventController.validateEventUpdateArray,
	authController.validateResult,
	catchErrors(eventController.updateEvent)
);

router.post(
	"/api/event/delete",
	authController.isLoggedIn,
	authController.isAdmin,
	eventController.validateEventDeleteArray,
	authController.validateResult,
	catchErrors(eventController.deleteEvent)
);

router.post(
	"/api/companies",
	authController.isLoggedIn,
	catchErrors(companyController.getCompaniesAll)
);

router.post(
	"/api/company/create",
	authController.isLoggedIn,
	authController.isAdmin,
	companyController.validateCompanyArray,
	authController.validateResult,
	catchErrors(companyController.createCompany)
);

router.put(
	"/api/company/update",
	authController.isLoggedIn,
	authController.isAdmin,
	companyController.validateCompanyUpdateArray,
	authController.validateResult,
	catchErrors(companyController.updateCompany)
);

router.post(
	"/api/company/delete",
	authController.isLoggedIn,
	authController.isAdmin,
	companyController.validateCompanyDeleteArray,
	authController.validateResult,
	catchErrors(companyController.deleteCompany)
);

/*** Admin and Owner Only ***/

// get property users
router.post(
	"/api/property/users",
	authController.isLoggedIn,
	authController.isAdminOrOwner,
	propertyController.validatePropertyUsersArray,
	authController.validateResult,
	catchErrors(propertyController.getPropertyUsers)
);

// delete other user
router.post(
	"/api/user/delete",
	authController.isLoggedIn,
	authController.isAdminOrOwner,
	userController.validateUserDeleteArray,
	authController.validateResult,
	catchErrors(userController.deleteUser)
);

/*** Owner Only ***/

// get property by owner
router.post(
	"/api/property/owner",
	authController.isLoggedIn,
	authController.isOwner,
	propertyController.validateOwnerArray,
	authController.validateResult,
	catchErrors(propertyController.getPropertyByOwner)
);

module.exports = router;
