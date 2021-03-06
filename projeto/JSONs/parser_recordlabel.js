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
        let string = `###  http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${rl.nome.replace(/\s/g,"_").replace(/\"/g,"\\\"")}.
    <http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${rl.nome.replace(/\s/g,"_").replace(/\"/g,"\\\"")}.> rdf:type owl:NamedIndividual ,
    <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#RecordLabel> ;`
        if(typeof rl.country != 'undefined')
            string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#country> "${rl.country.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
        if(typeof rl.founderName != 'undefined')
            string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#founderName> "${rl.founderName.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
        if(typeof rl.foundingYear != 'undefined')
            string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#foundingYear> "${rl.foundingYear.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
        if(typeof rl.sede != 'undefined')
            string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#headquarters> "${rl.sede.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
        if(typeof rl.abstract != 'undefined')
            string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#abstract> "${rl.abstract.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
    data = data + string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#name> "${rl.nome.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string .
    
`
    })
    return data
}

var info = print()

fs.writeFile('recordlabel.ttl', info, (err) => { 

    if (err) throw err; 
}) 