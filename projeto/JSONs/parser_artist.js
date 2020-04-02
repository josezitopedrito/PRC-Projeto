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
        let string =`###  http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${ar.artistName.replace(/\s/g,"_")}
    :${ar.artistName.replace(/\s/g,"_")} rdf:type owl:NamedIndividual ,
    <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#Artist> ;
    `
        for(let i=0;i<ar.band.length;i++){
            string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#memberOf> :${ar.band[i].replace(/\s/g,"_")} ;
    `
        }
        for(let i=0;i<ar.album.length;i++){
            string = string + `:created :${ar.album[i].replace(/\s/g,"_")} ;
    `
        }
        if(typeof ar.artistBirthDate != 'undefined')    
            string = string +`:birthDate "${ar.artistBirthDate}"^^xsd:string ;
    `
        if(typeof ar.artistBirthName != 'undefined')    
            string = string +`:birthName "${ar.artistBirthName}"^^xsd:string ;
    `
        if(typeof ar.artistBirthPlaceName != 'undefined')    
            string = string +`:birthPlaceName "${ar.artistBirthPlaceName}"^^xsd:string ;
    `
        if(typeof ar.artistDeathDate != 'undefined')    
                    string = string +`:deathDate "${ar.artistDeathDate}"^^xsd:string ;
    `
        if(typeof ar.artistGender != 'undefined')    
            string = string +`:gender "${ar.artistGender}"^^xsd:string ;
    `
        if(typeof ar.artistAbstract != 'undefined')    
            string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#abstract> "${ar.artistAbstract}"^^xsd:string ;
    `
    data = data + string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#name> "${ar.artistName}"^^xsd:string .

`
    })
    return data
}



var info = print()

fs.writeFile('artist.ttl', info, (err) => { 

    if (err) throw err; 
}) 