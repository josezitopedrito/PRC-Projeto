var Albuns = module.exports
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

Albuns.getLista = async function(){
    var query = ` select ?id ?name ?creator where {
        ?id rdf:type c:Album.
        ?id c:name ?name.
        ?creator c:created ?id
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

Albuns.inserir = async function(album){
    var queryGetTotal = `select ((count(?albuns)) as ?count) where{
        ?albuns a c:Album.
    }`
    var encodedGetTotal = encodeURIComponent(prefixes + queryGetTotal)
    try{
        var response = await axios.get(getLink + encodedGetTotal)
        console.log(JSON.stringify(response.data))
        var totalAlbuns = normalize(response.data)
        console.log('Album: ' + JSON.stringify(totalAlbuns))
        var idAlbum = parseInt(totalAlbuns[0].count,10)
        console.log('Id: ' + idAlbum)
        var albumNome = album.album.albumName
        var albumType = album.album.type
        var releaseDate = album.album.releaseDate
        var runtime = album.album.runtime
        var abstract = album.album.albumInfo
        var artists = album.album.artists
        var groups = album.album.groups
        var labels = album.album.labels
        var producers = album.album.producers
        //${abstract == "" ? "" :`c:genre_${idGenre} c:abstract \"${corrigir.protect_special_char_abstract(abstract)}\".`}
        var queryInsertion = `INSERT DATA {
            c:album_${idAlbum} rdf:type c:Album.
            c:album_${idAlbum} c:name \"${corrigir.protect_special_char_nome(albumNome)}\".
            ${albumType == "" ? "" :`c:album_${idAlbum} c:albumType \"${corrigir.protect_special_char_other(albumType)}\".`}
            ${releaseDate == "" ? "" :`c:album_${idAlbum} c:releaseDate \"${corrigir.protect_special_char_other(releaseDate)}\".`}
            ${runtime == "" ? "" :`c:album_${idAlbum} c:runtime \"${corrigir.protect_special_char_other(runtime)}\".`}
            ${abstract == "" ? "" :`c:album_${idAlbum} c:abstract \"${corrigir.protect_special_char_abstract(abstract)}\".`}
        }`
        var encodedAlbum = encodeURIComponent(prefixes + queryInsertion) 
        console.log(queryInsertion)      
        try{
            await axios.post(postLink + encodedAlbum, null).then(response => {
                //resolve(response.data.content)
                console.log(response.data)
              }).catch(e => {
                console.log(e)
            })
            //console.log('Response Album: ' + responseAlbum)
        }catch(e){
            throw(e)
        }
        for(let i = 0; i <artists.length;i++){
            let queryArtists = `INSERT DATA{
                c:album_${idAlbum} c:wasCreatedBy c:${artists[i]}.
                c:${artists[i]} c:created c:album_${idAlbum}.
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
                c:album_${idAlbum} c:wasCreatedBy c:${groups[i]}.
                c:${groups[i]} c:created c:album_${idAlbum}.
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
        for(let i = 0; i <labels.length;i++){
            let queryLabels = `INSERT DATA{
                c:album_${idAlbum} c:wasRecordedBy c:${labels[i]}.
                c:${labels[i]} c:recorded c:album_${idAlbum}.
            }`
            let encodedLabel = encodeURIComponent(prefixes + queryLabels)
            try{
                axios.post(postLink + encodedLabel,null)
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
        for(let i = 0; i <producers.length;i++){
            let queryProducers = `INSERT DATA{
                c:album_${idAlbum} c:wasCreatedBy c:${producers[i]}.
                c:${producers[i]} c:created c:album_${idAlbum}.
            }`
            let encodedProducers = encodeURIComponent(prefixes + queryProducers)
            try{
                axios.post(postLink + encodedProducers,null)
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

Albuns.editar = async function(album){
    var idAlbum = album.album.idAlbum
    var artistsPreEdicao = album.album.artistsPreEdicao
    var groupsPreEdicao = album.album.groupsPreEdicao
    var labelsPreEdicao = album.album.labelsPreEdicao
    var producersPreEdicao = album.album.producersPreEdicao
    for(let i = 0; i <artistsPreEdicao.length;i++){
        let queryDeleteArtists = `DELETE DATA{
            c:${idAlbum} c:wasCreatedBy c:${artistsPreEdicao[i]}.
            c:${artistsPreEdicao[i]} c:created c:${idAlbum}.
        }`
        let encodedArtist = encodeURIComponent(prefixes + queryDeleteArtists)
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
    for(let i = 0; i <groupsPreEdicao.length;i++){
        let queryDeleteGroups = `DELETE DATA{
            c:${idAlbum} c:wasCreatedBy c:${groupsPreEdicao[i]}.
            c:${groupsPreEdicao[i]} c:created c:${idAlbum}.
        }`
        let encodedGroup = encodeURIComponent(prefixes + queryDeleteGroups)
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
    for(let i = 0; i <labelsPreEdicao.length;i++){
        let queryDeleteLabels = `DELETE DATA{
            c:${idAlbum} c:wasRecordedBy c:${labelsPreEdicao[i]}.
            c:${labelsPreEdicao[i]} c:recorded c:${idAlbum}.
        }`
        let encodedLabel = encodeURIComponent(prefixes + queryDeleteLabels)
        try{
            axios.post(postLink + encodedLabel,null)
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
    for(let i = 0; i <producersPreEdicao.length;i++){
        let queryDeleteProducers = `DELETE DATA{
            c:${idAlbum} c:wasCreatedBy c:${producersPreEdicao[i]}.
            c:${producersPreEdicao[i]} c:created c:${idAlbum}.
        }`
        let encodedProducers = encodeURIComponent(prefixes + queryDeleteProducers)
        try{
            axios.post(postLink + encodedProducers,null)
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
        console.log('Id: ' + idAlbum)
        var queryDelete = `DELETE {
            c:${idAlbum} c:name ?name.
            ${albumType == "" ? "" :`c:${idAlbum} c:albumType ?album.`}
            ${releaseDate == "" ? "" :`c:${idAlbum} c:releaseDate ?releaseDate.`}
            ${runtime == "" ? "" :`c:${idAlbum} c:runtime ?runtine.`}
            ${abstract == "" ? "" :`c:${idAlbum} c:abstract ?abstract.`}
        } WHERE {
            c:${idAlbum} c:name ?name.
            ${albumType == "" ? "" :`c:${idAlbum} c:albumType ?album.`}
            ${releaseDate == "" ? "" :`c:${idAlbum} c:releaseDate ?releaseDate.`}
            ${runtime == "" ? "" :`c:${idAlbum} c:runtime ?runtine.`}
            ${abstract == "" ? "" :`c:${idAlbum} c:abstract ?abstract.`}
        }`
        var encodedDelete = encodeURIComponent(prefixes + queryDelete) 
        try{
            await axios.post(postLink + encodedDelete, null).then(response => {
                //resolve(response.data.content)
                console.log(response.data)
              }).catch(e => {
                console.log(e)
            })
            //console.log('Response Album: ' + responseAlbum)
        }catch(e){
            throw(e)
        }
        var albumNome = album.album.albumName
        var albumType = album.album.type
        var releaseDate = album.album.releaseDate
        var runtime = album.album.runtime
        var abstract = album.album.albumInfo
        var artists = album.album.artists
        var groups = album.album.groups
        var labels = album.album.labels
        var producers = album.album.producers
        var queryInsertion = `INSERT DATA {
            c:${idAlbum} c:name \"${corrigir.protect_special_char_nome(albumNome)}\".
            ${albumType == "" ? "" :`c:${idAlbum} c:albumType \"${corrigir.protect_special_char_other(albumType)}\".`}
            ${releaseDate == "" ? "" :`c:${idAlbum} c:releaseDate \"${corrigir.protect_special_char_other(releaseDate)}\".`}
            ${runtime == "" ? "" :`c:${idAlbum} c:runtime \"${corrigir.protect_special_char_other(runtime)}\".`}
            ${abstract == "" ? "" :`c:${idAlbum} c:abstract \"${corrigir.protect_special_char_abstract(abstract)}\".`}
        }`
        var encodedAlbum = encodeURIComponent(prefixes + queryInsertion) 
        console.log(queryInsertion)      
        try{
            await axios.post(postLink + encodedAlbum, null).then(response => {
                //resolve(response.data.content)
                console.log(response.data)
              }).catch(e => {
                console.log(e)
            })
            //console.log('Response Album: ' + responseAlbum)
        }catch(e){
            throw(e)
        }
        for(let i = 0; i <artists.length;i++){
            let queryArtists = `INSERT DATA{
                c:${idAlbum} c:wasCreatedBy c:${artists[i]}.
                c:${artists[i]} c:created c:${idAlbum}.
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
                c:${idAlbum} c:wasCreatedBy c:${groups[i]}.
                c:${groups[i]} c:created c:${idAlbum}.
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
        for(let i = 0; i <labels.length;i++){
            let queryLabels = `INSERT DATA{
                c:${idAlbum} c:wasRecordedBy c:${labels[i]}.
                c:${labels[i]} c:recorded c:${idAlbum}.
            }`
            let encodedLabel = encodeURIComponent(prefixes + queryLabels)
            try{
                axios.post(postLink + encodedLabel,null)
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
        for(let i = 0; i <producers.length;i++){
            let queryProducers = `INSERT DATA{
                c:${idAlbum} c:wasCreatedBy c:${producers[i]}.
                c:${producers[i]} c:created c:${idAlbum}.
            }`
            let encodedProducers = encodeURIComponent(prefixes + queryProducers)
            try{
                axios.post(postLink + encodedProducers,null)
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