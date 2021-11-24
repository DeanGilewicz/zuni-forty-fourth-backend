// import environmental variables from our variables.env file
const config =
	process.env.NODE_ENV === "production"
		? "variables-prod.env"
		: "variables-dev.env";
console.log("CONFIG HERE", config);
require("dotenv").config({ path: config });

// Start our app!
const { app } = require("./app");

app.set("port", process.env.PORT);

const server = app.listen(app.get("port"), () => {
	console.log(`Express running on PORT ${server.address().port}`);
});
