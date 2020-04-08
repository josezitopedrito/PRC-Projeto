var Artists = module.exports
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

Artists.getLista = async function(){
    var query = ` select ?id ?name where {
        ?id rdf:type c:Artist.
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

Artists.getArtist = async function(idArtist){
    var query = ` select ?name ?bn ?bd ?bpn ?dd ?g ?abs where {
        c:${idArtist} rdf:type c:Artist.
        c:${idArtist} c:name ?name.
        OPTIONAL{
            c:${idArtist} c:birthName ?bn.
        }
        OPTIONAL{
            c:${idArtist} c:birthDate ?bd.
        }
        OPTIONAL{
            c:${idArtist} c:birthPlaceName ?bpn.
        }
        OPTIONAL{
            c:${idArtist} c:deathDate ?dd.
        }
        OPTIONAL{
            c:${idArtist} c:gender ?g.
        }
        OPTIONAL{
            c:${idArtist} c:abstract ?abs.
        }
    }`

    var queryBand = `select ?band ?bandName where { 
        c:${idArtist} c:memberOf ?band.
        OPTIONAL{
            ?band c:name ?bandName.
        }
        ?band rdf:type c:Group.
    } `

    var queryAlbum = `select ?album ?albumName where { 
        c:${idArtist} c:created ?album.
        OPTIONAL{
            ?album c:name ?albumName.
        }
    } `

    var encoded = encodeURIComponent(prefixes + query)
    var encodedBand = encodeURIComponent(prefixes + queryBand)
    var encodedAlbum = encodeURIComponent(prefixes + queryAlbum)

    try{
        var response = await axios.get(getLink + encoded)
        var responseBand = await axios.get(getLink + encodedBand)
        var responseAlbum = await axios.get(getLink + encodedAlbum)
        var artist = normalize(response.data)
        var band = normalize(responseBand.data)
        var album = normalize(responseAlbum.data)
        var resposta = {"artist":artist,"band":band,"album":album}
        return resposta
    }
    catch(e){
        throw(e)
    } 
}