function transformJSONResearchers(originalJSON) {
    const transformedBindings = originalJSON.results.bindings.map(item => {
        const researcherValue = item.investigador.value.split('/').pop(); 
        if (!researcherValue.startsWith('Q')) return null; 
        
        return {
            investigador: researcherValue,
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


function transformJSONFootballers(originalJSON) {
    const transformedBindings = originalJSON.results.bindings.map(item => {
        const footballerValue = item.futbolista.value.split('/').pop(); 
        if (!footballerValue.startsWith('Q')) return null; 
        
        return {
            futbolista: footballerValue,
            futbolistaLabel: item.futbolistaLabel.value
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

//returns the names of the researchers
function getResearcherLabelValues(originalJSON) {
    return originalJSON.results.bindings.map(item => item.investigadorLabel.value);
}

//returns the ids of the researchers
function getResearcherIds(originalJSON) {
    return originalJSON.results.bindings
        .map(item => item.investigador.value.split('/').pop())
        .filter(value => value.startsWith('Q'));
}

module.exports = {transformJSONResearchers, transformJSONFootballers, getResearcherLabelValues, getResearcherIds};
