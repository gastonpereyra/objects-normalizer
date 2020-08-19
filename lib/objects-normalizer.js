'use strict';

const isObject = require('./validate/is-object');
const validateOptions = require('./validate/validate-options');
const getFormatter = require('./validate/get-formatter');

module.exports = (items, options) => {

	if(!items)
		return [];

	if(!isObject(items))
		throw new Error('Invalid Items must be an Object or Array of Objects');

	validateOptions(options);

	const validItems = !Array.isArray(items) ? [items] : items;
	const formatter = getFormatter(options);

	const formattedItems = formatter(validItems);

	return !Array.isArray(items) ? formattedItems[0] : formattedItems;
};
