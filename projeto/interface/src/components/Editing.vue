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
                            v-for="m in 6" :key="m"
                        >
                            <h1>Album Insertion</h1>
                            <passoEditAlbum v-if="m == 1 && renderComponent" :obj="album" :position="first" @atualizaAlbum=atualizaAlbum($event)></passoEditAlbum>                           
                            <passoEditAlbum v-if="m == 2 && renderComponent" :obj="album" :position="second" @atualizaAlbum=atualizaAlbum($event)></passoEditAlbum>                           
                            <passoEditArtist v-if="m == 3 && renderComponent" :obj="album" :position="albumArtist" @atualizaAlbum=atualizaAlbum($event)></passoEditArtist>
                            <passoEditGroup v-else-if="m == 4 && renderComponent" :obj="album" :position="albumGroup" @atualizaAlbum=atualizaAlbum($event)></passoEditGroup>
                            <passoEditLabel v-if="m == 5 && renderComponent" :obj="album" :position="albumLabel" @atualizaAlbum=atualizaAlbum($event)></passoEditLabel>
                            <passoEditProducer v-if="m == 6 && renderComponent" :obj="album" :position="albumProducer" @atualizaAlbum=atualizaAlbum($event)></passoEditProducer>
                            
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
                            v-for="m in 5" :key="m"
                        >
                            <h1>Artist Insertion</h1>
                            <!-- :folio="info" @cancela=cancela() -->
                            <passoEditArtist v-if="m == 1 && renderComponent" :obj="artist" :position="first" @atualizaArtist=atualizaArtist($event)></passoEditArtist>
                            <passoEditArtist v-if="m == 2 && renderComponent" :obj="artist" :position="second" @atualizaArtist=atualizaArtist($event)></passoEditArtist>
                            <passoEditAlbum v-if="m == 3 && renderComponent" :obj="artist" :position="albumArtist" @atualizaArtist=atualizaArtist($event)></passoEditAlbum>
                            <passoEditGroup v-if="m == 4 && renderComponent" :obj="artist" :position="groupArtist" @atualizaArtist=atualizaArtist($event)></passoEditGroup>
                            <passoEditGenre v-if="m == 5 && renderComponent" :obj="artist" :position="genreArtist" @atualizaArtist=atualizaArtist($event)></passoEditGenre>
                        </v-window-item>
                    </v-window>
                    <v-window v-if="type == 'Group'" v-model="model">
                        <v-window-item
                            v-for="m in 5" :key="m"
                        >
                            <h1>Group Insertion</h1>
                            <!-- :folio="info" @cancela=cancela() -->
                            <passoEditGroup v-if="m == 1 && renderComponent" :obj="group" :position="first" @atualizaGroup=atualizaGroup($event)></passoEditGroup>
                            <passoEditGroup v-if="m == 2 && renderComponent" :obj="group" :position="second" @atualizaGroup=atualizaGroup($event)></passoEditGroup>
                            <passoEditAlbum v-if="m == 3 && renderComponent" :obj="group" :position="albumGroup" @atualizaGroup=atualizaGroup($event)></passoEditAlbum>
                            <passoEditArtist v-if="m == 4 && renderComponent" :obj="group" :position="groupArtist" @atualizaGroup=atualizaGroup($event)></passoEditArtist>
                            <passoEditGenre v-if="m == 5 && renderComponent" :obj="group" :position="groupGenre" @atualizaGroup=atualizaGroup($event)></passoEditGenre>
                        </v-window-item>
                    </v-window>
                    <v-window v-if="type == 'Label'" v-model="model">
                        <v-window-item
                            v-for="m in 3" :key="m"
                        >
                            <h1>Label Insertion</h1>
                            <!-- :folio="info" @cancela=cancela() -->
                            <passoEditLabel v-if="m == 1 && renderComponent" :obj="label" :position="first" @atualizaLabel=atualizaLabel($event)></passoEditLabel>
                            <passoEditLabel v-if="m == 2 && renderComponent" :obj="label" :position="second" @atualizaLabel=atualizaLabel($event)></passoEditLabel>
                            <passoEditAlbum v-if="m == 3 && renderComponent" :obj="label" :position="albumLabel" @atualizaLabel=atualizaLabel($event)></passoEditAlbum>
                        </v-window-item>
                    </v-window>
                    <v-window v-if="type == 'Producer'" v-model="model">
                        <v-window-item
                            v-for="m in 3" :key="m"
                        >
                            <h1>Producer Insertion</h1>
                            <!-- :folio="info" :fileInfo="passoEditProducerinfo" @submeterFolio=submeterFolio() @cancela=cancela() -->
                            <passoEditProducer v-if="m == 1 && renderComponent" :obj="producer" :position="first" @atualizaProducer=atualizaProducer($event)></passoEditProducer>
                            <passoEditProducer v-if="m == 2 && renderComponent" :obj="producer" :position="second" @atualizaProducer=atualizaProducer($event)></passoEditProducer>
                            <passoEditAlbum v-if="m == 3 && renderComponent" :obj="producer" :position="albumProducer" @atualizaProducer=atualizaProducer($event)></passoEditAlbum>
                        </v-window-item>
                    </v-window>
                    <v-window v-if="type == 'Genre'" v-model="model">
                        <v-window-item
                            v-for="m in 7" :key="m"
                        >
                            <h1>Genre Insertion</h1>
                            <!-- :folio="info" @cancela=cancela() -->
                            <passoEditGenre v-if="m == 1 && renderComponent" :obj="genre" :position="first" @atualizaGenre=atualizaGenre($event)></passoEditGenre>
                            <passoEditGenre v-if="m == 2 && renderComponent" :obj="genre" :position="second" @atualizaGenre=atualizaGenre($event)></passoEditGenre>
                            <passoEditArtist v-if="m == 3 && renderComponent" :obj="genre" :position="genreArtist" @atualizaGenre=atualizaGenre($event)></passoEditArtist>
                            <passoEditGroup v-if="m == 4 && renderComponent" :obj="genre" :position="groupGenre" @atualizaGenre=atualizaGenre($event)></passoEditGroup>
                            <passoEditGenre v-if="m == 5 && renderComponent" :obj="genre" :position="supergenreGenre" @atualizaGenre=atualizaGenre($event)></passoEditGenre>                           
                            <passoEditGenre v-if="m == 6 && renderComponent" :obj="genre" :position="subgenreGenre" @atualizaGenre=atualizaGenre($event)></passoEditGenre>
                            <passoEditGenre v-if="m == 7 && renderComponent" :obj="genre" :position="fusiongenreGenre" @atualizaGenre=atualizaGenre($event)></passoEditGenre>
                        </v-window-item>
                    </v-window>
                    
                </v-card>
            </v-expand-transition>
        </v-sheet>
    </div>
</template>

<script>
    import NavDraw from '../components/navDraw.vue'
    import passoEditAlbum from '../components/passoEditAlbum.vue'
    import passoEditArtist from '../components/passoEditArtist.vue'
    import passoEditGroup from '../components/passoEditGroup.vue'
    import passoEditGenre from '../components/passoEditGenre.vue'
    import passoEditLabel from '../components/passoEditLabel.vue'
    import passoEditProducer from '../components/passoEditProducer.vue'
    import axios from 'axios'
    export default {
        data: () => ({
            value: null,
            model: null,
            expand:false,
            total:0,
            first:'first',
            second:'second',
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
                idGroup:"",
                groupName:"",
                formationDate:"",
                disbandingDate:"",
                homepage:"",
                hometown:"",
                groupInfo:"",
                albums:[],
                albumsPreEdicao:[],
                members:[],
                membersPreEdicao:[],
                genres:[],
                genresPreEdicao:[],
                foto:{}
            },
            album:{
                idAlbum:"",
                albumName:"",
                type:"",
                releaseDate:"",
                runtime:"",
                albumInfo:"",
                artists:[],
                artistsPreEdicao:[],
                groups:[],
                groupsPreEdicao:[],
                labels:[],
                labelsPreEdicao:[],
                producers:[],
                producersPreEdicao:[],
                foto:{}
            },
            artist:{
                idArtist:"",
                artistName:"",
                birthPlace:"",
                birthDate:"",
                deathDate:"",
                gender:"",
                artistInfo:"",
                albums:[],
                albumsPreEdicao:[],
                groups:[],
                groupsPreEdicao:[],
                genres:[],
                genresPreEdicao:[],
                foto:{}
            },
            genre:{
                idGenre:"",
                genreName:"",
                artists:[],
                artistsPreEdicao:[],
                groups:[],
                groupsPreEdicao:[],
                superGenres:[],
                superGenresPreEdicao:[],
                subGenres:[],
                subGenresPreEdicao:[],
                fusionGenres:[],
                fusionGenresPreEdicao:[],
                genreInfo:""
            },
            label:{
                idLabel:"",
                labelName:"",
                headquarters:"",
                foundingYear:"",
                founder:"",
                albums:[],
                albumsPreEdicao:[],
                labelInfo:""
            },
            producer:{
                idProducer:"",
                producerName:"",
                firstActiveYear:"",
                albums:[],
                albumsPreEdicao:[],
                producerInfo:""
            },
            renderComponent: true
        }),
        components:{
            'navDraw':NavDraw,
            'passoEditAlbum':passoEditAlbum,
            'passoEditArtist':passoEditArtist,
            'passoEditGroup':passoEditGroup,
            'passoEditGenre':passoEditGenre,
            'passoEditLabel':passoEditLabel,
            'passoEditProducer':passoEditProducer
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
                    this.total = 6
                }
                else if(this.type == 'Genre'){
                    this.total = 7
                }
                else if(this.type == 'Artist' || this.type == 'Group'){
                    this.total = 5
                }
                else if(this.type == 'Label' || this.type == 'Producer'){
                    this.total = 3
                }
            },
            cancela(){
                this.group.idGroup = "",
                this.group.groupName = "",
                this.group.formationDate = "",
                this.group.disbandingDate = "",
                this.group.homepage = "",
                this.group.hometown = "",
                this.group.groupInfo = "",
                this.group.albums = [],
                this.group.albumsPreEdicao = [],
                this.group.members = [],
                this.group.membersPreEdicao = [],
                this.group.genres = [],
                this.group.genresPreEdicao = [],
                this.group.foto = {},

                this.album.idAlbum = "",
                this.album.albumName = "",
                this.album.type = "",
                this.album.releaseDate = "",
                this.album.runtime = "",
                this.album.albumInfo = "",
                this.album.artists = [],
                this.album.artistsPreEdicao = [],
                this.album.groups = [],
                this.album.groupsPreEdicao = [],
                this.album.labels = [],
                this.album.labelsPreEdicao = [],
                this.album.producers = [],
                this.album.producersPreEdicao = [],
                this.album.foto = {}

                this.artist.idArtist = "",
                this.artist.artistName = "",
                this.artist.birthPlace = "",
                this.artist.birthDate = "",
                this.artist.deathDate = "",
                this.artist.gender = "",
                this.artist.artistInfo = "",
                this.artist.albums = [],
                this.artist.albumsPreEdicao = [],
                this.artist.groups = [],
                this.artist.groupsPreEdicao = [],
                this.artist.genres = [],
                this.artist.genresPreEdicao = [],
                this.artist.foto = {}

                this.genre.idGenre = "",
                this.genre.genreName = "",
                this.genre.artists = [],
                this.genre.groups = [],
                this.genre.superGenres = [],
                this.genre.superGenresPreEdicao = [],
                this.genre.subGenres = [],
                this.genre.subGenresPreEdicao = [],
                this.genre.fusionGenres = [],
                this.genre.fusionGenresPreEdicao = [],
                this.genre.genreInfo = ""

                this.label.idLabel = "",
                this.label.labelName = "",
                this.label.headquarters = "",
                this.label.foundingYear = "",
                this.label.founder = "",
                this.label.albums = [],
                this.label.albumsPreEdicao = [],
                this.label.labelInfo = ""

                this.producer.idProducer = "",
                this.producer.producerName = "",
                this.producer.firstActiveYear = "",
                this.producer.albums = [],
                this.producer.albumsPreEdicao = [],
                this.producer.producerInfo = ""

                this.model = 0;
            },
            atualizaAlbum: async function(album){
                if(this.model == 0){
                    this.album.labelsPreEdicao=album.albumLabel
                    this.album.groupsPreEdicao=album.albumGroup
                    this.album.artistsPreEdicao=album.albumArtist
                    this.album.producersPreEdicao=album.albumProducer
                }
                this.album.idAlbum=album.idAlbum
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
                    await axios.post(this.lhost + '/albums/editar',{
                        album:this.album
                    })
                    this.cancela();
                }else{
                    this.next()
                }
            },
            atualizaArtist: async function(artist){
                if(this.model == 0){
                    this.artist.albumsPreEdicao=artist.albumArtist
                    this.artist.groupsPreEdicao=artist.groupArtist
                    this.artist.genresPreEdicao=artist.genreArtist
                }
                this.artist.idArtist=artist.idArtist
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
                    await axios.post(this.lhost + '/artists/editar',{
                        artist:this.artist
                    })
                    this.cancela();
                }else{
                    this.next()
                }
            },
            atualizaGroup: async function(group){
                if(this.model == 0){
                    this.group.membersPreEdicao=group.groupArtist
                    this.group.genresPreEdicao=group.groupGenre
                    this.group.albumsPreEdicao=group.albumGroup
                }
                this.group.idGroup=group.idGroup
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
                    await axios.post(this.lhost + '/groups/editar',{
                        group:this.group
                    })
                    this.cancela();
                }else{
                    this.next()
                }
            },
            atualizaGenre: async function(genre){
                if(this.model == 0){
                    this.genre.groupsPreEdicao=genre.groupGenre
                    this.genre.artistsPreEdicao=genre.genreArtist
                    this.genre.superGenresPreEdicao=genre.supergenreGenre
                    this.genre.subGenresPreEdicao=genre.subgenreGenre
                    this.genre.fusionGenresPreEdicao=genre.fusiongenreGenre
                }
                this.genre.idGenre=genre.idGenre
                this.genre.genreName=genre.genreName
                this.genre.genreInfo=genre.genreInfo
                this.genre.groups=genre.groupGenre
                this.genre.artists=genre.genreArtist
                this.genre.superGenres=genre.supergenreGenre
                this.genre.subGenres=genre.subgenreGenre
                this.genre.fusionGenres=genre.fusiongenreGenre
                if(this.total == this.model + 1){
                    await axios.post(this.lhost + '/genres/editar',{
                        genre:this.genre
                    })
                    this.cancela();
                }else{
                    this.next()
                }
            },
            atualizaLabel: async function(label){
                if(this.model == 0){
                    this.label.albumsPreEdicao=label.albumLabel
                }
                this.label.idLabel=label.idLabel
                this.label.labelName=label.labelName
                this.label.headquarters = label.headquarters
                this.label.foundingYear=label.foundingYear
                this.label.founder=label.founder
                this.label.labelInfo=label.labelInfo
                this.label.albums=label.albumLabel
                if(this.total == this.model + 1){
                    await axios.post(this.lhost + '/recordLabels/editar',{
                        label:this.label
                    })
                    this.cancela();
                }else{
                    this.next()
                }
            },
            atualizaProducer: async function(producer){
                if(this.model == 0){
                    this.producer.albumsPreEdicao=producer.albumProducer
                }
                this.producer.idProducer=producer.idProducer
                this.producer.producerName=producer.producerName
                this.producer.firstActiveYear=producer.firstActiveYear
                this.producer.producerInfo=producer.producerInfo
                this.producer.albums=producer.albumProducer
                if(this.total == this.model + 1){
                    await axios.post(this.lhost + '/producers/editar',{
                        producer:this.producer
                    })
                    this.cancela();
                }else{
                    this.next()
                }
            }
        },
        updated () {
            if(this.model == null){
                this.value = 0
            }
            console.log('model: ' + this.model)
            console.log('total: ' + this.total)
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