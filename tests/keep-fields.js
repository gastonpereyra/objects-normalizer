'use strict';

const assert = require('assert');
const keepFields = require('../lib/formatters/keep-fields');

describe('Keep Fields', () => {

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

			it('Should keep all fields if selects all fields', () => {

				const formattedSample = keepFields(Object.keys(sample))(sample);
				assert.deepStrictEqual(formattedSample, sample);
			});

			it('Should keep all fields existing if selects all fields existing and more not-existings', () => {

				const formattedSample = keepFields([...Object.keys(sample), 'other'])(sample);
				assert.deepStrictEqual(formattedSample, sample);
			});

			it('Should keep only one field selected fields', () => {

				Object.keys(sample).forEach(fieldSelected => {

					const formattedSample = keepFields([fieldSelected])(sample);
					assert.deepStrictEqual(formattedSample, { [fieldSelected]: sample[fieldSelected] });
				});
			});

			it('Should keep none fields if nothing is selected', () => {

				const formattedSample = keepFields([])(sample);
				assert.deepStrictEqual(formattedSample, {});
			});
		});
	});
});
