<template>
  <div id="Home" class="home">
    <v-card flat class="table">
      <v-card-title>What do you wish to see?</v-card-title>
      <v-card-actions>
        <v-list
          nav
          dense
          class="table"
        >
          <v-list-item link to="/albums">
            <v-list-item-title>Albums</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/artists">
            <v-list-item-title>Artists</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/groups">
            <v-list-item-title>Musical groups</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/genres">
            <v-list-item-title>Musical genres</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/producers">
            <v-list-item-title>Producers</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/recordLabels">
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
  name: 'Home'
}
</script>
<style scoped>
  #Home{
    background-image: url("../assets/silhouette-of-man-holding-guitar-on-plant-fields-at-daytime-89909.jpg");
    background-color: #cccccc;
    min-height: 94%;
    background-size:cover;
    background-position:50% 50%;
    
  }
  .table {
   background-color: transparent!important;
   opacity: 1;
   margin-left: 50px;
 }
</style>
