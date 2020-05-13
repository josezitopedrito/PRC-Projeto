var Producers = module.exports
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

Producers.getLista = async function(){
    var query = ` select ?id ?name where {
        ?id rdf:type c:Producer.
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

Producers.getProducer = async function(idProducer){
    var query = ` select ?name ?sy ?abs where {
        c:${idProducer} rdf:type c:Producer.
        c:${idProducer} c:name ?name.
        OPTIONAL{
            c:${idProducer} c:abstract ?abs.
        }
        OPTIONAL{
            c:${idProducer} c:startingYear ?sy.
        }
    }`

    var queryAlbum = `select ?album ?albumName where { 
        ?album c:wasProducedBy c:${idProducer}.
        OPTIONAL{
            ?album c:name ?albumName.
        }
} `

    var encoded = encodeURIComponent(prefixes + query)
    var encodedAlbum = encodeURIComponent(prefixes + queryAlbum)

    try{
        var response = await axios.get(getLink + encoded)
        var responseAlbum = await axios.get(getLink + encodedAlbum)
        var Producer = normalize(response.data)
        var album = normalize(responseAlbum.data)
        var resposta = {"Producer":Producer,"album":album}
        return resposta
    }
    catch(e){
        throw(e)
    } 
}

Producers.inserir = async function(producer){
    var queryGetTotal = `select ((count(?recordProducer)) as ?count) where{
        ?recordProducer a c:Producer.
    }`
    var encodedGetTotal = encodeURIComponent(prefixes + queryGetTotal)
    try{
        var response = await axios.get(getLink + encodedGetTotal)
        console.log(JSON.stringify(response.data))
        var totalProducer = normalize(response.data)
        console.log('Producer: ' + JSON.stringify(totalProducer))
        var idProducer = parseInt(totalProducer[0].count,10)
        console.log('Id: ' + idProducer)
        var producerNome = producer.producer.producerName
        var firstActiveYear = producer.producer.firstActiveYear
        var abstract = producer.producer.producerInfo
        var albums = producer.producer.albums
        var queryInsertion = `INSERT DATA {
            c:producer_${idProducer} rdf:type c:Producer.
            c:producer_${idProducer} c:name \"${producerNome}\".
            c:producer_${idProducer} c:startingYear \"${firstActiveYear}\".
            c:producer_${idProducer} c:abstract \"${abstract}\".
        }`
        var encodedProducer = encodeURIComponent(prefixes + queryInsertion) 
        console.log(queryInsertion)      
        try{
            await axios.post(postLink + encodedProducer, null).then(response => {
                //resolve(response.data.content)
                console.log(response.data)
              }).catch(e => {
                console.log(e)
            })
            //console.log('Response Producer: ' + responseProducer)
        }catch(e){
            throw(e)
        }
        for(let i = 0; i <albums.length;i++){
            let queryAlbums = `INSERT DATA{
                c:${albums[i]} c:wasRecordedBy c:producer_${idProducer}.
                c:producer_${idProducer} c:recorded c:${albums[i]}.
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
    }
    catch(e){
        throw(e)
    } 
}