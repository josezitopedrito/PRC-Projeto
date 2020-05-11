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

var getLink = "http://localhost:7200/repositories/PRC-PROJECT" + "?query=" 

var postLink = "http://localhost:7200/repositories/PRC-PROJECT/statements" + "?update=" 

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
        c:${idGenre} c:isSubGenreOf ?genre.
        OPTIONAL{
            ?genre c:name ?genreName.
        }
        ?genre rdf:type c:Genre.
    } `

    var querySubGenre = `select ?genre ?genreName where { 
        c:${idGenre} c:isSupraGenreOf ?genre.
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

    var queryArtist = `select ?artist ?artistName where { 
        ?artist c:performs c:${idGenre}.
        OPTIONAL{
            ?artist c:name ?artistName.
        }
        ?artist rdf:type c:Artist.
    } `

    var encoded = encodeURIComponent(prefixes + query)
    var encodedSupraGenre = encodeURIComponent(prefixes + querySupraGenre)
    var encodedSubGenre = encodeURIComponent(prefixes + querySubGenre)
    var encodedFusionGenre = encodeURIComponent(prefixes + queryFusionGenre)
    var encodedBand = encodeURIComponent(prefixes + queryBand)
    var encodedGenre = encodeURIComponent(prefixes + queryArtist)

    try{
        var response = await axios.get(getLink + encoded)
        var responseSupraGenre = await axios.get(getLink + encodedSupraGenre)
        var responseSubGenre = await axios.get(getLink + encodedSubGenre)
        var responseFusionGenre = await axios.get(getLink + encodedFusionGenre)
        var responseBand = await axios.get(getLink + encodedBand)
        var responseArtist = await axios.get(getLink + encodedArtist)
        var Genre = normalize(response.data)
        var SupraGenre = normalize(responseSupraGenre.data)
        var SubGenre = normalize(responseSubGenre.data)
        var FusionGenre = normalize(responseFusionGenre.data)
        var band = normalize(responseBand.data)
        var artist = normalize(responseArtist.data)
        var resposta = {"Genre":Genre,"SupraGenre":SupraGenre,"SubGenre":SubGenre,"FusionGenre":FusionGenre,"Band":band,"Artist":artist}
        return resposta
    }
    catch(e){
        throw(e)
    } 
}

Genres.inserir = async function(genre){
    var queryGetTotal = `select ((count(?genres)) as ?count) where{
        ?genres a c:Genre.
    }`
    var encodedGetTotal = encodeURIComponent(prefixes + queryGetTotal)
    try{
        var response = await axios.get(getLink + encodedGetTotal)
        console.log(JSON.stringify(response.data))
        var totalGenres = normalize(response.data)
        console.log('Genre: ' + JSON.stringify(totalGenres))
        var idGenre = parseInt(totalGenres[0].count,10)
        console.log('Id: ' + idGenre)
        var genreNome = genre.genre.genreName
        var abstract = genre.genre.genreInfo
        var artists = genre.genre.artists
        var groups = genre.genre.groups
        var supergenres = genre.genre.superGenres
        var subgenres = genre.genre.subGenres
        var fusiongenres = genre.genre.fusionGenres
        var queryInsertion = `INSERT DATA {
            c:genre_${idGenre} rdf:type c:Genre.
            c:genre_${idGenre} c:name \"${genreNome}\".
            c:genre_${idGenre} c:abstract \"${abstract}\".
        }`
        var encodedGenre = encodeURIComponent(prefixes + queryInsertion) 
        console.log(queryInsertion)      
        try{
            await axios.post(postLink + encodedGenre, null).then(response => {
                //resolve(response.data.content)
                console.log(response.data)
                console.log('pila4')
              }).catch(e => {
                console.log(e)
            })
            console.log('pila')
            //console.log('Response Genre: ' + responseGenre)
        }catch(e){
            console.log('pila2')
            throw(e)
        }
        console.log('pila3')
        for(let i = 0; i <artists.length;i++){
            let queryArtists = `INSERT DATA{
                c:${artists[i]} c:performs c:genre_${idGenre}.
                c:genre_${idGenre} c:wasPerformedBy c:${artists[i]}.
            }`
            let encodedArtist = encodeURIComponent(prefixes + queryArtists)
            try{
                axios.post(postLink + encodedArtist,null)
                .then(function(response) {
                    console.log(response.data.content)
                })
                .catch(function(response) {
                    console.log(response)
                })
            }catch(e){
                throw(e)
            }
        }
        for(let i = 0; i <groups.length;i++){
            let queryGroups = `INSERT DATA{
                c:genre_${idGenre} c:wasPerformedBy c:${groups[i]}.
                c:${groups[i]} c:performs c:genre_${idGenre}.
            }`
            let encodedGroup = encodeURIComponent(prefixes + queryGroups)
            try{
                axios.post(postLink + encodedGroup,null)
                .then(function(response) {
                    console.log(response.data.content)
                })
                .catch(function(response) {
                    console.log(response)
                })
            }catch(e){
                throw(e)
            }
        }
        for(let i = 0; i <supergenres.length;i++){
            let querySuperGenres = `INSERT DATA{
                c:genre_${idGenre} c:isSubGenreOf c:${supergenres[i]}.
                c:${supergenres[i]} c:isSupraGenreOf c:genre_${idGenre}.
            }`
            let encodedSuperGenre = encodeURIComponent(prefixes + querySuperGenres)
            try{
                axios.post(postLink + encodedSuperGenre,null)
                .then(function(response) {
                    console.log(response.data.content)
                })
                .catch(function(response) {
                    console.log(response)
                })
            }catch(e){
                throw(e)
            }
        }
        for(let i = 0; i <subgenres.length;i++){
            let querySubGenres = `INSERT DATA{
                c:genre_${idGenre} c:isSupraGenreOf c:${subgenres[i]}.
                c:${subgenres[i]} c:isSubGenreOf c:genre_${idGenre}.
            }`
            let encodedSubGenre = encodeURIComponent(prefixes + querySubGenres)
            try{
                axios.post(postLink + encodedSubGenre,null)
                .then(function(response) {
                    console.log(response.data.content)
                })
                .catch(function(response) {
                    console.log(response)
                })
            }catch(e){
                throw(e)
            }
        }
        for(let i = 0; i <fusiongenres.length;i++){
            let queryFusionGenres = `INSERT DATA{
                c:genre_${idGenre} c:wasCreatedByTheFusionOf c:${fusiongenres[i]}.
                c:${fusiongenres[i]} c:wasFusedToCreate c:genre_${idGenre}.
            }`
            let encodedFusionGenre = encodeURIComponent(prefixes + queryFusionGenres)
            try{
                axios.post(postLink + encodedFusionGenre,null)
                .then(function(response) {
                    console.log(response.data.content)
                })
                .catch(function(response) {
                    console.log(response)
                })
            }catch(e){
                throw(e)
            }
        }
    }
    catch(e){
        throw(e)
    } 
}