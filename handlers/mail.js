const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

const transport = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	// secure: true,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS
	}
});

const generateHtml = (filename, options = {}) => {
	return pug.renderFile(
		`${__dirname}/../views/emails/${filename}.pug`,
		options
	);
};

exports.send = async options => {
	const html = generateHtml(options.filename, options);
	const text = htmlToText.fromString(html);
	const mailOptions = {
		from: process.env.MAIL_SENDER,
		to: options.user.emailAddress,
		subject: options.subject,
		html,
		text
	};
	return transport.sendMail(mailOptions);
};
