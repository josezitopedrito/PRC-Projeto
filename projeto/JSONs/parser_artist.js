// Require
const fs = require('fs')

// Classes

var artists = require('./Classes/artistas.json')


// Relacionamentos

var bandartist = require('./Relacionamentos/banda-artista.json')
var soloartistalbum = require('./Relacionamentos/album-soloartist.json')




//---------------------------------------------------------------------------------------------------------



artists.map(ar =>{
    ar.band = []
    ar.album = []
    bandartist.map(ba =>{
        if(ba.artistName == ar.artistName){
            ar.band.push(ba.bandName)
        }
    })
    soloartistalbum.map(sa =>{
        if(sa.artistaSolo == ar.artistName){
            ar.album.push(sa.album)
        }
    })
    return ar
})


function print(){
    let data = ""
    artists.map(ar =>{
        let string =`###  http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${ar.artistName.replace(/\s/g,"_").replace(/\"/g,"\\\"")}
    <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#${ar.artistName.replace(/\s/g,"_").replace(/\"/g,"\\\"")}> rdf:type owl:NamedIndividual ,
    <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#Artist> ;
    `
        for(let i=0;i<ar.band.length;i++){
            string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#memberOf> <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#${ar.band[i].replace(/\s/g,"_").replace(/\"/g,"\\\"")}> ;
    `
        }
        for(let i=0;i<ar.album.length;i++){
            string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#created> <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#${ar.album[i].replace(/\s/g,"_").replace(/\"/g,"\\\"")}> ;
    `
        }
        if(typeof ar.artistBirthDate != 'undefined')    
            string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#:birthDate> "${ar.artistBirthDate.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
        if(typeof ar.artistBirthName != 'undefined')    
            string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#:birthName> "${ar.artistBirthName.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
        if(typeof ar.artistBirthPlaceName != 'undefined')    
            string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#:birthPlaceName> "${ar.artistBirthPlaceName.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
        if(typeof ar.artistDeathDate != 'undefined')    
                    string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#:deathDate> "${ar.artistDeathDate.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
        if(typeof ar.artistGender != 'undefined')    
            string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#gender> "${ar.artistGender.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
        if(typeof ar.artistAbstract != 'undefined')    
            string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#abstract> "${ar.artistAbstract.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string ;
    `
    data = data + string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#name> "${ar.artistName.replace(/\n/g,"\\n").replace(/\"/g,"\\\"")}"^^xsd:string .

`
    })
    return data
}



var info = print()

fs.writeFile('artist.ttl', info, (err) => { 

    if (err) throw err; 
}) 