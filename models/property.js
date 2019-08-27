module.exports = (sequelize, type) => {
	return sequelize.define("property", {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		streetAddress: {
			type: type.STRING,
			validate: {
				notEmpty: true,
				isAlpha: true
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
