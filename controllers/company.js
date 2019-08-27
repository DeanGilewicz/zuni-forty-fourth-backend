const { Company } = require("../sequelize"); // import Sequelize modals
const { check } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

exports.validateCompanyArray = [
	check("type", "You must supply a company type")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("type"),
	check("name", "You must supply a company name")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("name"),
	check("email", "Email is not valid").isEmail(),
	sanitizeBody("email").normalizeEmail({
		remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	}),
	check("contactNumber", "You must supply a company phone number")
		.optional()
		.trim()
		.isNumeric()
		.isLength({ min: 10, max: 10 }),
	check("website", "You must supply a company website")
		.trim()
		.not()
		.isEmpty(),
	sanitizeBody("website"),
	check("address", "You must supply a company address")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("address"),
	check("city", "You must supply a company city")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("city"),
	check("state", "You must supply a company state")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("state"),
	check("zipCode", "You must supply a company zip code")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("zipCode")
];

exports.validateCompanyDeleteArray = [
	check("company", "You must supply a company")
		.not()
		.isEmpty()
		.exists({
			checkNull: true
		})
];

exports.validateCompanyUpdateArray = [
	check("company.type", "You must supply a company type")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("company.type"),
	check("company.name", "You must supply a company name")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("company.name"),
	check("company.email", "Email is not valid").isEmail(),
	sanitizeBody("company.email").normalizeEmail({
		remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	}),
	check("company.contactNumber", "You must supply a company phone number")
		.optional()
		.trim()
		.isNumeric()
		.isLength({ min: 10, max: 10 }),
	check("company.website", "You must supply a company website")
		.trim()
		.not()
		.isEmpty(),
	sanitizeBody("company.website"),
	check("company.address", "You must supply a company address")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("company.address"),
	check("company.city", "You must supply a company city")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("company.city"),
	check("company.state", "You must supply a company state")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("company.state"),
	check("company.zipCode", "You must supply a company zip code")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("company.zipCode")
];

exports.getCompaniesAll = async (req, res) => {
	const companies = await Company.findAll();
	if (!companies)
		return res.status(404).json({
			type: "error",
			action: "get companies",
			result: "no companies found"
		});
	return res.json({
		type: "success",
		action: "get companies",
		result: companies
	});
};

exports.getCompaniesByType = async (req, res) => {
	const { type } = req.body;
	const companies = await Company.findAll({
		where: {
			type: type
		}
	});
	if (!companies)
		return res.status(404).json({
			type: "error",
			action: "get companies by type",
			result: "no companies found"
		});
	return res.json({
		type: "success",
		action: "get companies by type",
		result: companies
	});
};

exports.createCompany = async (req, res) => {
	const createdCompany = await Company.create(req.body);
	return res.json({
		type: "success",
		action: "create company",
		result: createdCompany.dataValues
	});
};

exports.updateCompany = async (req, res) => {
	const company = await Company.findByPk(req.body.company.id);
	if (!company)
		return res.status(404).json({
			type: "error",
			action: "no company",
			result: "no company found"
		});
	delete req.body.company.id; // do not allow id to be updated
	const updatedCompany = await company.update({ ...req.body.company });
	return res.json({
		type: "success",
		action: "update company",
		result: updatedCompany.dataValues
	});
};

exports.deleteCompany = async (req, res) => {
	const company = await Company.findByPk(req.body.company.id);
	if (!company)
		return res.status(404).json({
			type: "error",
			action: "no company",
			result: "no company found"
		});
	const deletedCompany = await company.destroy();
	return res.json({
		type: "success",
		action: "delete company",
		result: deletedCompany
	});
};
