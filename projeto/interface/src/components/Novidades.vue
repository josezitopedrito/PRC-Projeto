<template>
    <div>
        <div id="loading" v-if="completeNewestAlbum.album">
            <div class="containerleft" v-if="completeNewestAlbum.album" @click="clickFunc">
                <img :src="imagem"/>
                <div class="centered" v-if="completeNewestAlbum"> The brand new album, {{completeNewestAlbum.album[0].name}}, is out now! </div>
            </div>
            <div id="slideshow" @click="dialog = true">
                <div>
                    <img src="@/assets/Sgt._Pepper's_Lonely_Hearts_Club_Band.jpg">
                    <div class="centered" > Choose the decade you want to look into! </div>
                </div>
                <div>
                    <img src="@/assets/Queen_A_Night_At_The_Opera.png">
                    <div class="centered" > Choose the decade you want to look into! </div>
                </div>
                <div>
                    <img src="@/assets/Michael_Jackson_-_Thriller.png">
                    <div class="centered" > Choose the decade you want to look into! </div>
                </div>
                <div>
                    <img src="@/assets/NirvanaNevermindalbumcover.jpg">
                    <div class="centered" > Choose the decade you want to look into! </div>
                </div>
                <div>
                    <img src="@/assets/220px-ArcadeFireFuneralCover.jpg">
                    <div class="centered" > Choose the decade you want to look into! </div>
                </div>
            </div>
            <div class="containerleft" @click="clickFuncAdd">
                <img src="@/assets/silhouette-of-man-holding-guitar-on-plant-fields-at-daytime-89909.jpg">
                <div class="centered" > Are you an artist? Have you just released an album? Help us by adding or editing your information! </div>
            </div>
            <div class="containerright" @click="clickFuncReg">
                <img src="@/assets/te-nguyen-Wt7XT1R6sjU-unsplash.jpg">
                <div class="centered" > Do you want to create an account and post information? Sign up now for free! </div>
            </div>
        </div>
        <div id="main" v-else>
            <div class="loader"></div> 
        </div>
        <v-dialog max-width="500px" v-model="dialog">
            <h2>What decade do you wish to visit?</h2>
            <v-list>
                <v-list-item-group>
                    <v-list-item to="/decadas?data=antesde50">
                        <v-list-item-title>Before 1950</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/decadas?data=50-60">
                        <v-list-item-title>The 50's</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/decadas?data=60-70">
                        <v-list-item-title>The 60's</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/decadas?data=70-80">
                        <v-list-item-title>The 70's</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/decadas?data=80-90">
                        <v-list-item-title>The 80's</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/decadas?data=90-00">
                        <v-list-item-title>The 90's</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/decadas?data=00-10">
                        <v-list-item-title>The 2000's</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/decadas?data=10-20">
                        <v-list-item-title>The 2010's</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-dialog>
    </div>
</template>
<script>
import axios from 'axios'
import $ from 'jquery'
export default {
    name: 'Novidades',
    data() {
        return {
            newestAlbum:{},
            completeNewestAlbum:{},
            lhost:'http://localhost:5001/api',
            url:'',
            imagem:'',
            dialog:false
        };
    },
    created:async function(){
        this.onUpdate()
    },
    mounted:async function(){
        $("#slideshow > div:gt(0)").hide();
        setInterval(function() {
        $('#slideshow > div:first')
            .fadeOut(1000)
            .next()
            .fadeIn(1000)
            .end()
            .appendTo('#slideshow');
        }, 3000);
    },
    methods: {
        clickFunc:async function() {
            if(this.newestAlbum[0]){
                this.$router.push(`/albums/${this.newestAlbum[0].id.split('#')[1]}`);
            }
        },
        clickFuncAdd:async function() {
            if(this.newestAlbum[0]){
                this.$router.push(`/adicao`);
            }
        },
        clickFuncReg:async function() {
            if(this.newestAlbum[0]){
                this.$router.push(`/registo`);
            }
        },
        onUpdate:async function(){
            try{
                let response = await axios.get(this.lhost + "/albums/albumsByDate")
                this.newestAlbum = response.data
                let response2 = await axios.get(this.lhost + `/albums/${this.newestAlbum[0].id.split('#')[1]}`)
                this.completeNewestAlbum = response2.data
                this.getPhoto()
                console.log(this.completeNewestAlbum)
            }catch(e){
                return e
            }
        },
        fileName: function(str){
            if(str.substring(0,5) == 'File:' && (str.substring(str.length - 4,str.length) == '.jpg'||str.substring(str.length - 5,str.length) == '.jpeg'||str.substring(str.length - 4,str.length) == '.png'||str.substring(str.length - 4,str.length) == '.gif')){
                return str.substring(5,str.length)
            }else{
                return 'nothing'
            }
        },
        getPhoto:async function(){
            this.url = "https://en.wikipedia.org/w/api.php"; 

            this.url = this.url + "?origin=*";
            this.url += "&action=query";
            this.url += "&prop=images";

            var replaced = this.completeNewestAlbum.album[0].name;
            replaced = replaced.split("&").join("%26")

            this.url += "&titles=" + replaced;
            this.url += "&format=json";

            this.url = this.url.split(" ").join("_")

            try{
            let response2 = await axios.get(this.url,{'Access-Control-Allow-Origin':'*'})
            var pages = response2.data.query.pages;
                for (var page in pages) {
                    for (var img of pages[page].images) {
                        var str = this.fileName(img.title)
                        if(str!='nothing'){
                            str = str.split(" ").join("_")
                            try{
                                let schyper = await axios.get('https://api.hashify.net/hash/md5/hex?value=' + str,{'Access-Control-Allow-Origin':'*'})
                                var schipheredStr = schyper.data['Digest']
                                var url2 = 'https://upload.wikimedia.org/wikipedia/en/' + schipheredStr.charAt(0) + '/' + schipheredStr.charAt(0) + schipheredStr.charAt(1) + '/' + str                 
                                let finalresponse = await axios.get(url2,{responseType:'arraybuffer','Access-Control-Allow-Origin':'*'})
                                var image = new Buffer(finalresponse.data, 'binary').toString('base64')                 
                                this.imagem = `data:${finalresponse.headers['content-type'].toLowerCase()};base64,${image}`
                                break
                            }catch{
                                //console.log('wrongFile')
                            }
                        }
                    }
                }
            }catch(e){
                console.log(e)
                return e
            }
        }
    },
};
</script>

<style scoped>
    #main{
        background-color: darkred;
        background-size: cover;
        top:0px;
        bottom: 50px;
        width: 100%;
        position: absolute;
    }
    #loading{
        background-color: darkred;
        background-size: cover;
        top:0px;
        bottom: 50px;
        width: 100%;
        position: absolute;
    }
    .loader {
        border: 16px solid #f3f3f3;
        border-radius: 50%;
        border-top: 16px solid #3498db;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
        position:relative;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .containerleft {
        position: relative;
        text-align: center;
        color: aliceblue;
        float:left;
        margin-left: 350px;
    }
    .containerright {
        position: relative;
        text-align: center;
        color: aliceblue;
        float:right;
        margin-right: 320px;
    }
    img{
        height:400px;
        width:500px;
        filter: blur(4px);
    }
    img:hover{
        height:400px;
        width:500px;
        filter: blur(0px);
        transform: scale(1.1);
        transform-origin: 50% 50%;
    }
    h2{
        background-color: aliceblue;
    }
    .centered{
        position: absolute;
        background-color:black;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    #slideshow {
        position: relative; 
        margin-right: 580px;
        width: 240px; 
        height: 400px;
        color: aliceblue;
        float: right;
        box-shadow: 0 0 20px rgba(0,0,0,0.4); 
    }
    #slideshow > div { 
        position: absolute;
    }
</style>