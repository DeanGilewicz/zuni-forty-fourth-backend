const bcrypt = require("bcrypt");

/*
	Hash password with salt
*/
exports.hashPassword = (passwordPlainText, saltRounds = 10) => {
	return bcrypt.hash(passwordPlainText, saltRounds);
};

/*
	Compare hash password with another hash password
*/
exports.comparePassword = (passwordPlainText, passwordDb) => {
	return bcrypt.compare(passwordPlainText, passwordDb);
};
