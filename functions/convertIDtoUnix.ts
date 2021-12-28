export function convertIDtoUnix(snowflake) {
  // snowflake to date object
  const date = new Date(Math.floor(snowflake / 4194304) + 1420070400000);
  // date object to unix
  const unix = parseInt((new Date(date).getTime() / 1000).toFixed(0));
  return unix;
}