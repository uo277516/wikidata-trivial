

const  WBK = require('wikibase-sdk');

const wdk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
})


const { SparqlEndpointFetcher } = require('fetch-sparql-endpoint');

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/wikidata_sinestudiar', async (req, res) => {
  try {
    //Consulta SPARQL
    const sparqlQuery = `
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wikibase: <http://wikiba.se/ontology#>
    PREFIX bd: <http://www.bigdata.com/rdf#>

    SELECT ?investigador ?investigadorLabel 
    WHERE 
    {
      ?investigador wdt:P106 wd:Q1650915.  
      OPTIONAL { ?investigador wdt:P69 ?lugarEstudiar. }  
      FILTER (!BOUND(?lugarEstudiar))  
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". } 
    }
    LIMIT 10
    `;
    
    console.log(sparqlQuery);

    //solicitud api
    const response = await axios.get('https://query.wikidata.org/sparql', {
      params: {
        query: sparqlQuery,
        format: 'json',
      }
    });

    //respuesta
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener datos de Wikidata:', error);
    res.status(500).json({ error: 'Error al obtener datos de Wikidata' });
  }
});


app.get('/wikidata_sinnacimiento', async (req, res) => {
  try {
    //Consulta SPARQL
    const sparqlQuery = `
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wikibase: <http://wikiba.se/ontology#>
    PREFIX bd: <http://www.bigdata.com/rdf#>

    SELECT ?investigador ?investigadorLabel 
    WHERE 
    {
      ?investigador wdt:P106 wd:Q1650915.  
      OPTIONAL { ?investigador wdt:P19 ?lugarNacimiento. }  
      FILTER (!BOUND(?lugarNacimiento)) 
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". } 
    }
    LIMIT 10
    `;

    //solicitud api
    const response = await axios.get('https://query.wikidata.org/sparql', {
      params: {
        query: sparqlQuery,
        format: 'json',
      }
    });

    //respuesta
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener datos de Wikidata:', error);
    res.status(500).json({ error: 'Error al obtener datos de Wikidata' });
  }
});

//enviar datos
app.post('/wikidata_add', async (req, res) => {
  try {
    //lo de añadir
    res.json({ message: 'Datos agregados a Wikidata correctamente' });
  } catch (error) {
    console.error('Error al agregar datos a Wikidata:', error);
    res.status(500).json({ error: 'Error al agregar datos a Wikidata' });
  }
});



//---con la api--- para seleccionar

app.get('/no_nacimiento', async (req, res) => {
  const authorQid = 'Q535';
  const sparql = `
  SELECT ?investigador ?investigadorLabel 
    WHERE 
    {
      ?investigador wdt:P106 wd:Q1650915.  
      OPTIONAL { ?investigador wdt:P19 ?lugarNacimiento. }  
      FILTER (!BOUND(?lugarNacimiento)) 
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". } 
    }
    LIMIT 10
    `;
  const url = wdk.sparqlQuery(sparql);

  const response = await axios.get(url);

  //respuesta
  res.json(response.data);

});



app.get('/no_estudio', async (req, res) => {
  const authorQid = 'Q535';
  const sparql = `
  SELECT ?investigador ?investigadorLabel 
    WHERE 
    {
      ?investigador wdt:P106 wd:Q1650915.  
      OPTIONAL { ?investigador wdt:P69 ?lugarEstudiar. }  
      FILTER (!BOUND(?lugarEstudiar))  
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". } 
    }
    LIMIT 10
    `;
  const url = wdk.sparqlQuery(sparql);

  const response = await axios.get(url);

  //respuesta
  res.json(response.data);

});




//----

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
