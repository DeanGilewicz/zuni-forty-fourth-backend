module.exports = (sequelize, type) => {
	return sequelize.define("user", {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		verifyCode: {
			type: type.STRING
		},
		verifyCodeExpiration: {
			type: type.BIGINT
		},
		firstName: {
			type: type.STRING,
			validate: {
				notEmpty: true,
				isAlpha: true
			}
		},
		lastName: {
			type: type.STRING,
			validate: {
				notEmpty: true,
				isAlpha: true
			}
		},
		emailAddress: {
			type: type.STRING,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: type.STRING
		},
		phoneNumber: {
			type: type.STRING,
			validate: {
				isAlphanumeric: true
			}
		},
		image: {
			type: type.STRING,
			validate: {
				notEmpty: true
			}
		}
	});
};
