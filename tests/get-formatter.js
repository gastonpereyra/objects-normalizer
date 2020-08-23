'use strict';

const assert = require('assert');
const getFormatter = require('../lib/validate/get-formatter');

describe('Get Formatters', () => {

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

	context('When Options has "fieldsToKeep" property', () => {

		samples.forEach(([message, sample]) => {

			context(`When object has ${message}`, () => {

				it('Should keep all fields if selects all fields', () => {

					const formattedSample = getFormatter({ fieldsToKeep: Object.keys(sample) })(sample);
					assert.deepStrictEqual(formattedSample, sample);
				});

				it('Should keep all fields existing if selects all fields existing and more not-existings', () => {

					const formattedSample = getFormatter({ fieldsToKeep: [...Object.keys(sample), 'other'] })(sample);
					assert.deepStrictEqual(formattedSample, sample);
				});

				it('Should keep only one field selected fields', () => {

					Object.keys(sample).forEach(fieldSelected => {

						const formattedSample = getFormatter({ fieldsToKeep: [fieldSelected] })(sample);
						assert.deepStrictEqual(formattedSample, { [fieldSelected]: sample[fieldSelected] });
					});
				});

				it('Should keep none fields if nothing is selected', () => {

					const formattedSample = getFormatter({ fieldsToKeep: [] })(sample);
					assert.deepStrictEqual(formattedSample, {});
				});
			});
		});
	});

	context('When Options has "fieldsToRemove" property', () => {

		samples.forEach(([message, sample]) => {

			context(`When object has ${message}`, () => {

				it('Should remove all fields if selects all fields', () => {

					const formattedSample = getFormatter({ fieldsToRemove: Object.keys(sample) })(sample);
					assert.deepStrictEqual(formattedSample, {});
				});

				it('Should remove all fields existing if selects all fields existing and more not-existings', () => {

					const formattedSample = getFormatter({ fieldsToRemove: [...Object.keys(sample), 'other'] })(sample);
					assert.deepStrictEqual(formattedSample, {});
				});

				it('Should remove only one field selected fields', () => {

					Object.keys(sample).forEach(fieldSelected => {

						const formattedSample = getFormatter({ fieldsToRemove: [fieldSelected] })(sample);

						const resultSample = { ...sample };
						delete resultSample[fieldSelected];

						assert.deepStrictEqual(formattedSample, resultSample);
					});
				});

				it('Should remove none fields if nothing is selected', () => {

					const formattedSample = getFormatter({ fieldsToRemove: [] })(sample);
					assert.deepStrictEqual(formattedSample, sample);
				});
			});
		});
	});

	context('When Options has invalid properties', () => {

		samples.forEach(([message, sample]) => {

			context(`When object has ${message}`, () => {

				it('Should get all fields if selects all fields', () => {

					const formattedSample = getFormatter({ invalid: Object.keys(sample) })(sample);
					assert.deepStrictEqual(formattedSample, sample);
				});

				it('Should get all fields if selects all fields existing and more not-existings', () => {

					const formattedSample = getFormatter({ invalid: [...Object.keys(sample), 'other'] })(sample);
					assert.deepStrictEqual(formattedSample, sample);
				});

				it('Should get all fields if only one field selected fields', () => {

					Object.keys(sample).forEach(fieldSelected => {

						const formattedSample = getFormatter({ invalid: [fieldSelected] })(sample);
						assert.deepStrictEqual(formattedSample, sample);
					});
				});

				it('Should get all fields if nothing is selected', () => {

					const formattedSample = getFormatter({ invalid: [] })(sample);
					assert.deepStrictEqual(formattedSample, sample);
				});
			});
		});
	});

	context('When Options has "fieldsToKeep" and "fieldsToRemove"', () => {

		samples.forEach(([message, sample]) => {

			context(`When object has ${message}`, () => {

				it('Should keep all fields if selects all fields', () => {

					const formattedSample = getFormatter({
						fieldsToKeep: Object.keys(sample),
						fieldsToRemove: Object.keys(sample)
					})(sample);
					assert.deepStrictEqual(formattedSample, sample);
				});

				it('Should keep all fields existing if selects all fields existing and more not-existings', () => {

					const formattedSample = getFormatter({
						fieldsToKeep: [...Object.keys(sample), 'other'],
						fieldsToRemove: [...Object.keys(sample), 'other']
					})(sample);
					assert.deepStrictEqual(formattedSample, sample);
				});

				it('Should keep only one field selected fields', () => {

					Object.keys(sample).forEach(fieldSelected => {

						const formattedSample = getFormatter({
							fieldsToKeep: [fieldSelected],
							fieldsToRemove: [fieldSelected]
						})(sample);
						assert.deepStrictEqual(formattedSample, { [fieldSelected]: sample[fieldSelected] });
					});
				});

				it('Should keep none fields if nothing is selected', () => {

					const formattedSample = getFormatter({
						fieldsToKeep: [],
						fieldsToRemove: []
					})(sample);
					assert.deepStrictEqual(formattedSample, {});
				});
			});
		});
	});
});
