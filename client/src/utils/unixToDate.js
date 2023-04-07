export const unixToDate = (unix) => {
  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }
  let date;
  try {
    const ms = unix * 1000;
    date = new Date(ms);
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error(error);
  }
};
