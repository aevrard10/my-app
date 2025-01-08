import {describe} from '@jest/globals';
import {normalizeToNFD, TextCases} from '../index';
import {repeat, replace} from 'lodash';

// region Tests utils
// String used in main string: only special characters excluding letters with accents)
const testedSpeChars = ' ,/+()$-_°:;=%!?,#@§&*[]{}."|<>\'\\~^£€';
// Main string used in result() for tests: only spaces, numbers and letters with or without accents
const testedString = 'aB èÉÊë' + testedSpeChars;
// String used for special char replacement: any character(s)
const testedSpeCharsRepl = '-';

// Main util function used for tests
function result(
  charCase?: TextCases | undefined | null,
  rmAccents?: boolean,
  rpl?: boolean,
) {
  return normalizeToNFD(
    testedString,
    charCase,
    rmAccents,
    rpl ? testedSpeCharsRepl : undefined,
  );
}

// Expected result utils
const nfd = (s) => (s + testedSpeChars).normalize('NFD');
const nfdRpl = (s) =>
  (
    replace(s, ' ', testedSpeCharsRepl) +
    repeat(testedSpeCharsRepl, testedSpeChars.length)
  ).normalize('NFD');

// Expected results
const CASE_ACCENT = {
  unchanged: nfd('aB èÉÊë'),
  lowercase: nfd('ab èéêë'),
  uppercase: nfd('AB ÈÉÊË'),
  capitalize: nfd('Ab èéêë'),
};
const CASE = {
  unchanged: nfd('aB eEEe'),
  lowercase: nfd('ab eeee'),
  uppercase: nfd('AB EEEE'),
  capitalize: nfd('Ab eeee'),
};
const CASE_ACCENT_REPL = {
  unchanged: nfdRpl('aB èÉÊë'),
  lowercase: nfdRpl('ab èéêë'),
  uppercase: nfdRpl('AB ÈÉÊË'),
  capitalize: nfdRpl('Ab èéêë'),
};
const CASE_REPL = {
  unchanged: nfdRpl('aB eEEe'),
  lowercase: nfdRpl('ab eeee'),
  uppercase: nfdRpl('AB EEEE'),
  capitalize: nfdRpl('Ab eeee'),
};
// endregion

describe('normalizeToNFD should return normalized (NFD) string', () => {
  test('to lowercase, without accents and without replacing special characters by default', () => {
    expect(result()).toBe(CASE.lowercase);
  });

  test('with specific cases', () => {
    expect(result(null)).toBe(CASE.unchanged);
    expect(result('lowercase')).toBe(CASE.lowercase);
    expect(result('capitalize')).toBe(CASE.capitalize);
    expect(result('uppercase')).toBe(CASE.uppercase);
  });

  test('with specific cases and accents', () => {
    expect(result(null, false)).toBe(CASE_ACCENT.unchanged);
    expect(result('lowercase', false)).toBe(CASE_ACCENT.lowercase);
    expect(result('uppercase', false)).toBe(CASE_ACCENT.uppercase);
    expect(result('capitalize', false)).toBe(CASE_ACCENT.capitalize);
  });

  test('with specific cases and special characters replacement', () => {
    expect(result(null, true, true)).toBe(CASE_REPL.unchanged);
    expect(result('lowercase', true, true)).toBe(CASE_REPL.lowercase);
    expect(result('uppercase', true, true)).toBe(CASE_REPL.uppercase);
    expect(result('capitalize', true, true)).toBe(CASE_REPL.capitalize);
  });

  test('with specific cases, accents, and special characters replacement', () => {
    expect(result(null, false, true)).toBe(CASE_ACCENT_REPL.unchanged);
    expect(result('lowercase', false, true)).toBe(CASE_ACCENT_REPL.lowercase);
    expect(result('uppercase', false, true)).toBe(CASE_ACCENT_REPL.uppercase);
    expect(result('capitalize', false, true)).toBe(CASE_ACCENT_REPL.capitalize);
  });
});
