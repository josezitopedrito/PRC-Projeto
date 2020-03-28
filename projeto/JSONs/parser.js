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



function count (){
    var c = 0
    for(var i = 0;i<genres.length;i++){
        if(genres[i].fusion.length >0){
            c++;
        }
    }
    return c
}

//console.log(bands)
//console.log(artists)
//console.log(albuns)
console.log(genres)
