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
        var totalArtists = normalize(response.data)
        var idArtist = parseInt(totalArtists[0].count,10)
        var artistNome = typeof artist.artist.artistName == 'undefined' ? "" :  artist.artist.artistName
        var birthPlace = typeof artist.artist.birthPlace == 'undefined' ? "" : artist.artist.birthPlace
        var birthDate = typeof artist.artist.birthDate == 'undefined' ? "" : artist.artist.birthDate
        var deathDate = typeof artist.artist.deathDate == 'undefined' ? "" : artist.artist.deathDate
        var gender = typeof artist.artist.gender == 'undefined' ? "" : artist.artist.gender
        var abstract = typeof artist.artist.artistInfo == 'undefined' ? "" : artist.artist.artistInfo
        var albums = artist.artist.albums 
        var groups = artist.artist.groups 
        var genres = artist.artist.genres 
        var queryInsertion = `INSERT DATA {
            c:artist_${idArtist} c:name \"${corrigir.protect_special_char_nome(artistNome)}\".
            ${birthPlace == "" ? "" :`c:artist_${idArtist} c:birthPlaceName \"${corrigir.protect_special_char_other(birthPlace)}\".`}
            ${birthDate == "" ? "" :`c:artist_${idArtist} c:birthDate \"${corrigir.protect_special_char_other(birthDate)}\".`}
            ${deathDate == "" ? "" :`c:artist_${idArtist} c:deathDate \"${corrigir.protect_special_char_other(deathDate)}\".`}
            ${gender == "" ? "" :`c:artist_${idArtist} c:gender \"${corrigir.protect_special_char_other(gender)}\".`}
            ${abstract == "" ? "" :`c:artist_${idArtist} c:abstract \"${corrigir.protect_special_char_abstract(abstract)}\".`}
        }`
        var encodedArtist = encodeURIComponent(prefixes + queryInsertion)     
        try{
            await axios.post(postLink + encodedArtist, null).then(() => {
                console.log("Post do artist bem sucedido")
              }).catch(e => {
                console.log(e)
            })
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
                .then(function() {
                    console.log("Post de albums do artist bem sucedido")
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
                .then(function() {
                    console.log("Post de groups do artist bem sucedido")
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
                .then(function() {
                    console.log("Post de genres do artist bem sucedido")
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
    for(let i = 0; i <albumsPreEdicao.length;i++){
        let queryAlbums = `DELETE DATA{
            c:${albumsPreEdicao[i]} c:wasCreatedBy c:${idArtist}.
            c:${idArtist} c:created c:${albumsPreEdicao[i]}.
        }`
        let encodedAlbum = encodeURIComponent(prefixes + queryAlbums)
        try{
            axios.post(postLink + encodedAlbum,null)
            .then(function() {
                console.log("Eliminação de albums do artist bem sucedida")
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
            .then(function() {
                console.log("Eliminação de groups do artist bem sucedida")
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
            .then(function() {
                console.log("Eliminação de genres do artist bem sucedida")
            })
            .catch(function(response) {
                console.log(response)
            })
        }catch(e){
            throw(e)
        }
    }
    try{
        var queryDelete = `DELETE {
            c:${idArtist} c:name ?name.
            ${birthPlace == "" ? "" :`c:${idArtist} c:birthPlaceName ?birthplacename.`}
            ${birthDate == "" ? "" :`c:${idArtist} c:birthDate ?birthDate.`}
            ${deathDate == "" ? "" :`c:${idArtist} c:deathDate ?deathDate.`}
            ${gender == "" ? "" :`c:${idArtist} c:gender ?gender.`}
            ${abstract == "" ? "" :`c:${idArtist} c:abstract ?abstract.`}
        } WHERE {
            c:${idArtist} c:name ?name.
            ${birthPlace == "" ? "" :`c:${idArtist} c:birthPlaceName ?birthplacename.`}
            ${birthDate == "" ? "" :`c:${idArtist} c:birthDate ?birthDate.`}
            ${deathDate == "" ? "" :`c:${idArtist} c:deathDate ?deathDate.`}
            ${gender == "" ? "" :`c:${idArtist} c:gender ?gender.`}
            ${abstract == "" ? "" :`c:${idArtist} c:abstract ?abstract.`}
        }`
        var encodedDelete = encodeURIComponent(prefixes + queryDelete)       
        try{
            await axios.post(postLink + encodedDelete, null).then(() => {
                console.log("Eliminação das entradas do artist bem sucedida")
              }).catch(e => {
                console.log(e)
            })
        }catch(e){
            throw(e)
        }
        var artistNome = typeof artist.artist.artistName == 'undefined' ? "" :  artist.artist.artistName
        var birthPlace = typeof artist.artist.birthPlace == 'undefined' ? "" : artist.artist.birthPlace
        var birthDate = typeof artist.artist.birthDate == 'undefined' ? "" : artist.artist.birthDate
        var deathDate = typeof artist.artist.deathDate == 'undefined' ? "" : artist.artist.deathDate
        var gender = typeof artist.artist.gender == 'undefined' ? "" : artist.artist.gender
        var abstract = typeof artist.artist.artistInfo == 'undefined' ? "" : artist.artist.artistInfo
        var albums = artist.artist.albums 
        var groups = artist.artist.groups 
        var genres = artist.artist.genres 
        var queryInsertion = `INSERT DATA {
            c:${idArtist} c:name \"${corrigir.protect_special_char_nome(artistNome)}\".
            ${birthPlace == "" ? "" :`c:${idArtist} c:birthPlaceName \"${corrigir.protect_special_char_other(birthPlace)}\".`}
            ${birthDate == "" ? "" :`c:${idArtist} c:birthDate \"${corrigir.protect_special_char_other(birthDate)}\".`}
            ${deathDate == "" ? "" :`c:${idArtist} c:deathDate \"${corrigir.protect_special_char_other(deathDate)}\".`}
            ${gender == "" ? "" :`c:${idArtist} c:gender \"${corrigir.protect_special_char_other(gender)}\".`}
            ${abstract == "" ? "" :`c:${idArtist} c:abstract \"${corrigir.protect_special_char_abstract(abstract)}\".`}
        }`
        var encodedArtist = encodeURIComponent(prefixes + queryInsertion) 
            
        try{
            await axios.post(postLink + encodedArtist, null).then(() => {
                console.log("Substituição das entradas do artist bem sucedida")
              }).catch(e => {
                console.log(e)
            })
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
                .then(function() {
                    console.log("Substituição dos albums do artist bem sucedida")
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
                .then(function() {
                    console.log("Substituição de groups do artist bem sucedida")
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
                c:${idArtist} c:performs c:${genres[i]}.
                c:${genres[i]} c:wasPerformedBy c:${idArtist}.
            }`
            let encodedGenre = encodeURIComponent(prefixes + queryGenres)
            try{
                axios.post(postLink + encodedGenre,null)
                .then(function() {
                    console.log("Substituição dos genres do artist bem sucedida")
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