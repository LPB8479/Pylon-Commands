export function convertIDtoUnix(snowflake: string) {
  // snowflake to date object
  const date = new Date(Math.floor(parseInt(snowflake) / 4194304) + 1420070400000);
  // date object to unix
  const unix = parseInt((new Date(date).getTime() / 1000).toFixed(0));
  return unix;
}
