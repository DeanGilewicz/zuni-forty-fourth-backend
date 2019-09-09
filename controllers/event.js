const { Event } = require("../sequelize"); // import Sequelize modals
const { check } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

exports.validateEventsArray = [
	check("cost", "You must supply an event cost")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("cost"),
	check("start", "You must supply an event start date and time")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("start"),
	check("end", "You must supply an event end date and time")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("end"),
	check("name", "You must supply an event name")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("name"),
	check("address", "You must supply an event address")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("address"),
	check("city", "You must supply an event city")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("city"),
	check("state", "You must supply an event state")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("state"),
	check("zipCode", "You must supply an event zip code")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("zipCode")
];

exports.validateEventDeleteArray = [
	check("event", "You must supply an event")
		.not()
		.isEmpty()
		.exists({
			checkNull: true
		})
];

exports.validateEventUpdateArray = [
	check("event.address", "You must supply an address")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("event.address"),
	check("event.city", "You must supply a city")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("event.city"),
	check("event.cost", "You must supply a cost")
		.optional()
		.trim()
		.escape(),
	sanitizeBody("event.cost"),
	check("event.end", "You must supply an end date")
		.not()
		.isEmpty()
		.exists({
			checkNull: true
		}),
	check("event.name", "You must supply an end date")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("event.name"),
	check("event.start", "You must supply a start date")
		.not()
		.isEmpty()
		.exists({
			checkNull: true
		}),
	check("event.state", "You must supply a state")
		.trim()
		.escape()
		.not()
		.isEmpty(),
	sanitizeBody("event.state"),
	check("event.zipCode", "You must supply a zip code")
		.trim()
		.isNumeric()
		.isLength({ min: 5, max: 5 })
];

exports.getEvents = async (req, res) => {
	const events = await Event.findAll({
		order: [
			['start', 'ASC']
		]
	});
	if (!events)
		return res
			.status(404)
			.json({ type: "error", action: "get events", result: "No events found" });
	return res.json({ type: "success", action: "get events", result: events });
};

exports.createEvent = async (req, res) => {
	const createdEvent = await Event.create(req.body);
	return res.json({
		type: "success",
		action: "create event",
		result: createdEvent.dataValues
	});
};

exports.updateEvent = async (req, res) => {
	const event = await Event.findByPk(req.body.event.id);
	if (!event)
		return res.status(404).json({
			type: "error",
			action: "no event",
			result: "No event found"
		});
	delete req.body.event.id; // do not allow id to be updated
	const updatedEvent = await event.update({ ...req.body.event });
	return res.json({
		type: "success",
		action: "update event",
		result: updatedEvent.dataValues
	});
};

exports.deleteEvent = async (req, res) => {
	const event = await Event.findByPk(req.body.event.id);
	if (!event)
		return res.status(404).json({
			type: "error",
			action: "no event",
			result: "No event found"
		});
	const deletedEvent = await event.destroy();
	return res.json({
		type: "success",
		action: "delete event",
		result: deletedEvent
	});
};
