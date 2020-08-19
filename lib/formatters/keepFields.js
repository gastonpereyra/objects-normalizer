'use strict';

module.exports = fields => item => fields.reduce((itemFormatted, field) => ({
	...itemFormatted,
	[field]: item[field]
}), {});
