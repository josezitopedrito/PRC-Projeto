// Require
const fs = require('fs')


var albuns = require('./Classes/albuns.json')

var albumrecord = require('./Relacionamentos/album-record.json')
var albumproducer = require('./Relacionamentos/album-produtor.json')


albuns.map(al =>{
    al.producer = []
    al.record = []
    albumrecord.map(ar =>{
        if(ar.album == al.nome){
            al.record.push(ar.label)
        }
    })
    albumproducer.map(ap =>{
        if(ap.nomeAlbum == al.nome){
            al.producer.push(ap.nomeProdutor)
        }
    })
    return al
})




function print(){
    let data = ""
    albuns.map(al =>{
        let string = `###  http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${al.nome.replace(/\s/g,"_").replace(/\"/g,"\\\"")}
    <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#${al.nome.replace(/\s/g,"_").replace("\"","\\\"")}> rdf:type owl:NamedIndividual ,
    <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#Album> ;
    `;
            for(let i=0;i<al.producer.length;i++){
                string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#wasProducedBy> <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#${al.producer[i].replace(/\s/g,"_").replace(/\"/g,"\\\"")}> ;
    `
            }       
            for(let i=0;i<al.record.length;i++){
                string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#wasRecordedBy> <http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${al.record[i].replace(/\s/g,"_").replace(/\"/g,"\\\"")}> ;
    `
            }
            if(typeof al.albumType != 'undefined' )
                string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#albumType> "${al.albumType.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
            if(typeof al.releaseDate != 'undefined')
                string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#releaseDate> "${al.releaseDate.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
            if(typeof al.runtime != 'undefined')
                string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#runtime> "${al.runtime.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
            if(typeof al.abstract != 'undefined')    
                string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#abstract> "${al.abstract.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
    data = data + string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#name> "${al.nome.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string .

`
    })    
    return data
}


var info = print()

fs.writeFile('album.ttl', info, (err) => { 

    if (err) throw err; 
}) 