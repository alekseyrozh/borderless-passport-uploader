import { britishDatePassportParser } from './british-passport-date-parser';
import { defaultDateParser } from './default-date-parser';

export const getDateParser = ({ mrzCode }: { mrzCode: string }) => {
  const mrzPrefix = mrzCode.slice(0, 5);
  return CUSTOM_DATE_PARSERS[mrzPrefix] ?? defaultDateParser;
};

// use a custom date parser for British passports, determine if the passport is British by checking the MRZ prefix
const BRITISH_PASSPORT_MRZ_PREFIX: string = 'P<GBR';

const CUSTOM_DATE_PARSERS = {
  [BRITISH_PASSPORT_MRZ_PREFIX]: britishDatePassportParser,
};
