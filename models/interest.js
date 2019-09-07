module.exports = (sequelize, type) => {
	return sequelize.define("interest", {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		interest: {
			type: type.STRING,
			validate: {
				validateInterest: function(value) {
					const reFind = new RegExp("[-, ,_]", 'g');
					const reIsAlphaNumeric = new RegExp("^[a-z0-9]+$", 'i');
					// remove spaces, hyphens, and underscores
					const sanitizedValue = value.replace(reFind, '');
					// check if alphanumeric
					if (!reIsAlphaNumeric.test(sanitizedValue)) {
						throw new Error(
							"Interests can only contain alphanumeric, hyphen or underscore characters"
						);
					}
				}
			}
		}
	});
};
