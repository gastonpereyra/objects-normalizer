'use strict';

const assert = require('assert');

const objectsNormalizer = require('../lib/objects-normalizer');

describe('Objects-Normalizer Function', () => {

	context('When cannot validate data', () => {

		it('Should reject if items is not an Object or Array', () => {

			assert.throws(() => objectsNormalizer(1), {
				name: 'ObjectNormalizerError',
				message: 'Invalid Items must be an Object or Array of Objects'
			});
		});

		it('Should reject if items is not an Array of Objects', () => {

			assert.throws(() => objectsNormalizer([1]), {
				name: 'ObjectNormalizerError',
				message: 'Invalid Items must be an Object or Array of Objects'
			});

			assert.throws(() => objectsNormalizer([[{}]]), {
				name: 'ObjectNormalizerError',
				message: 'Invalid Items must be an Object or Array of Objects'
			});
		});

		it('Should reject if options is not an Object', () => {

			assert.throws(() => objectsNormalizer({}, 'notValid'), {
				name: 'ObjectNormalizerError',
				message: 'Invalid Options must be an Object'
			});
		});

		it('Should reject if options is an Array', () => {

			assert.throws(() => objectsNormalizer({}, ['notValid']), {
				name: 'ObjectNormalizerError',
				message: 'Invalid Options must be an Object'
			});
		});

		const validFields = ['fieldsToKeep', 'fieldsToRemove'];

		validFields.forEach(validField => {

			it(`Should reject if options ${validField} property is not an Array`, () => {

				assert.throws(() => objectsNormalizer({}, { [validField]: 'notValid' }), {
					name: 'ObjectNormalizerError',
					message: `Invalid Options, ${validField} must be Array`
				});
			});

			it(`Should reject if options ${validField} property has not only strings`, () => {

				assert.throws(() => objectsNormalizer({}, { [validField]: ['valid', 1] }), {
					name: 'ObjectNormalizerError',
					message: `Invalid Options, ${validField} must be Array`
				});
			});
		});

		it('Should return empty array if nothing is passed', () => {
			assert.deepStrictEqual(objectsNormalizer(), []);
		});
	});

	context('When a single item is passed', () => {

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

						const formattedSample = objectsNormalizer(sample, { fieldsToKeep: Object.keys(sample) });
						assert.deepStrictEqual(formattedSample, sample);
					});

					it('Should keep all fields existing if selects all fields existing and more not-existings', () => {

						const formattedSample = objectsNormalizer(sample, { fieldsToKeep: [...Object.keys(sample), 'other'] });
						assert.deepStrictEqual(formattedSample, sample);
					});

					it('Should keep only one field selected fields', () => {

						Object.keys(sample).forEach(fieldSelected => {

							const formattedSample = objectsNormalizer(sample, { fieldsToKeep: [fieldSelected] });
							assert.deepStrictEqual(formattedSample, { [fieldSelected]: sample[fieldSelected] });
						});
					});

					it('Should keep none fields if nothing is selected', () => {

						const formattedSample = objectsNormalizer(sample, { fieldsToKeep: [] });
						assert.deepStrictEqual(formattedSample, {});
					});
				});
			});
		});

		context('When Options has "fieldsToRemove" property', () => {

			samples.forEach(([message, sample]) => {

				context(`When object has ${message}`, () => {

					it('Should remove all fields if selects all fields', () => {

						const formattedSample = objectsNormalizer(sample, { fieldsToRemove: Object.keys(sample) });
						assert.deepStrictEqual(formattedSample, {});
					});

					it('Should remove all fields existing if selects all fields existing and more not-existings', () => {

						const formattedSample = objectsNormalizer(sample, { fieldsToRemove: [...Object.keys(sample), 'other'] });
						assert.deepStrictEqual(formattedSample, {});
					});

					it('Should remove only one field selected fields', () => {

						Object.keys(sample).forEach(fieldSelected => {

							const formattedSample = objectsNormalizer(sample, { fieldsToRemove: [fieldSelected] });

							const resultSample = { ...sample };
							delete resultSample[fieldSelected];

							assert.deepStrictEqual(formattedSample, resultSample);
						});
					});

					it('Should remove none fields if nothing is selected', () => {

						const formattedSample = objectsNormalizer(sample, { fieldsToRemove: [] });
						assert.deepStrictEqual(formattedSample, sample);
					});
				});
			});
		});

		context('When option is not passed', () => {

			samples.forEach(([message, sample]) => {

				context(`When object has ${message}`, () => {

					it('Should return the same', () => {

						assert.deepStrictEqual(objectsNormalizer(sample), sample);
					});
				});
			});
		});
	});

	context('When multiple items are passed', () => {

		const samples = [
			{
				field1: '',
				field2: false,
				field3: 0,
				field4: [],
				field5: {},
				field6: null
			},
			{
				field1: 'truthy',
				field2: true,
				field3: 1,
				field4: [1, true, 'truthy'],
				field5: { truthy: true }
			}
		];

		context('When Options has "fieldsToKeep" property', () => {

			it('Should keep only one field selected fields', () => {

				const formattedSamples = objectsNormalizer(samples, { fieldsToKeep: ['field1'] });
				assert.deepStrictEqual(formattedSamples, samples.map(sample => ({ field1: sample.field1 })));
			});

			it('Should keep none fields if nothing is selected', () => {

				const formattedSamples = objectsNormalizer(samples, { fieldsToKeep: [] });
				assert.deepStrictEqual(formattedSamples, [{}, {}]);
			});
		});

		context('When Options has "fieldsToRemove" property', () => {

			it('Should remove only one field selected fields', () => {

				const formattedSamples = objectsNormalizer(samples, { fieldsToRemove: ['field1'] });

				const resultSamples = samples.map(sample => {

					const resultSample = { ...sample };
					delete resultSample.field1;

					return resultSample;
				});

				assert.deepStrictEqual(formattedSamples, resultSamples);
			});

			it('Should remove none fields if nothing is selected', () => {

				const formattedSamples = objectsNormalizer(samples, { fieldsToRemove: [] });
				assert.deepStrictEqual(formattedSamples, samples);
			});
		});

		context('When option is not passed', () => {

			it('Should return the same', () => {

				assert.deepStrictEqual(objectsNormalizer(samples), samples);
			});
		});
	});
});
