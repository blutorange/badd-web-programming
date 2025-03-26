[
  parseDate("03.12.2037"),
  parseDate("Am 03.12.2037"),
]

function parseDate(value) {
  const pattern = /^(?<day>\d{1,2})\.(?<month>\d{1,2})\.(?<year>\d{4})$/;
  const match = pattern.exec(value);
  if (!match) {
    return undefined;
  }
  return {
    day: Number.parseInt(match.groups.day),
    month: Number.parseInt(match.groups.month),
    year: Number.parseInt(match.groups.year),
  };
}
