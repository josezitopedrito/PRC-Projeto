// Require
const fs = require('fs')


var producers = require('./Classes/producers.json')

console.log(producers)



function print(){
    let data = ""
    producers.map(pr =>{
        let string = `###  http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${pr.name.replace(/\s/g,"_").replace(/\"/g,"\\\"")}}
    <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#${pr.name.replace(/\s/g,"_").replace(/\"/g,"\\\"")}> rdf:type owl:NamedIndividual ,
    <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#Producer> ;
    `
    if(typeof pr.begindate != 'undefined')
        string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#startingYear> "${pr.begindate.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
    if(typeof pr.abstract != 'undefined')
        string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#abstract> "${pr.abstract.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
    data = data + string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#name> "${pr.name.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string .

`
    })
    return data
}

var info = print()

fs.writeFile('producer.ttl', info, (err) => { 

    if (err) throw err; 
}) 