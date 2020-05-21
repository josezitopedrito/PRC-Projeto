<template>
    <div>
        <div class="container" v-if="completeNewestAlbum.album" @click="clickFunc">
            <img :src="imagem" />
            <div class="centered" v-if="completeNewestAlbum"> The brand new album, {{completeNewestAlbum.album[0].name}}, is out now! </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: 'Novidades',
    data() {
        return {
            newestAlbum:{},
            completeNewestAlbum:{},
            lhost:'http://localhost:5001/api',
            url:'',
            imagem:''
        };
    },
    created:async function(){
        this.onUpdate()
    },
    methods: {
        clickFunc:async function() {
            if(this.newestAlbum[0]){
                this.$router.push(`/albums/${this.newestAlbum[0].id.split('#')[1]}`);
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
    .container {
        position: relative;
        text-align: start;
        color: aliceblue;
    }
    img{
        height:400px;
        width:500px;
        background-size: cover;
        filter: blur(8px);
    }
    .centered{
        position: absolute;
        top: 50%;
        left: 22%;
        transform: translate(-50%, -50%);
    }
</style>