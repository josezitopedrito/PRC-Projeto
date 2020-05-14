var RecordLabels = module.exports
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

RecordLabels.getLista = async function(){
    var query = ` select ?id ?name where {
        ?id rdf:type c:RecordLabel.
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

RecordLabels.getRecordLabel = async function(idRecordLabel){
    var query = ` select ?name ?hq ?fy ?fn ?abs where {
        c:${idRecordLabel} rdf:type c:RecordLabel.
        c:${idRecordLabel} c:name ?name.
        OPTIONAL{
            c:${idRecordLabel} c:abstract ?abs.
        }
        OPTIONAL{
            c:${idRecordLabel} c:headquarters ?hq.
        }
        OPTIONAL{
            c:${idRecordLabel} c:foundingYear ?fy.
        }
        OPTIONAL{
            c:${idRecordLabel} c:founderName ?fn.
        }
    }`

    var queryAlbum = `select ?album ?albumName where { 
        ?album c:wasRecordedBy c:${idRecordLabel}.
        OPTIONAL{
            ?album c:name ?albumName.
        }
} `

    var encoded = encodeURIComponent(prefixes + query)
    var encodedAlbum = encodeURIComponent(prefixes + queryAlbum)

    try{
        var response = await axios.get(getLink + encoded)
        var responseAlbum = await axios.get(getLink + encodedAlbum)
        var RecordLabel = normalize(response.data)
        var album = normalize(responseAlbum.data)
        var resposta = {"RecordLabel":RecordLabel,"album":album}
        return resposta
    }
    catch(e){
        throw(e)
    } 
}

RecordLabels.inserir = async function(label){
    var queryGetTotal = `select ((count(?recordLabel)) as ?count) where{
        ?recordLabel a c:RecordLabel.
    }`
    var encodedGetTotal = encodeURIComponent(prefixes + queryGetTotal)
    try{
        var response = await axios.get(getLink + encodedGetTotal)
        console.log(JSON.stringify(response.data))
        var totalRecordLabel = normalize(response.data)
        console.log('Label: ' + JSON.stringify(totalRecordLabel))
        var idLabel = parseInt(totalRecordLabel[0].count,10)
        console.log('Id: ' + idLabel)
        var labelNome = label.label.labelName
        var headquarters = label.label.headquarters
        var foundingYear = label.label.foundingYear
        var founder = label.label.founder
        var abstract = label.label.labelInfo
        var albums = label.label.albums
        var queryInsertion = `INSERT DATA {
            c:recordlabel_${idLabel} rdf:type c:RecordLabel.
            c:recordlabel_${idLabel} c:name \"${labelNome}\".
            c:recordlabel_${idLabel} c:headquarters \"${headquarters}\".
            c:recordlabel_${idLabel} c:foundingYear \"${foundingYear}\".
            c:recordlabel_${idLabel} c:founderName \"${founder}\".
            c:recordlabel_${idLabel} c:abstract \"${abstract}\".
        }`
        var encodedLabel = encodeURIComponent(prefixes + queryInsertion) 
        console.log(queryInsertion)      
        try{
            await axios.post(postLink + encodedLabel, null).then(response => {
                //resolve(response.data.content)
                console.log(response.data)
              }).catch(e => {
                console.log(e)
            })
            //console.log('Response Label: ' + responseLabel)
        }catch(e){
            throw(e)
        }
        for(let i = 0; i <albums.length;i++){
            let queryAlbums = `INSERT DATA{
                c:${albums[i]} c:wasRecordedBy c:recordlabel_${idLabel}.
                c:recordlabel_${idLabel} c:recorded c:${albums[i]}.
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

RecordLabels.editar = async function(label){

}