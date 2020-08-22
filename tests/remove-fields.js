'use strict';

const assert = require('assert');
const removeFields = require('../lib/formatters/remove-fields');

describe('Remove Fields', () => {

	const samples = [
		['Falsies values', {
			field1: '',
			field2: false,
			field3: 0,
			field4: [],
			field5: {},
			field6: null
		}],
		['Truthies values', {
			field1: 'truthy',
			field2: true,
			field3: 1,
			field4: [1, true, 'truthy'],
			field5: { truthy: true }
		}],
		['empty', {}]
	];


	samples.forEach(([message, sample]) => {

		context(`When object has ${message}`, () => {

			it('Should remove all fields if selects all fields', () => {

				const formattedSample = removeFields(Object.keys(sample))(sample);
				assert.deepStrictEqual(formattedSample, {});
			});

			it('Should remove all fields existing if selects all fields existing and more not-existings', () => {

				const formattedSample = removeFields([...Object.keys(sample), 'other'])(sample);
				assert.deepStrictEqual(formattedSample, {});
			});

			it('Should remove only one field selected fields', () => {

				Object.keys(sample).forEach(fieldSelected => {

					const formattedSample = removeFields([fieldSelected])(sample);

					const resultSample = { ...sample };
					delete resultSample[fieldSelected];

					assert.deepStrictEqual(formattedSample, resultSample);
				});
			});

			it('Should remove none fields if nothing is selected', () => {

				const formattedSample = removeFields([])(sample);
				assert.deepStrictEqual(formattedSample, sample);
			});
		});
	});
});
