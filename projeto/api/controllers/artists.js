var Artists = module.exports
var corrigir = require('./corrigir.js')
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

    var queryGenre = `select ?genre ?genreName where { 
        c:${idArtist} c:performs ?genre.
        OPTIONAL{
            ?genre c:name ?genreName.
        }
        ?genre rdf:type c:Genre.
    } `

    var encoded = encodeURIComponent(prefixes + query)
    var encodedBand = encodeURIComponent(prefixes + queryBand)
    var encodedAlbum = encodeURIComponent(prefixes + queryAlbum)
    var encodedGenre = encodeURIComponent(prefixes + queryGenre)

    try{
        var response = await axios.get(getLink + encoded)
        var responseBand = await axios.get(getLink + encodedBand)
        var responseAlbum = await axios.get(getLink + encodedAlbum)
        var responseGenre = await axios.get(getLink + encodedGenre)
        var artist = normalize(response.data)
        var band = normalize(responseBand.data)
        var album = normalize(responseAlbum.data)
        var genre = normalize(responseGenre.data)
        var resposta = {"artist":artist,"band":band,"album":album,"genre":genre}
        return resposta
    }
    catch(e){
        throw(e)
    } 
}

Artists.inserir = async function(artist){
    var queryGetTotal = `select ((count(?artists)) as ?count) where{
        ?artists a c:Artist.
    }`
    var encodedGetTotal = encodeURIComponent(prefixes + queryGetTotal)
    try{
        var response = await axios.get(getLink + encodedGetTotal)
        console.log(JSON.stringify(response.data))
        var totalArtists = normalize(response.data)
        console.log('Artist: ' + JSON.stringify(totalArtists))
        var idArtist = parseInt(totalArtists[0].count,10)
        console.log('Id: ' + idArtist)
        var artistNome = artist.artist.artistName
        var birthPlace = artist.artist.birthPlace
        var birthDate = artist.artist.birthDate
        var deathDate = artist.artist.deathDate
        var gender = artist.artist.gender
        var abstract = artist.artist.artistInfo
        var albums = artist.artist.albums
        var groups = artist.artist.groups
        var genres = artist.artist.genres
        var queryInsertion = `INSERT DATA {
            c:artist_${idArtist} rdf:type c:Artist.
            c:artist_${idArtist} c:name \"${corrigir.protect_special_char_nome(artistNome)}\".
            c:artist_${idArtist} c:birthPlaceName \"${corrigir.protect_special_char_other(birthPlace)}\".
            c:artist_${idArtist} c:birthDate \"${corrigir.protect_special_char_other(birthDate)}\".
            c:artist_${idArtist} c:deathDate \"${corrigir.protect_special_char_other(deathDate)}\".
            c:artist_${idArtist} c:gender \"${corrigir.protect_special_char_other(gender)}\".
            c:artist_${idArtist} c:abstract \"${corrigir.protect_special_char_abstract(abstract)}\".
        }`
        var encodedArtist = encodeURIComponent(prefixes + queryInsertion) 
        console.log(queryInsertion)      
        try{
            await axios.post(postLink + encodedArtist, null).then(response => {
                //resolve(response.data.content)
                console.log(response.data)
              }).catch(e => {
                console.log(e)
            })
            //console.log('Response Artist: ' + responseArtist)
        }catch(e){
            throw(e)
        }
        for(let i = 0; i <albums.length;i++){
            let queryAlbums = `INSERT DATA{
                c:${albums[i]} c:wasCreatedBy c:artist_${idArtist}.
                c:artist_${idArtist} c:created c:${albums[i]}.
            }`
            let encodedAlbum = encodeURIComponent(prefixes + queryAlbums)
            try{
                axios.post(postLink + encodedAlbum,null)
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
                c:artist_${idArtist} c:memberOf c:${groups[i]}.
                c:${groups[i]} c:lineupMember c:artist_${idArtist}.
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
        for(let i = 0; i <genres.length;i++){
            let queryGenres = `INSERT DATA{
                c:artist_${idArtist} c:performs c:${genres[i]}.
                c:${genres[i]} c:wasPerformedBy c:artist_${idArtist}.
            }`
            let encodedGenre = encodeURIComponent(prefixes + queryGenres)
            try{
                axios.post(postLink + encodedGenre,null)
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

Artists.editar = async function(artist){
    var idArtist = artist.artist.idArtist
    var groupsPreEdicao = artist.artist.groupsPreEdicao
    var albumsPreEdicao = artist.artist.albumsPreEdicao
    var genresPreEdicao = artist.artist.genresPreEdicao
    console.log(artist.artist)
    for(let i = 0; i <albumsPreEdicao.length;i++){
        let queryAlbums = `DELETE DATA{
            c:${albumsPreEdicao[i]} c:wasCreatedBy c:${idArtist}.
            c:${idArtist} c:created c:${albumsPreEdicao[i]}.
        }`
        let encodedAlbum = encodeURIComponent(prefixes + queryAlbums)
        try{
            axios.post(postLink + encodedAlbum,null)
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
    for(let i = 0; i <groupsPreEdicao.length;i++){
        let queryGroups = `DELETE DATA{
            c:${idArtist} c:memberOf c:${groupsPreEdicao[i]}.
            c:${groupsPreEdicao[i]} c:lineupMember c:${idArtist}.
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
    for(let i = 0; i <genresPreEdicao.length;i++){
        let queryGenres = `DELETE DATA{
            c:${idArtist} c:performs c:${genresPreEdicao[i]}.
            c:${genresPreEdicao[i]} c:wasPerformedBy c:${idArtist}.
        }`
        let encodedGenre = encodeURIComponent(prefixes + queryGenres)
        try{
            axios.post(postLink + encodedGenre,null)
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
    try{
        console.log('Id: ' + idArtist)
        var queryDelete = `DELETE {
            c:${idArtist} c:name ?name.
            c:${idArtist} c:birthPlaceName ?birthplacename.
            c:${idArtist} c:birthDate ?birthDate.
            c:${idArtist} c:deathDate ?deathDate.
            c:${idArtist} c:gender ?gender.
            c:${idArtist} c:abstract ?abstract.
        } WHERE {
            c:${idArtist} c:name ?name.
            c:${idArtist} c:birthPlaceName ?birthplacename.
            c:${idArtist} c:birthDate ?birthDate.
            c:${idArtist} c:deathDate ?deathDate.
            c:${idArtist} c:gender ?gender.
            c:${idArtist} c:abstract ?abstract.
        }`
        var encodedDelete = encodeURIComponent(prefixes + queryDelete) 
        console.log(queryDelete)      
        try{
            await axios.post(postLink + encodedDelete, null).then(response => {
                //resolve(response.data.content)
                console.log(response.data)
              }).catch(e => {
                console.log(e)
            })
            //console.log('Response Artist: ' + responseArtist)
        }catch(e){
            throw(e)
        }
        var artistNome = artist.artist.artistName
        var birthPlace = artist.artist.birthPlace
        var birthDate = artist.artist.birthDate
        var deathDate = artist.artist.deathDate
        var gender = artist.artist.gender
        var abstract = artist.artist.artistInfo
        var albums = artist.artist.albums
        var groups = artist.artist.groups
        var genres = artist.artist.genres
        console.log("Generos da piça:" + genres)
        var queryInsertion = `INSERT DATA {
            c:${idArtist} c:name \"${corrigir.protect_special_char_nome(artistNome)}\".
            c:${idArtist} c:birthPlaceName \"${corrigir.protect_special_char_other(birthPlace)}\".
            c:${idArtist} c:birthDate \"${corrigir.protect_special_char_other(birthDate)}\".
            c:${idArtist} c:deathDate \"${corrigir.protect_special_char_other(deathDate)}\".
            c:${idArtist} c:gender \"${corrigir.protect_special_char_other(gender)}\".
            c:${idArtist} c:abstract \"${corrigir.protect_special_char_abstract(abstract)}\".
        }`
        var encodedArtist = encodeURIComponent(prefixes + queryInsertion) 
        console.log(queryInsertion)      
        try{
            await axios.post(postLink + encodedArtist, null).then(response => {
                //resolve(response.data.content)
                console.log(response.data)
              }).catch(e => {
                console.log(e)
            })
            //console.log('Response Artist: ' + responseArtist)
        }catch(e){
            throw(e)
        }
        for(let i = 0; i <albums.length;i++){
            let queryAlbums = `INSERT DATA{
                c:${albums[i]} c:wasCreatedBy c:${idArtist}.
                c:${idArtist} c:created c:${albums[i]}.
            }`
            let encodedAlbum = encodeURIComponent(prefixes + queryAlbums)
            try{
                axios.post(postLink + encodedAlbum,null)
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
                c:${idArtist} c:memberOf c:${groups[i]}.
                c:${groups[i]} c:lineupMember c:${idArtist}.
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
        console.log("Generos da piça:" + genres)
        for(let i = 0; i <genres.length;i++){
            let queryGenres = `INSERT DATA{
                c:${idArtist} c:performs c:${genres[i]}.
                c:${genres[i]} c:wasPerformedBy c:${idArtist}.
            }`
            let encodedGenre = encodeURIComponent(prefixes + queryGenres)
            try{
                axios.post(postLink + encodedGenre,null)
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