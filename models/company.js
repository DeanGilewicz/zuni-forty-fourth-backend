module.exports = (sequelize, type) => {
	return sequelize.define("company", {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		type: {
			type: type.STRING,
			validate: {
				notEmpty: true
			}
		},
		name: {
			type: type.STRING,
			validate: {
				notEmpty: true,
				is: ["^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$", "i"]
			}
		},
		email: {
			type: type.STRING,
			validate: {
				isEmail: true
			}
		},
		contactNumber: {
			type: type.STRING,
			validate: {
				isNumeric: true
			}
		},
		website: {
			type: type.STRING,
			validate: {
				isUrl: true
			}
		},
		address: {
			type: type.STRING,
			validate: {
				notEmpty: true,
				is: ["^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$", "i"]
			}
		},
		city: {
			type: type.STRING,
			validate: {
				notEmpty: true,
				isAlpha: true
			}
		},
		state: {
			type: type.STRING,
			validate: {
				notEmpty: true,
				isAlpha: true
			}
		},
		zipCode: {
			type: type.INTEGER,
			validate: {
				notEmpty: true,
				isNumeric: true
			}
		}
	});
};
