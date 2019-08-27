const multer = require('multer');
const Datauri = require('datauri');
const path = require('path');

const multerOptions = {
	storage: multer.memoryStorage(),
	fileFilter(req, file, next) {
		const isPhoto = file.mimetype.startsWith('image/');
		if(isPhoto) {
			next(null, true);
		} else {
			next({ message: 'That filetype isn\'t allowed!'}, false);
		}
	} 
};

exports.multerUploads = multer(multerOptions).single('image');

const dUri = new Datauri();
/**
* @description This function converts the buffer to data url
* @param {Object} req containing the field object
* @returns {String} The data url from the string buffer
*/
exports.dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
