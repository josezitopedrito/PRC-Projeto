<template>
    <footer>
        <p>{{copyright}}</p>
    </footer>
</template>

<script>
export default {
    data() {
        return{
            copyright: 'PRC-Enterprises'
        }
    }
};
</script>

<style scoped>

footer{
    background: black;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
}
p{
    color: lightyellow;
    text-align: center;
}

</style>