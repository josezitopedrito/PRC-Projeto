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
            <h2>Albums</h2>
          </v-list-item>
          <v-list-item link to="/artists">
            <h2>Artists</h2>
          </v-list-item>
          <v-list-item link to="/groups" >
            <h2>Musical groups</h2>
          </v-list-item>
          <v-list-item link to="/genres">
            <h2>Musical genres</h2>
          </v-list-item>
          <v-list-item link to="/producers">
            <h2>Producers</h2>
          </v-list-item>
          <v-list-item link to="/recordLabels">
            <h2>Record Labels</h2>
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
