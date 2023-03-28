export const unixToDate = (unix) => {
  let date;
  try {
    const ms = unix * 1000;
    date = new Date(ms);
    return date.toLocaleString();
  } catch (error) {
    console.error(error);
  }
};
