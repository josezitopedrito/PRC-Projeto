// Require
const fs = require('fs')


var producers = require('./Classes/producers.json')

console.log(producers)



function print(){
    let data = ""
    producers.map(pr =>{
        let string = `###  http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${pr.name.replace(/\s/g,"_")}
    :${pr.name.replace(/\s/g,"_")} rdf:type owl:NamedIndividual ,
    :Producer ;
    `
    if(typeof pr.begindate != 'undefined')
        string = string + `:startingYear "${pr.begindate}"^^xsd:string ;
    `
    if(typeof pr.abstract != 'undefined')
        string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#abstract> "${pr.abstract}"^^xsd:string ;
    `
    data = data + string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#name> "${pr.name}"^^xsd:string .

`
    })
    return data
}

var info = print()

fs.writeFile('producer.ttl', info, (err) => { 

    if (err) throw err; 
}) 