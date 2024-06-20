/**
 * Retrieves the current date and time adjusted by subtracting 5 minutes,
 * formatted to comply with the date format required for references in Wikidata.
 * @function getDate
 * @returns {string} Formatted date string in the format `+YYYY-MM-DDT00:00:00Z`.
 */
function getDate() {
    const actualDate = new Date();

    actualDate.setMinutes(actualDate.getMinutes() - 5);

    const year = actualDate.getFullYear();
    const month = actualDate.getMonth() + 1;
    const day = actualDate.getDate();
    
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDay = day < 10 ? '0' + day : day;

    //hour, minutes and secconds must be 00:00:00. Precisions higher than 11 are not supported
    const formattedDate = `+${year}-${formattedMonth}-${formattedDay}T00:00:00Z`;

    return formattedDate;
}

module.exports = {getDate};
