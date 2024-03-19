function transformJSON(originalJSON) {
    const transformedBindings = originalJSON.results.bindings.map(item => {
        const investigadorValue = item.investigador.value.split('/').pop(); 
        if (!investigadorValue.startsWith('Q')) return null; 
        
        return {
            investigador: investigadorValue,
            investigadorLabel: item.investigadorLabel.value
        };
    }).filter(item => item !== null); 

    const transformedJSON = {
        head: originalJSON.head,
        results: {
            bindings: transformedBindings
        }
    };

    return transformedJSON;
}

//devuelve los nombres
function getInvestigadorLabelValues(originalJSON) {
    return originalJSON.results.bindings.map(item => item.investigadorLabel.value);
}

//devuelve los ids (Q..)
function getInvestigadorIds(originalJSON) {
    return originalJSON.results.bindings
        .map(item => item.investigador.value.split('/').pop())
        .filter(value => value.startsWith('Q'));
}

module.exports = {transformJSON, getInvestigadorLabelValues, getInvestigadorIds};
