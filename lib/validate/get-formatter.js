'use strict';

const { keepFields, removeFields } = require('../formatters');

module.exports = ({ fieldsToKeep, fieldsToRemove }) => {

	if(fieldsToKeep)
		return keepFields(fieldsToKeep);

	if(fieldsToRemove)
		return removeFields(fieldsToRemove);

	return items => items;
};
