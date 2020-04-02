// Require
const fs = require('fs')


function normalize(response) {
    return response.results.bindings.map(obj =>
        Object.entries(obj)
            .reduce((new_obj, [k,v]) => (new_obj[k] = v.value, new_obj),
                    new Object()));
};

var genres = normalize(require('./Classes/genres.json'))


const ggdr = require('./Relacionamentos/Genre-Genre/genre-genre-derived.json')
const ggfr = require('./Relacionamentos/Genre-Genre/genre-genre-fusion.json')
const ggor = require('./Relacionamentos/Genre-Genre/genre-genre-origin.json')




var ggderived = normalize(ggdr)
var ggfusion = normalize(ggfr)
var ggorigin = normalize(ggor)

genres.map(gr =>{
    gr.antecessor = []
    gr.fusion = []
    gr.predecessor = []
    ggorigin.map(go =>{
        if(go.genreName == gr.genreName && typeof go.originGenreName != 'undefined'){
            gr.antecessor.push(go.originGenreName)
        }
    })
    ggfusion.map(gf =>{
        if(gf.fusionGenreName == gr.genreName && typeof gf.genreName != 'undefined'){
            gr.fusion.push(gf.genreName)
        }
    })
    ggderived.map(gd =>{
        if(gd.genreName == gr.genreName && typeof gd.derivedGenreName != 'undefined'){
            gr.predecessor.push(gd.derivedGenreName)
        }
    })
    return gr
})



function print(){
    let data = ""
    genres.map(gn =>{
        let string = `###  http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${gn.genreName.replace(/\s/g,"_")}
    :B rdf:type owl:NamedIndividual ,
    <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#Genre> ;
    `
    for(let i=0;i<gn.fusion.length;i++){
        string = string +  `:wasFusedToCreate :${gn.fusion[i].replace(/\s/g,"_")} ;
    `
    }
    for(let i=0;i<gn.predecessor.length;i++){
        string = string +  `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#isSupraGenreOf> :${gn.predecessor[i].replace(/\s/g,"_")}  ;
    `
    }
    for(let i=0;i<gn.antecessor.length;i++){
        string = string +  `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#isSubGenreOf> :${gn.antecessor[i].replace(/\s/g,"_")}  ;
    `
    }
    if(typeof gn.genreAbstract != 'undefined')
        string = string +  `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#abstract> "${gn.genreAbstract}"^^xsd:string ;
    `
    data = data + string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#name> "${gn.genreName}"^^xsd:string .

`
    })
    return data
}

var info = print()

fs.writeFile('genre.ttl', info, (err) => { 

    if (err) throw err; 
}) 