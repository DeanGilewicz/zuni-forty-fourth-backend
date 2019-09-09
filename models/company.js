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
				validateEmail: function(value) {
					if( typeof value !== 'undefined' && value !== '' & !sequelize.Validator.isEmail(value) ) {
						throw new Error(
							"Email address is not valid"
						);
					}
				}
			}
		},
		contactNumber: {
			type: type.STRING,
			validate: {
				validateContactNumber: function(value) {
					// const reContactNumber = new RegExp("^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$", 'g');
					if( typeof value !== 'undefined' && value !== '' & !sequelize.Validator.isNumeric(value) ) {
						throw new Error(
							"Contact number is not valid"
						);
					}
				}
			}
		},
		website: {
			type: type.STRING,
			validate: {
				validateWebsite: function(value) {
					// const reUrl = new RegExp("https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)", 'g');
					if( typeof value !== 'undefined' && value !== '' & !sequelize.Validator.isUrl(value) ) {
						throw new Error(
							"Website url is not valid"
						);
					}
				}
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
