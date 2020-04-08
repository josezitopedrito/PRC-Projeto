var Albuns = module.exports
const axios = require('axios')

var prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX noInferences: <http://www.ontotext.com/explicit>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX c: <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#>
`

var getLink = "http://localhost:7200/repositories/PRC-PROJECT" + "?query=" 

function normalize(response) {
    return response.results.bindings.map(obj =>
        Object.entries(obj)
            .reduce((new_obj, [k,v]) => (new_obj[k] = v.value, new_obj),
                    new Object()));
};

Albuns.getLista = async function(){
    var query = ` select ?id ?name where {
        ?id rdf:type c:Album.
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

Albuns.getAlbum = async function(idAlbum){
    var query = ` select ?name ?at ?rd ?rt ?abs where {
        c:${idAlbum} rdf:type c:Album.
        c:${idAlbum} c:name ?name.
        OPTIONAL{
            c:${idAlbum} c:albumType ?at.
        }
        OPTIONAL{
            c:${idAlbum} c:releaseDate ?rd.
        }
        OPTIONAL{
            c:${idAlbum} c:runtime ?rt.
        }
        OPTIONAL{
            c:${idAlbum} c:abstract ?abs.
        }
    }`

    var queryBand = `select ?band ?bandName where { 
        ?band c:created c:${idAlbum}.
        OPTIONAL{
            ?band c:name ?bandName.
        }
        ?band rdf:type c:Group.
    } `

    var queryRecordLabel = `select ?rlabel ?rlabelName where { 
        c:${idAlbum} c:wasRecordedBy ?rlabel .
        OPTIONAL{
            ?rlabel c:name ?rlabelName.
        }
    } `

    var queryProducer = `select ?producer ?producerName where { 
        c:${idAlbum} c:wasProducedBy ?producer.
        OPTIONAL{
            ?producer c:name ?producerName.
        }
    } `

    var queryArtist = `select ?artist ?artistName where { 
        ?artist c:created c:${idAlbum}.
        OPTIONAL{
            ?artist c:name ?artistName.
        }
        ?artist rdf:type c:Artist.
    } `

    var encoded = encodeURIComponent(prefixes + query)
    var encodedBand = encodeURIComponent(prefixes + queryBand)
    var encodedRecordLabel = encodeURIComponent(prefixes + queryRecordLabel)
    var encodedProducer = encodeURIComponent(prefixes + queryProducer)
    var encodedArtist = encodeURIComponent(prefixes + queryArtist)
    

    try{
        var response = await axios.get(getLink + encoded)
        var responseBand = await axios.get(getLink + encodedBand)
        var responseRecordLabel = await axios.get(getLink + encodedRecordLabel)
        var responseProducer = await axios.get(getLink + encodedProducer)
        var responseArtist = await axios.get(getLink + encodedArtist)
        var album = normalize(response.data)
        var band = normalize(responseBand.data)
        var recordLabel = normalize(responseRecordLabel.data)
        var producer = normalize(responseProducer.data)
        var artist = normalize(responseArtist.data)
        var resposta = {"album":album,"band":band,"recordLabel":recordLabel,"producer":producer,"artist":artist}
        return resposta
    }
    catch(e){
        throw(e)
    } 
}