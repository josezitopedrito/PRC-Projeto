<template>
    <div>
        <navDraw></navDraw>
        <v-sheet
            class="mx-auto"
            elevation="8"
            max-width="800"
        >   
            <div class="import">
                <v-progress-linear
                :size="100"
                :value="value"
                :height="30"
                color="primary"
                >
                    {{value}}%
                </v-progress-linear>
            </div>

            <v-slide-group
            class="pa-4"
            show-arrows
            >
            <v-slide-item
                v-for="n in typeArray"
                :key="n"
                v-slot:default="{ active, toggle }"
            >
                <v-card
                :color="active ? 'primary' : 'grey lighten-1'"
                class="ma-4"
                height="100"
                width="100"
                @click="confirmacao(n); toggle"
                >
                <v-card-text>
                    <label>{{n}}</label>
                </v-card-text>
                <v-row
                    class="fill-height"
                    align="center"
                    justify="center"
                >
                    <v-scale-transition>
                    <v-icon
                        v-if="active"
                        color="white"
                        size="48"
                        v-text="'mdi-close-circle-outline'"
                    ></v-icon>
                    </v-scale-transition>
                </v-row>
                </v-card>
            </v-slide-item>
            </v-slide-group>

            <v-expand-transition v-show="expand">
                <v-card>
                    <v-window v-if="type == 'Album'" v-model="model">
                        <v-window-item
                            v-for="m in 5" :key="m"
                        >
                            <h1>Album Insertion</h1><!-- :folio="info" :cancelado="cancelado" @atualizaFolio=atualizaFolio($event) -->
                            <passoAlbum v-if="m == 1 && renderComponent" :obj="album" :position="first" @atualizaAlbum=atualizaAlbum($event)></passoAlbum>                           
                            <passoArtist v-if="m == 2 && renderComponent" :obj="album" :position="albumArtist" @atualizaAlbum=atualizaAlbum($event)></passoArtist>
                            <passoGroup v-else-if="m == 3 && renderComponent" :obj="album" :position="albumGroup" @atualizaAlbum=atualizaAlbum($event)></passoGroup>
                            <passoLabel v-if="m == 4 && renderComponent" :obj="album" :position="albumLabel" @atualizaAlbum=atualizaAlbum($event)></passoLabel>
                            <passoProducer v-if="m == 5 && renderComponent" :obj="album" :position="albumProducer" @atualizaAlbum=atualizaAlbum($event)></passoProducer>
                            
                            <!--<v-card-actions v-if="m!=1 && m!=6" class="justify-space-between">
                                <v-btn
                                    text
                                    @click="prev"
                                >
                                    <v-icon>mdi-chevron-left</v-icon>
                                </v-btn>
                                <v-btn
                                    text
                                    @click="next"
                                >
                                    <v-icon>mdi-chevron-right</v-icon>
                                </v-btn>
                            </v-card-actions>-->
                        </v-window-item>
                    </v-window>
                    <v-window v-if="type == 'Artist'" v-model="model">
                        <v-window-item                            
                            v-for="m in 4" :key="m"
                        >
                            <h1>Artist Insertion</h1>
                            <!-- :folio="info" @cancela=cancela() -->
                            <passoArtist v-if="m == 1 && renderComponent" :obj="artist" :position="first" @atualizaArtist=atualizaArtist($event)></passoArtist>
                            <passoAlbum v-if="m == 2 && renderComponent" :obj="artist" :position="albumArtist" @atualizaArtist=atualizaArtist($event)></passoAlbum>
                            <passoGroup v-if="m == 3 && renderComponent" :obj="artist" :position="groupArtist" @atualizaArtist=atualizaArtist($event)></passoGroup>
                            <passoGenre v-if="m == 4 && renderComponent" :obj="artist" :position="genreArtist" @atualizaArtist=atualizaArtist($event)></passoGenre>
                        </v-window-item>
                    </v-window>
                    <v-window v-if="type == 'Group'" v-model="model">
                        <v-window-item
                            v-for="m in 4" :key="m"
                        >
                            <h1>Group Insertion</h1>
                            <!-- :folio="info" @cancela=cancela() -->
                            <passoGroup v-if="m == 1 && renderComponent" :obj="group" :position="first" @atualizaGroup=atualizaGroup($event)></passoGroup>
                            <passoAlbum v-if="m == 2 && renderComponent" :obj="group" :position="albumGroup" @atualizaGroup=atualizaGroup($event)></passoAlbum>
                            <passoArtist v-if="m == 3 && renderComponent" :obj="group" :position="groupArtist" @atualizaGroup=atualizaGroup($event)></passoArtist>
                            <passoGenre v-if="m == 4 && renderComponent" :obj="group" :position="groupGenre" @atualizaGroup=atualizaGroup($event)></passoGenre>
                        </v-window-item>
                    </v-window>
                    <v-window v-if="type == 'Label'" v-model="model">
                        <v-window-item
                            v-for="m in 2" :key="m"
                        >
                            <h1>Label Insertion</h1>
                            <!-- :folio="info" @cancela=cancela() -->
                            <passoLabel v-if="m == 1 && renderComponent" :obj="label" :position="first" @atualizaLabel=atualizaLabel($event)></passoLabel>
                            <passoAlbum v-if="m == 2 && renderComponent" :obj="label" :position="albumLabel" @atualizaLabel=atualizaLabel($event)></passoAlbum>
                        </v-window-item>
                    </v-window>
                    <v-window v-if="type == 'Producer'" v-model="model">
                        <v-window-item
                            v-for="m in 2" :key="m"
                        >
                            <h1>Producer Insertion</h1>
                            <!-- :folio="info" :fileInfo="passoProducerinfo" @submeterFolio=submeterFolio() @cancela=cancela() -->
                            <passoProducer v-if="m == 1 && renderComponent" :obj="producer" :position="first" @atualizaProducer=atualizaProducer($event)></passoProducer>
                            <passoAlbum v-if="m == 2 && renderComponent" :obj="producer" :position="albumProducer" @atualizaProducer=atualizaProducer($event)></passoAlbum>
                        </v-window-item>
                    </v-window>
                    <v-window v-if="type == 'Genre'" v-model="model">
                        <v-window-item
                            v-for="m in 6" :key="m"
                        >
                            <h1>Genre Insertion</h1>
                            <!-- :folio="info" @cancela=cancela() -->
                            <passoGenre v-if="m == 1 && renderComponent" :obj="genre" :position="first" @atualizaGenre=atualizaGenre($event)></passoGenre>
                            <passoArtist v-if="m == 2 && renderComponent" :obj="genre" :position="genreArtist" @atualizaGenre=atualizaGenre($event)></passoArtist>
                            <passoGroup v-if="m == 3 && renderComponent" :obj="genre" :position="groupGenre" @atualizaGenre=atualizaGenre($event)></passoGroup>
                            <passoGenre v-if="m == 4 && renderComponent" :obj="genre" :position="supergenreGenre" @atualizaGenre=atualizaGenre($event)></passoGenre>                           
                            <passoGenre v-if="m == 5 && renderComponent" :obj="genre" :position="subgenreGenre" @atualizaGenre=atualizaGenre($event)></passoGenre>
                            <passoGenre v-if="m == 6 && renderComponent" :obj="genre" :position="fusiongenreGenre" @atualizaGenre=atualizaGenre($event)></passoGenre>
                        </v-window-item>
                    </v-window>
                    
                </v-card>
            </v-expand-transition>
        </v-sheet>
    </div>
</template>

<script>
    import NavDraw from '../components/navDraw.vue'
    import passoAlbum from '../components/passoAlbum.vue'
    import passoArtist from '../components/passoArtist.vue'
    import passoGroup from '../components/passoGroup.vue'
    import passoGenre from '../components/passoGenre.vue'
    import passoLabel from '../components/passoLabel.vue'
    import passoProducer from '../components/passoProducer.vue'
    import axios from 'axios'
    export default {
        data: () => ({
            value: null,
            model: null,
            expand:false,
            total:0,
            first:'first',
            albumArtist:'albumArtist',
            albumGroup:'albumGroup',
            albumLabel:'albumLabel',
            albumProducer:'albumProducer',
            groupArtist:'groupArtist',
            genreArtist:'genreArtist',
            groupGenre:'groupGenre',
            supergenreGenre:'supergenreGenre',
            subgenreGenre:'subgenreGenre',
            fusiongenreGenre:'fusiongenreGenre',
            typeArray:['Album','Artist','Group','Genre','Label','Producer'],
            type:"",
            ajuda:'imports',
            lhost:'http://localhost:5001/api',
            group:{
                groupName:"",
                formationDate:"",
                disbandingDate:"",
                homepage:"",
                hometown:"",
                groupInfo:"",
                albums:[],
                members:[],
                genres:[],
                foto:{}
            },
            album:{
                albumName:"",
                type:"",
                releaseDate:"",
                runtime:"",
                albumInfo:"",
                artists:[],
                groups:[],
                labels:[],
                producers:[],
                foto:{}
            },
            artist:{
                artistName:"",
                birthPlace:"",
                birthDate:"",
                deathDate:"",
                gender:"",
                artistInfo:"",
                albums:[],
                groups:[],
                genres:[],
                foto:{}
            },
            genre:{
                genreName:"",
                artists:[],
                groups:[],
                superGenres:[],
                subGenres:[],
                fusionGenres:[],
                genreInfo:""
            },
            label:{
                labelName:"",
                headquarters:"",
                foundingYear:"",
                founder:"",
                albums:[],
                labelInfo:""
            },
            producer:{
                producerName:"",
                firstActiveYear:"",
                albums:[],
                producerInfo:""
            },
            renderComponent: true
        }),
        components:{
            'navDraw':NavDraw,
            'passoAlbum':passoAlbum,
            'passoArtist':passoArtist,
            'passoGroup':passoGroup,
            'passoGenre':passoGenre,
            'passoLabel':passoLabel,
            'passoProducer':passoProducer
        },
        methods:{
            prev(){
                this.model -= 1
            },
            next(){
                this.model += 1
            },
            confirmacao(novaInsercao){
                if(this.type !=""){
                    confirm('Tem a certeza que deseja inserir outro elemento? O progresso desta inserção será perdido.') && ((this.type = novaInsercao) && this.cancela() && this.definirTotais() && (this.expand = !this.expand))
                    //this.model = 0
                }else{
                    this.expand = !this.expand
                    this.type = novaInsercao
                    this.definirTotais()
                }
            },
            definirTotais(){
                if(this.type == 'Album'){
                    this.total = 5
                }
                else if(this.type == 'Genre'){
                    this.total = 6
                }
                else if(this.type == 'Artist' || this.type == 'Group'){
                    this.total = 4
                }
                else if(this.type == 'Label' || this.type == 'Producer'){
                    this.total = 2
                }
            },
            cancela(){
                this.group.groupName = "",
                this.group.formationDate = "",
                this.group.disbandingDate = "",
                this.group.homepage = "",
                this.group.hometown = "",
                this.group.groupInfo = "",
                this.group.albums = [],
                this.group.members = [],
                this.group.genres = [],
                this.group.foto = {},

                this.album.albumName = "",
                this.album.type = "",
                this.album.releaseDate = "",
                this.album.runtime = "",
                this.album.albumInfo = "",
                this.album.artists = [],
                this.album.groups = [],
                this.album.labels = [],
                this.album.producers = [],
                this.album.foto = {}

                this.artist.artistName = "",
                this.artist.birthPlace = "",
                this.artist.birthDate = "",
                this.artist.deathDate = "",
                this.artist.gender = "",
                this.artist.artistInfo = "",
                this.artist.albums = [],
                this.artist.groups = [],
                this.artist.genres = [],
                this.artist.foto = {}

                this.genre.genreName = "",
                this.genre.artists = [],
                this.genre.groups = [],
                this.genre.superGenres = [],
                this.genre.subGenres = [],
                this.genre.fusionGenres = [],
                this.genre.genreInfo = ""

                this.label.labelName = "",
                this.label.headquarters = "",
                this.label.foundingYear = "",
                this.label.founder = "",
                this.label.albums = [],
                this.label.labelInfo = ""

                this.producer.producerName = "",
                this.producer.firstActiveYear = "",
                this.producer.albums = [],
                this.producer.producerInfo = ""

                this.model = 0;
            },
            atualizaAlbum: async function(album){
                this.album.albumName=album.albumName
                this.album.type=album.type
                this.album.releaseDate=album.releaseDate
                this.album.runtime=album.runtime
                this.album.albumInfo=album.albumInfo
                this.album.foto=album.foto
                this.album.labels=album.albumLabel
                this.album.groups=album.albumGroup
                this.album.artists=album.albumArtist
                this.album.producers=album.albumProducer
                if(this.total == this.model + 1){
                    confirm('Are you sure you want to save this album?') && (await axios.post(this.lhost + '/albums/inserir',{
                        album:this.album
                    }) && this.cancela())
                }else{
                    this.next()
                }
            },
            atualizaArtist: async function(artist){
                this.artist.artistName=artist.artistName
                this.artist.gender=artist.gender
                this.artist.birthPlace=artist.birthPlace
                this.artist.birthDate=artist.birthDate
                this.artist.deathDate=artist.deathDate
                this.artist.artistInfo=artist.artistInfo
                this.artist.foto=artist.foto
                this.artist.albums=artist.albumArtist
                this.artist.groups=artist.groupArtist
                this.artist.genres=artist.genreArtist
                if(this.total == this.model + 1){
                    confirm('Are you sure you want to save this artist?') && (await axios.post(this.lhost + '/artists/inserir',{
                        artist:this.artist
                    }) && this.cancela())
                }else{
                    this.next()
                }
            },
            atualizaGroup: async function(group){
                this.group.groupName=group.groupName
                this.group.formationDate=group.formationDate
                this.group.disbandingDate=group.disbandingDate
                this.group.homepage=group.homepage
                this.group.hometown=group.hometown
                this.group.groupInfo=group.groupInfo
                this.group.foto=group.foto
                this.group.members=group.groupArtist
                this.group.genres=group.groupGenre
                this.group.albums=group.albumGroup
                if(this.total == this.model + 1){
                    confirm('Are you sure you want to save this group?') && (await axios.post(this.lhost + '/groups/inserir',{
                        group:this.group
                    }) && this.cancela())
                }else{
                    this.next()
                }
            },
            atualizaGenre: async function(genre){
                this.genre.genreName=genre.genreName
                this.genre.genreInfo=genre.genreInfo
                this.genre.groups=genre.groupGenre
                this.genre.artists=genre.genreArtist
                this.genre.superGenres=genre.supergenreGenre
                this.genre.subGenres=genre.subgenreGenre
                this.genre.fusionGenres=genre.fusiongenreGenre
                if(this.total == this.model + 1){
                    confirm('Are you sure you want to save this genre?') && (await axios.post(this.lhost + '/genres/inserir',{
                        genre:this.genre
                    }) && this.cancela())
                }else{
                    this.next()
                }
            },
            atualizaLabel: async function(label){
                this.label.labelName=label.labelName
                this.label.headquarters = label.headquarters
                this.label.foundingYear=label.foundingYear
                this.label.founder=label.founder
                this.label.labelInfo=label.labelInfo
                this.label.albums=label.albumLabel
                if(this.total == this.model + 1){
                    confirm('Are you sure you want to save this label?') && (await axios.post(this.lhost + '/recordLabels/inserir',{
                        label:this.label
                    }) && this.cancela())
                }else{
                    this.next()
                }
            },
            atualizaProducer: async function(producer){
                this.producer.producerName=producer.producerName
                this.producer.firstActiveYear=producer.firstActiveYear
                this.producer.producerInfo=producer.producerInfo
                this.producer.albums=producer.albumProducer
                if(this.total == this.model + 1){
                    confirm('Are you sure you want to save this producer?') && (await axios.post(this.lhost + '/producers/inserir',{
                        producer:this.producer
                    }) && this.cancela())
                }else{
                    this.next()
                }
            }
        },
        updated () {
            if(this.model == null){
                this.value = 0
            }
            this.value = parseInt(100/this.total * this.model,10)
        }
    }
</script>

<style scoped>
.mx-auto .import{
            margin: 20px auto;
            max-width: 800px;
  }
</style>