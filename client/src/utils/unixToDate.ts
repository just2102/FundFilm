export const unixToDate = (unix: number): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  try {
    const ms = unix * 1000;
    const date = new Date(ms);

    return date.toLocaleDateString("en-US", options);
  } catch (error) {
    console.error(error);

    return "Invalid Date";
  }
};
