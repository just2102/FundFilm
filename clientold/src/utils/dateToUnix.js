export const dateToUnix = (dateString) => {
    let unixTimestamp;
    try {
        const date = new Date(dateString);
        unixTimestamp = date.getTime() / 1000;
        return unixTimestamp;
    } catch (error) {
        console.error(error);
    }
}
    