/**
 * Immigration Programs Data Index
 * 
 * Exports all immigration program data.
 */

const canadaPrograms = require('./canada-programs');
const australiaPrograms = require('./australia-programs');
const ukPrograms = require('./uk-programs');

// Combine all programs
const allPrograms = [
  ...canadaPrograms,
  ...australiaPrograms,
  ...ukPrograms
];

module.exports = {
  canadaPrograms,
  australiaPrograms,
  ukPrograms,
  allPrograms
};
