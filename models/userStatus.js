module.exports = (sequelize, type) => {
	return sequelize.define('userStatus', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		status: {
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