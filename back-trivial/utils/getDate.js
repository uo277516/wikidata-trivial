function getDate() {
    const fechaActual = new Date();

    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1; 
    const día = fechaActual.getDate();

    return `${año}-${mes < 10 ? '0' + mes : mes}-${día < 10 ? '0' + día : día}`;
}

module.exports = {getDate};