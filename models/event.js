module.exports = (sequelize, type) => {
	return sequelize.define("event", {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		cost: {
			type: type.INTEGER,
			validate: {
				isNumeric: true
			}
		},
		start: {
			type: type.DATE,
			validate: {
				isDate: true
			}
		},
		end: {
			type: type.DATE,
			validate: {
				isDate: true
			}
		},
		name: {
			type: type.STRING,
			validate: {
				notEmpty: true,
				is: ["^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$", "i"]
			}
		},
		address: {
			type: type.STRING,
			validate: {
				is: ["^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _#.]*$", "i"]
			}
		},
		city: {
			type: type.STRING,
			validate: {
				isAlpha: true
			}
		},
		state: {
			type: type.STRING,
			validate: {
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
