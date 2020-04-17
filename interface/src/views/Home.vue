<template>
  <div class="home">
    <v-card>
      <v-card-title>O que deseja consultar?</v-card-title>
      <v-card-actions>
        <v-list
          nav
          dense
        >
          <v-list-item link to="/albums">
            <v-list-item-icon>
              <v-icon>mdi-import</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Albuns</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/artists">
            <v-list-item-icon>
              <v-icon>mdi-magnify</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Artistas</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/groups">
            <v-list-item-icon>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Grupos musicais</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/genres">
            <v-list-item-icon>
              <v-icon>mdi-settings</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Géneros musicais</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/producers">
            <v-list-item-icon>
              <v-icon>mdi-help</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Produtores</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/labels">
            <v-list-item-icon>
              <v-icon>mdi-information-outline</v-icon>
            </v-list-item-icon>
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
