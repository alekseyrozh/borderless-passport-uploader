/*
 * British passports have a peculiar format for dates, example: "10 JUL /JUIL 98"
 */
export const britishDatePassportParser = (dateStr: string) => {
  const dateParts = dateStr.split(' ');
  dateParts.splice(2, 1); // remove the third list item - which is the month in French
  return new Date(dateParts.join(' '));
};
