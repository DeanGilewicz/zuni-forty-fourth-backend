const { Event } = require("../sequelize"); // import Sequelize modals
const { check } = require("express-validator");

exports.validateEventsArray = [
	check("cost", "You must supply an event cost")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("start", "You must supply an event start date and time")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("end", "You must supply an event end date and time")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("name", "You must supply an event name")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("address", "You must supply an event address")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("city", "You must supply an event city")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("state", "You must supply an event state")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("zipCode", "You must supply an event zip code")
		.not()
		.isEmpty()
		.trim()
		.escape(),
];

exports.validateEventDeleteArray = [
	check("event", "You must supply an event").not().isEmpty().exists({
		checkNull: true,
	}),
];

exports.validateEventUpdateArray = [
	check("event.address", "You must supply an address")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("event.city", "You must supply a city").not().isEmpty().trim().escape(),

	check("event.cost", "You must supply a cost").optional().trim().escape(),

	check("event.end", "You must supply an end date").not().isEmpty().exists({
		checkNull: true,
	}),
	check("event.name", "You must supply an end date")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("event.start", "You must supply a start date").not().isEmpty().exists({
		checkNull: true,
	}),
	check("event.state", "You must supply a state")
		.not()
		.isEmpty()
		.trim()
		.escape(),
	check("event.zipCode", "You must supply a zip code")
		.trim()
		.isNumeric()
		.isLength({ min: 5, max: 5 }),
];

exports.getEvents = async (req, res) => {
	const events = await Event.findAll({
		order: [["start", "ASC"]],
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
		result: createdEvent.dataValues,
	});
};

exports.updateEvent = async (req, res) => {
	const event = await Event.findByPk(req.body.event.id);
	if (!event)
		return res.status(404).json({
			type: "error",
			action: "no event",
			result: "No event found",
		});
	delete req.body.event.id; // do not allow id to be updated
	const updatedEvent = await event.update({ ...req.body.event });
	return res.json({
		type: "success",
		action: "update event",
		result: updatedEvent.dataValues,
	});
};

exports.deleteEvent = async (req, res) => {
	const event = await Event.findByPk(req.body.event.id);
	if (!event)
		return res.status(404).json({
			type: "error",
			action: "no event",
			result: "No event found",
		});
	const deletedEvent = await event.destroy();
	return res.json({
		type: "success",
		action: "delete event",
		result: deletedEvent,
	});
};
