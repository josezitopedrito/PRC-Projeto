// Require
const fs = require('fs')

// Classes
var alb = require('./Classes/albuns.json')
var art = require('./Classes/artistas.json')
var bnd = require('./Classes/bands.json')
var gnr = require('./Classes/genres.json')
var prd = require('./Classes/producers.json')
var rcl = require('./Classes/recordLabels.json')


// Relacionamentos
const bgr = require('./Relacionamentos/band-genre.json')
const bar = require('./Relacionamentos/band-artist.json')
const arr = require('./Relacionamentos/album-record.json')
const apr = require('./Relacionamentos/album-produtor.json')
const abr = require('./Relacionamentos/album-band.json')

const ggdr = require('./Relacionamentos/Genre-Genre/genre-genre-derived.json')
const ggfr = require('./Relacionamentos/Genre-Genre/genre-genre-fusion.json')
const ggor = require('./Relacionamentos/Genre-Genre/genre-genre-origin.json')

//---------------------------------------------------------------------------------------------------------

// Normalização dos dados

function normalize(response) {
    return response.results.bindings.map(obj =>
        Object.entries(obj)
            .reduce((new_obj, [k,v]) => (new_obj[k] = v.value, new_obj),
                    new Object()));
};

var albuns = normalize(alb)
var artists = normalize(art)
var bands = normalize(bnd)
var genres = normalize(gnr)
var producers = normalize(prd)
var recordlabels = normalize(rcl)

//Done
var albumband = normalize(abr)
var bandgenre = normalize(bgr)
var bandartist = normalize(bar)
var albumrecord = normalize(arr)
var albumproducer = normalize(apr)
//Not Done

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

artists.map(ar =>{
    ar.band = []
    bandartist.map(ba =>{
        if(ba.artistName == ar.artistName){
            ar.band.push(ba.bandName)
        }
    })
    return ar
})


function print(){
    let data = ""
    albuns.map(al =>{
        let string = `###  http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${al.nome.replace(/\s/g,"_")}
    :${al.nome.replace(/\s/g,"_")} rdf:type owl:NamedIndividual ,
    :Album ;
    `;
            for(let i=0;i<al.producer.length;i++){
                string = string + `:wasProducedBy :${al.producer[i].replace(/\s/g,"_")} ;
    `
            }       
            for(let i=0;i<al.record.length;i++){
                string = string + `:wasRecordedBy <http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${al.record[i].replace(/\s/g,"_")}> ;
    `
            }
            if(typeof al.albumType != 'undefined' )
                string = string + `:albumType "${al.albumType}"^^xsd:string ;
    `
            if(typeof al.releaseDate != 'undefined')
                string = string +`:releaseDate "${al.releaseDate}"^^xsd:string ;
    `
            if(typeof al.runtime != 'undefined')
                string = string +`:runtime "${al.runtime}"^^xsd:string ;
    `
            if(typeof al.abstract != 'undefined')    
                string = string +`<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#abstract> "${al.abstract}"^^xsd:string ;
    `
    data = data + string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#name> "${al.nome}"^^xsd:string .

`
    })
    artists.map(ar =>{
        let string =`###  http://www.semanticweb.org/prc/ontologies/2020/2/PRC_Project#${ar.artistName.replace(/\s/g,"_")}
    :${ar.artistName.replace(/\s/g,"_")} rdf:type owl:NamedIndividual ,
    <http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#Artist> ;
    `
        for(let i=0;i<ar.band.length;i++){
            string = string + `<http://www.semanticweb.org/prc/ontologies/2020/PRC_Project#memberOf> :${ar.band[i].replace(/\s/g,"_")} ;
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

fs.writeFile('result.ttl', info, (err) => { 

    if (err) throw err; 
}) 