import {capitalize, replace} from 'lodash';

export type TextCases = 'lowercase' | 'uppercase' | 'capitalize';

const accentsRegExp = /[\u0300-\u036f]/g;
const otherSpecialCharsRegExp = /[^a-zA-Z0-9\u0300-\u036f]/g;

export function normalizeToNFD(
  string: string,
  charCase: TextCases | undefined | null = 'lowercase',
  removeAccents = true,
  specialCharsReplacement?: string,
) {
  let normalizedString = string;

  if (charCase === 'lowercase') {
    normalizedString = normalizedString.toString().toLowerCase();
  }
  if (charCase === 'uppercase') {
    normalizedString = normalizedString.toUpperCase();
  }
  if (charCase === 'capitalize') {
    normalizedString = capitalize(normalizedString);
  }

  normalizedString = normalizedString.normalize('NFD');

  if (!removeAccents && specialCharsReplacement == null) {
    return normalizedString;
  }

  if (removeAccents) {
    normalizedString = replace(normalizedString, accentsRegExp, '');
  }

  if (typeof specialCharsReplacement === 'string') {
    normalizedString = replace(
      normalizedString,
      otherSpecialCharsRegExp,
      specialCharsReplacement,
    );
  }

  return normalizedString;
}
