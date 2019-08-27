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
				is: ["^[a-zA-Z0-9_]*$"]
			}
		}
	});
};
