const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const { sequelize } = require("./sequelize");

const routes = require("./routes/index");
const errorHandlers = require("./handlers/errorHandlers");

const { cloudinaryConfig } = require("./cloudinaryConfig.js");

// create Express app
const app = express();

// pass in host so can use in email-layout
app.locals.HOST = process.env.HOST;

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", `${process.env.FE_HOST}`);
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// allow access to assets (for email)
app.use(express.static("public"));

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in
// THIS IS FOR THE NON ACCESSIBLE COOKIE - JWT signature
const sess = {
	secret: process.env.SECRET,
	key: "user_sid",
	store: new SequelizeStore({
		db: sequelize,
		checkExpirationInterval: 60 * 60 * 1000, // 60 mins - The interval at which to cleanup expired sessions in milliseconds
		expiration: 24 * 60 * 60 * 1000 // 24hrs - The maximum age (in milliseconds) of a valid session
	}),
	proxy: false,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		httpOnly: true
		// domain: 'https://zunifortyfourth.com',
		// expires: expiryDate
	}
};

if (app.get("env") === "production") {
	sess.proxy = true;
}

app.use(session(sess));

app.use("/api/user/current/profile-image", cloudinaryConfig);
app.use("/", routes);

// After the above middleware, we can now handle our own routes

// If user requested route not handled with our routes, we 404 them and forward to error handler
// app.use(errorHandlers.notFound);

// if not a validation error then this is a really bad error we didn't expect
if (app.get("env") === "development") {
	/* Development Error Handler - Prints stack trace */
	app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// export app so we can start up in start.js
module.exports = {
	app,
	SequelizeStore,
	sess
};
