[
  parseDate("03.12.2037"),
  parseDate("Am 03.12.2037"),
]

function parseDate(value) {
  const pattern = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
  const match = pattern.exec(value);
  if (!match) {
    return undefined;
  }
  return {
    day: Number.parseInt(match[1]),
    month: Number.parseInt(match[2]),
    year: Number.parseInt(match[3]),
  };
}
