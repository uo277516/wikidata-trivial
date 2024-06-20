/**
 * Transforms the original JSON data from Wikidata SPARQL query into a structured format for researchers.
 * @function transformJSONResearchers
 * @param {Object} originalJSON - The original JSON data from the SPARQL query.
 * @returns {Object} Transformed JSON object with researcher details.
 */
function transformJSONResearchers(originalJSON) {
    const transformedBindings = originalJSON.results.bindings.map(item => {
        const researcherValue = item.investigador.value.split('/').pop(); 
        if (!researcherValue.startsWith('Q')) return null; 
        const imagenUrl = item.imagenUrl ? item.imagenUrl.value : null; 
        
        return {
            investigador: researcherValue,
            investigadorLabel: item.investigadorLabel.value,
            imagenUrl: imagenUrl
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

/**
 * Transforms the original JSON data from Wikidata SPARQL query into a structured format for groups.
 * @function transformJSONGroups
 * @param {Object} originalJSON - The original JSON data from the SPARQL query.
 * @returns {Object} Transformed JSON object with group details.
 */
function transformJSONGroups(originalJSON) {
    const transformedBindings = originalJSON.results.bindings.map(item => {
        const grupoValue = item.grupo.value.split('/').pop(); 
        if (!grupoValue.startsWith('Q')) return null; 
        const imagenUrl = item.imagenUrl ? item.imagenUrl.value : null; 
        
        return {
            grupo: grupoValue,
            grupoLabel: item.grupoLabel.value,
            imagenUrl: imagenUrl
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

/**
 * Transforms the original JSON data from Wikidata SPARQL query into a structured format for footballers.
 * @function transformJSONFootballers
 * @param {Object} originalJSON - The original JSON data from the SPARQL query.
 * @returns {Object} Transformed JSON object with footballer details.
 */
function transformJSONFootballers(originalJSON) {

    const transformedBindings = originalJSON.results.bindings.map(item => {
        const footballerValue = item.futbolista.value.split('/').pop(); 
        if (!footballerValue.startsWith('Q')) return null; 

        const imagenUrl = item.imagenUrl ? item.imagenUrl.value : null; 

        return {
            futbolista: footballerValue,
            futbolistaLabel: item.futbolistaLabel.value,
            imagenUrl: imagenUrl
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

/**
 * Extracts and returns the researcher labels from the original JSON data.
 * @function getResearcherLabelValues
 * @param {Object} originalJSON - The original JSON data from the SPARQL query.
 * @returns {string[]} Array of researcher label values.
 */
function getResearcherLabelValues(originalJSON) {
    return originalJSON.results.bindings.map(item => item.investigadorLabel.value);
}

/**
 * Extracts and returns the researcher IDs from the original JSON data.
 * @function getResearcherIds
 * @param {Object} originalJSON - The original JSON data from the SPARQL query.
 * @returns {string[]} Array of researcher IDs.
 */
function getResearcherIds(originalJSON) {
    return originalJSON.results.bindings
        .map(item => item.investigador.value.split('/').pop())
        .filter(value => value.startsWith('Q'));
}

/**
 * Transforms the JSON data from Wikidata SPARQL query into a structured format for properties.
 * @function transformJSONProperties
 * @param {Object} jsonData - The JSON data from the SPARQL query.
 * @returns {string} JSON string representing the transformed properties data.
 */
function transformJSONProperties(jsonData) {
    const propiedades = {};
  
    jsonData.results.bindings.forEach(binding => {
      const propiedad = binding.property.value.split('/').pop(); 
      const valor = binding.hasValue.value === 'true'; 
      propiedades[propiedad] = valor; 
    });
  
    const resultado = Object.keys(propiedades).map(propiedad => ({
      [propiedad]: propiedades[propiedad]
    }));
  
    return JSON.stringify(resultado);
  }

module.exports = {transformJSONResearchers, transformJSONFootballers, transformJSONGroups, 
        getResearcherLabelValues, getResearcherIds, transformJSONProperties};
