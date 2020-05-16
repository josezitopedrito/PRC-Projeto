var Bands = module.exports
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

Bands.getLista = async function(){
    var query = ` select ?id ?name where {
        ?id rdf:type c:Group.
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

Bands.getBand = async function(idBand){
    var query = ` select ?name ?ht ?hp ?sd ?ed ?abs where {
        c:${idBand} rdf:type c:Group.
        c:${idBand} c:name ?name.
        OPTIONAL{
            c:${idBand} c:hometown ?ht.
        }
        OPTIONAL{
            c:${idBand} c:homepage ?hp.
        }
        OPTIONAL{
            c:${idBand} c:startDate ?sd.
        }
        OPTIONAL{
            c:${idBand} c:endDate ?ed.
        }
        OPTIONAL{
            c:${idBand} c:abstract ?abs.
        }
    }`

    var queryArtist = `select ?artist ?artistName where { 
        ?artist c:memberOf c:${idBand}.
        OPTIONAL{
            ?artist c:name ?artistName.
        }
        ?artist rdf:type c:Artist.
    } `

    var queryAlbum = `select ?album ?albumName where { 
        c:${idBand} c:created ?album .
        OPTIONAL{
            ?album c:name ?albumName.
        }
    } `

    var queryGenre = `select ?genre ?genreName where { 
        c:${idBand} c:performs ?genre.
        OPTIONAL{
            ?genre c:name ?genreName.
        }
        ?genre rdf:type c:Genre.
    } `

    var encoded = encodeURIComponent(prefixes + query)
    var encodedArtist = encodeURIComponent(prefixes + queryArtist)
    var encodedAlbum = encodeURIComponent(prefixes + queryAlbum)
    var encodedGenre = encodeURIComponent(prefixes + queryGenre)
    

    try{
        var response = await axios.get(getLink + encoded)
        var responseArtist = await axios.get(getLink + encodedArtist)
        var responseAlbum = await axios.get(getLink + encodedAlbum)
        var responseGenre = await axios.get(getLink + encodedGenre)
        var band = normalize(response.data)
        var artist = normalize(responseArtist.data)
        var album = normalize(responseAlbum.data)
        var genre = normalize(responseGenre.data)
        var resposta = {"band":band,"artist":artist,"album":album,"genre":genre}
        return resposta
    }
    catch(e){
        throw(e)
    } 
}

Bands.inserir = async function(band){
    var queryGetTotal = `select ((count(?bands)) as ?count) where{
        ?bands a c:Group.
    }`
    var encodedGetTotal = encodeURIComponent(prefixes + queryGetTotal)
    try{
        var response = await axios.get(getLink + encodedGetTotal)
        console.log(JSON.stringify(response.data))
        var totalBands = normalize(response.data)
        console.log('Band: ' + JSON.stringify(totalBands))
        var idBand = parseInt(totalBands[0].count,10)
        console.log('Id: ' + idBand)
        console.log(JSON.stringify(band))
        var groupNome = band.group.groupName
        var formationDate = band.group.formationDate
        var disbandingDate = band.group.disbandingDate
        var homepage = band.group.homepage
        var hometown = band.group.hometown
        var abstract = band.group.groupInfo
        var artists = band.group.members
        var albums = band.group.albums
        var genres = band.group.genres
        var queryInsertion = `INSERT DATA {
            c:group_${idBand} rdf:type c:Group.
            c:group_${idBand} c:name \"${corrigir.protect_special_char_nome(groupNome)}\".
            ${hometown == "" ? "" :`c:group_${idBand} c:hometown \"${corrigir.protect_special_char_other(hometown)}\".`}
            ${formationDate == "" ? "" :`c:group_${idBand} c:startDate \"${corrigir.protect_special_char_other(formationDate)}\".`}
            ${disbandingDate == "" ? "" :`c:group_${idBand} c:endDate \"${corrigir.protect_special_char_other(disbandingDate)}\".`}
            ${homepage == "" ? "" :`c:group_${idBand} c:homepage \"${corrigir.protect_special_char_other(homepage)}\".`}
            ${abstract == "" ? "" :`c:group_${idBand} c:abstract \"${corrigir.protect_special_char_abstract(abstract)}\".`}
        }`
        var encodedBand = encodeURIComponent(prefixes + queryInsertion) 
        console.log(queryInsertion)      
        try{
            await axios.post(postLink + encodedBand, null).then(response => {
                //resolve(response.data.content)
                console.log(response.data)
              }).catch(e => {
                console.log(e)
            })
            //console.log('Response Band: ' + responseBand)
        }catch(e){
            throw(e)
        }
        for(let i = 0; i <albums.length;i++){
            let queryAlbums = `INSERT DATA{
                c:${albums[i]} c:wasCreatedBy c:group_${idBand}.
                c:group_${idBand} c:created c:${albums[i]}.
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
        for(let i = 0; i <artists.length;i++){
            let queryArtists = `INSERT DATA{
                c:group_${idBand} c:lineupMember c:${artists[i]}.
                c:${artists[i]} c:memberOf c:group_${idBand}.
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
        for(let i = 0; i <genres.length;i++){
            let queryGenres = `INSERT DATA{
                c:group_${idBand} c:performs c:${genres[i]}.
                c:${genres[i]} c:wasPerformedBy c:group_${idBand}.
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

Bands.editar = async function(band){
    console.log("banda:" + JSON.stringify(band))
    var idBand = band.group.idGroup
    var artistsPreEdicao = band.group.membersPreEdicao
    var albumsPreEdicao = band.group.albumsPreEdicao
    var genresPreEdicao = band.group.genresPreEdicao
    console.log("primeiro break");
    for(let i = 0; i <albumsPreEdicao.length;i++){
        let queryAlbums = `DELETE DATA{
            c:${albumsPreEdicao[i]} c:wasCreatedBy c:${idBand}.
            c:${idBand} c:created c:${albumsPreEdicao[i]}.
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
    console.log("segundo break");
    console.log("predit:" + JSON.stringify(artistsPreEdicao))
    for(let i = 0; i <artistsPreEdicao.length;i++){
        let queryArtists = `DELETE DATA{
            c:${idBand} c:lineupMember c:${artistsPreEdicao[i]}.
            c:${artistsPreEdicao[i]} c:memberOf c:${idBand}.
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
    console.log("terceiro break");
    for(let i = 0; i <genresPreEdicao.length;i++){
        let queryGenres = `DELETE DATA{
            c:${idBand} c:performs c:${genresPreEdicao[i]}.
            c:${genresPreEdicao[i]} c:wasPerformedBy c:${idBand}.
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
        console.log("quarto break");
        console.log('Id: ' + idBand)
        var queryDelete = `DELETE {
            c:${idBand} c:name ?name.
            ${hometown == "" ? "" :`c:${idBand} c:hometown ?hometown.`}
            ${formationDate == "" ? "" :`c:${idBand} c:startDate ?startDate.`}
            ${disbandingDate == "" ? "" :`c:${idBand} c:endDate ?endDate.`}
            ${homepage == "" ? "" :`c:${idBand} c:homepage ?homepage.`}
            ${abstract == "" ? "" :`c:${idBand} c:abstract ?abstract.`}
        } WHERE {
            c:${idBand} c:name ?name.
            ${hometown == "" ? "" :`c:${idBand} c:hometown ?hometown.`}
            ${formationDate == "" ? "" :`c:${idBand} c:startDate ?startDate.`}
            ${disbandingDate == "" ? "" :`c:${idBand} c:endDate ?endDate.`}
            ${homepage == "" ? "" :`c:${idBand} c:homepage ?homepage.`}
            ${abstract == "" ? "" :`c:${idBand} c:abstract ?abstract.`}
        }`
        var encodedDelete = encodeURIComponent(prefixes + queryDelete) 
        console.log("quinto break");
        console.log(queryDelete)      
        try{
            await axios.post(postLink + encodedDelete, null).then(response => {
                //resolve(response.data.content)
                console.log(response.data)
              }).catch(e => {
                console.log(e)
            })
            //console.log('Response Band: ' + responseBand)
        }catch(e){
            throw(e)
        }
        var groupNome = band.group.groupName
        var formationDate = band.group.formationDate
        var disbandingDate = band.group.disbandingDate
        var homepage = band.group.homepage
        var hometown = band.group.hometown
        var abstract = band.group.groupInfo
        var artists = band.group.members
        var albums = band.group.albums
        var genres = band.group.genres
        var queryInsertion = `INSERT DATA {
            c:${idBand} c:name \"${corrigir.protect_special_char_nome(groupNome)}\".
            ${hometown == "" ? "" :`c:group_${idBand} c:hometown \"${corrigir.protect_special_char_other(hometown)}\".`}
            ${formationDate == "" ? "" :`c:group_${idBand} c:startDate \"${corrigir.protect_special_char_other(formationDate)}\".`}
            ${disbandingDate == "" ? "" :`c:group_${idBand} c:endDate \"${corrigir.protect_special_char_other(disbandingDate)}\".`}
            ${homepage == "" ? "" :`c:group_${idBand} c:homepage \"${corrigir.protect_special_char_other(homepage)}\".`}
            ${abstract == "" ? "" :`c:group_${idBand} c:abstract \"${corrigir.protect_special_char_abstract(abstract)}\".`}
        }`
        console.log("sexto break");
        var encodedBand = encodeURIComponent(prefixes + queryInsertion) 
        console.log(queryInsertion)      
        try{
            await axios.post(postLink + encodedBand, null).then(response => {
                //resolve(response.data.content)
                console.log(response.data)
              }).catch(e => {
                console.log(e)
            })
            //console.log('Response Band: ' + responseBand)
        }catch(e){
            throw(e)
        }
        for(let i = 0; i <albums.length;i++){
            let queryAlbums = `INSERT DATA{
                c:${albums[i]} c:wasCreatedBy c:${idBand}.
                c:${idBand} c:created c:${albums[i]}.
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
        for(let i = 0; i <artists.length;i++){
            let queryArtists = `INSERT DATA{
                c:${idBand} c:lineupMember c:${artists[i]}.
                c:${artists[i]} c:memberOf c:${idBand}.
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
        for(let i = 0; i <genres.length;i++){
            let queryGenres = `INSERT DATA{
                c:${idBand} c:performs c:${genres[i]}.
                c:${genres[i]} c:wasPerformedBy c:${idBand}.
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