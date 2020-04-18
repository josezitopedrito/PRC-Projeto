<template>
  <div id="Home" class="home">
    <v-card flat class="table">
      <v-card-title>O que deseja consultar?</v-card-title>
      <v-card-actions>
        <v-list
          nav
          dense
          class="table"
        >
          <v-list-item link to="/albums">
            <v-list-item-title>Albuns</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/artists">
            <v-list-item-title>Artistas</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/groups">
            <v-list-item-title>Grupos musicais</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/genres">
            <v-list-item-title>Géneros musicais</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/producers">
            <v-list-item-title>Produtores</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/labels">
            <v-list-item-title>Record Labels</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
}
</script>
<style scoped>
  #Home{
    background-image: url("../assets/silhouette-of-man-holding-guitar-on-plant-fields-at-daytime-89909.jpg");
    background-color: #cccccc;
    min-height: 100%;
    background-size: cover;
    background-position:50% 50%;
  }
  .table {
   background-color: transparent!important;
   opacity: 1;
 }
</style>