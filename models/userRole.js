module.exports = (sequelize, type) => {
	return sequelize.define('userRole', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		role: {
			type: type.INTEGER,
			validate: {
				notEmpty: true,
				isNumeric: true,
			}
		},
		name: {
			type: type.STRING,
			validate: {
				notEmpty: true,
				isAlpha: true
			}
		},
	});
};