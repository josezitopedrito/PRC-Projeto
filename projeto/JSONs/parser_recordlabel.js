// Require
const fs = require('fs')


function normalize(response) {
    return response.results.bindings.map(obj =>
        Object.entries(obj)
            .reduce((new_obj, [k,v]) => (new_obj[k] = v.value, new_obj),
                    new Object()));
};


var recordlabels = normalize(require('./Classes/recordLabels.json'))

function print(){
    let data = ""
    recordlabels.map(rl =>{
        let string = `###  http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${rl.nome.replace(/\s/g,"_")}.
    <http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${rl.nome.replace(/\s/g,"_")}.> rdf:type owl:NamedIndividual ,
    :RecordLabel ;`
        if(typeof rl.country != 'undefined')
            string = string + `:country "${rl.country}"^^xsd:string ;
    `
        if(typeof rl.founderName != 'undefined')
            string = string + `:founderName "${rl.founderName}"^^xsd:string ;
    `
        if(typeof rl.foundingYear != 'undefined')
            string = string + `:foundingYear "${rl.foundingYear}"^^xsd:string ;
    `
        if(typeof rl.sede != 'undefined')
            string = string + `:headquarters "${rl.sede}"^^xsd:string ;
    `
        if(typeof rl.abstract != 'undefined')
            string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#abstract> "${rl.abstract}"^^xsd:string ;
    `
    data = data + string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#name> "${rl.nome}"^^xsd:string .
    
`
    })
    return data
}

var info = print()

fs.writeFile('recordlabel.ttl', info, (err) => { 

    if (err) throw err; 
}) 