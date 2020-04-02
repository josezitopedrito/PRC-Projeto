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
        let string = `###  http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${bn.bandName.replace(/\s/g,"_")}
    :${bn.bandName.replace(/\s/g,"_")} rdf:type owl:NamedIndividual ,
    <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#Group> ;
    `
    for(let i=0;i<bn.albuns.length;i++){
        string = string +`:created :${bn.albuns[i].replace(/\s/g,"_")} ;
    `
    }
    for(let i=0;i<bn.genres.length;i++){
        string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#performs> :${bn.genres[i].replace(/\s/g,"_")} ;
    `
    }
    if(typeof bn.bandEndDate != 'undefined'){
        string = string +`:endDate "${bn.bandEndDate}"^^xsd:string ;
    `    
    }
    if(typeof bn.bandHomepage != 'undefined'){
        string = string +`:homepage "${bn.bandHomepage}"^^xsd:string ;
    `
    }
    if(typeof bn.bandFormationPlaceName != 'undefined'){
        string = string +`:hometown "${bn.bandFormationPlaceName}"^^xsd:string ;
    `
    }
    if(typeof bn.bandStartDate != 'undefined'){
        string = string +`:startDate "${bn.bandStartDate}"^^xsd:string ;
    `
    }
    if(typeof bn.bandAbstract != 'undefined'){
        string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#abstract> "${bn.bandAbstract}"^^xsd:string ;
    `
    }
    data = data + string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#name> "${bn.bandName}"^^xsd:string .

`
    })
    return data
}

var info = print()

fs.writeFile('band.ttl', info, (err) => { 

    if (err) throw err; 
}) 