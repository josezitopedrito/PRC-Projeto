var Genres = module.exports
const axios = require('axios')

var prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX noInferences: <http://www.ontotext.com/explicit>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX c: <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#>
`

var getLink = "http://localhost:7200/repositories/PRC-Project" + "?query=" 

function normalize(response) {
    return response.results.bindings.map(obj =>
        Object.entries(obj)
            .reduce((new_obj, [k,v]) => (new_obj[k] = v.value, new_obj),
                    new Object()));
};

Genres.getLista = async function(){
    var query = ` select ?id ?name where {
        ?id rdf:type c:Genre.
        ?id c:name ?name.
    }` 
    var encoded = encodeURIComponent(prefixes + query)

    try{
        var response = await axios.get(getLink + encoded)
        return normalize(response.data)
    }
    catch(e){
        throw(e)
    } 
}

Genres.getGenre = async function(idGenre){
    var query = ` select ?name ?abs where {
        c:${idGenre} rdf:type c:Genre.
        c:${idGenre} c:name ?name.
        OPTIONAL{
            c:${idGenre} c:abstract ?abs.
        }
    }`

    var querySupraGenre = `select ?genre ?genreName where { 
        c:${idGenre} c:isSupraGenreOf ?genre.
        OPTIONAL{
            ?genre c:name ?genreName.
        }
        ?genre rdf:type c:Genre.
    } `

    var querySubGenre = `select ?genre ?genreName where { 
        c:${idGenre} c:isSubGenreOf ?genre.
        OPTIONAL{
            ?genre c:name ?genreName.
        }
        ?genre rdf:type c:Genre.
    } `

    var queryFusionGenre = `select ?genre ?genreName where { 
        c:${idGenre} c:wasFusedToCreate ?genre.
        OPTIONAL{
            ?genre c:name ?genreName.
        }
        ?genre rdf:type c:Genre.
    } `

    var queryBand = `select ?band ?bandName where { 
        ?band c:performs c:${idGenre}.
        OPTIONAL{
            ?genre c:name ?bandName.
        }
        ?band rdf:type c:Band.
    } `

    var encoded = encodeURIComponent(prefixes + query)
    var encodedSupraGenre = encodeURIComponent(prefixes + querySupraGenre)
    var encodedSubGenre = encodeURIComponent(prefixes + querySubGenre)
    var encodedFusionGenre = encodeURIComponent(prefixes + queryFusionGenre)
    var encodedBand = encodeURIComponent(prefixes + queryBand)

    try{
        var response = await axios.get(getLink + encoded)
        var responseSupraGenre = await axios.get(getLink + encodedSupraGenre)
        var responseSubGenre = await axios.get(getLink + encodedSubGenre)
        var responseFusionGenre = await axios.get(getLink + encodedFusionGenre)
        var responseBand = await axios.get(getLink + encodedBand)
        var Genre = normalize(response.data)
        var SupraGenre = normalize(responseSupraGenre.data)
        var SubGenre = normalize(responseSubGenre.data)
        var FusionGenre = normalize(responseFusionGenre.data)
        var band = normalize(responseBand.data)
        var resposta = {"Genre":Genre,"SupraGenre":SupraGenre,"SubGenre":SubGenre,"FusionGenre":FusionGenre,"Band":band}
        return resposta
    }
    catch(e){
        throw(e)
    } 
}