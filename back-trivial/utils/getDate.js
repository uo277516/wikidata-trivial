function getDate() {
    const fechaActual = new Date();

    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1; 
    const dia = fechaActual.getDate();

    const mesFormateado = mes < 10 ? '0' + mes : mes;
    const diaFormateado = dia < 10 ? '0' + dia : dia;

    return `${año}-${mesFormateado}-${diaFormateado}`;
}

module.exports = {getDate};
