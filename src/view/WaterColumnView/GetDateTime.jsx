function GetDateTime(nanosecondValue) {
  const tempDate = new Date(0);
  tempDate.setUTCMilliseconds(Number(nanosecondValue) / 1_000_000);
  return `${tempDate.toISOString().substring(0, 19)}Z`;
};

export { GetDateTime }