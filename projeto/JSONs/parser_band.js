// Require
const fs = require('fs')

var bands = require('./Classes/bands.json')


var albumband = require('./Relacionamentos/banda-album.json')
var bandgenre = require('./Relacionamentos/banda-genero.json')



bands.map(bd => {
    bd.albuns = []
    bd.genres = []
    albumband.map(al =>{
        if(al.bandName == bd.bandName){
            bd.albuns.push(al.albumName)
        }
    })
    bandgenre.map(bg =>{
        if(bg.bandName == bd.bandName){
            bd.genres.push(bg.genreName)
        }
    })
    return bd
})


function print(){
    let data = ""
    bands.map(bn =>{
        let string = `###  http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${bn.bandName.replace(/\s/g,"_").replace(/\"/g,"\\\"")}
    <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#${bn.bandName.replace(/\s/g,"_").replace(/\"/g,"\\\"")}> rdf:type owl:NamedIndividual ,
    <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#Group> ;
    `
    for(let i=0;i<bn.albuns.length;i++){
        string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#created> <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#${bn.albuns[i].replace(/\s/g,"_").replace(/\"/g,"\\\"")}> ;
    `
    }
    for(let i=0;i<bn.genres.length;i++){
        string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#performs> <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#${bn.genres[i].replace(/\s/g,"_").replace(/\"/g,"\\\"")}> ;
    `
    }
    if(typeof bn.bandEndDate != 'undefined'){
        string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#endDate> "${bn.bandEndDate.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `    
    }
    if(typeof bn.bandHomepage != 'undefined'){
        string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#homepage> "${bn.bandHomepage.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
    }
    if(typeof bn.bandFormationPlaceName != 'undefined'){
        string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#hometown> "${bn.bandFormationPlaceName.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
    }
    if(typeof bn.bandStartDate != 'undefined'){
        string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#:startDate> "${bn.bandStartDate.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
    }
    if(typeof bn.bandAbstract != 'undefined'){
        string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#abstract> "${bn.bandAbstract.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
    }
    data = data + string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#name> "${bn.bandName.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string .

`
    })
    return data
}

var info = print()

fs.writeFile('band.ttl', info, (err) => { 

    if (err) throw err; 
}) 