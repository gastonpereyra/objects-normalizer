'use strict';

const isObject = require('./is-object');

const validFields = ['fieldsToKeep', 'fieldsToRemove'];

module.exports = options => {

	if(!options)
		return;

	if(!isObject(options) || Array.isArray(options))
		throw new Error('Invalid Options must be an Object');

	validFields.forEach(validField => {
		if(!Array.isArray(options[validField]) || !options[validField].every(field => typeof field === 'string'))
			throw new Error(`Invalid Options, ${validField} must be Array`);
	});
};
