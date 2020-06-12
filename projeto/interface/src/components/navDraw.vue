<template>
    <v-card>
        <v-navigation-drawer app
          permanent
          expand-on-hover
          dark
        >
          <v-list
            nav
            dense
          >
            <div v-if="$store.state.jwt != '' && $store.state.user.tipo == 'Admin'">
              <v-list-item link to="/users">
                <v-list-item-icon>
                  <v-icon>mdi-import</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Users</v-list-item-title>
              </v-list-item>
            </div>
            <v-list-group
              prepend-icon="mdi-folder-open"
              :value="false"
            >
              <template v-slot:activator>
                <v-list-item-title>Content</v-list-item-title>
              </template>
              <v-list-item link to="/edicao">
                <v-list-item-title>Edit Content</v-list-item-title>
              </v-list-item>
              <v-list-item link to="/adicao">
                <v-list-item-title>Insert Content</v-list-item-title>
              </v-list-item>
            </v-list-group>
            <div v-if="$store.state.jwt != '' && $store.state.user.tipo == 'Admin'" >
              <v-list-item link to="/pedidos">
                <v-list-item-icon>
                  <v-icon>mdi-account-multiple</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Requests for registration</v-list-item-title>
              </v-list-item>
            </div>
            <v-list-item link to="/credits">
              <v-list-item-icon >
                <v-icon>mdi-text</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Credits</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
    </v-card>
</template>

<script>
export default {
    data() {
        return{
            title: 'Vue'
        }
    }
};
</script>

<style scoped>

header{
    background:#2A3F54;
    padding: 10px;
}

h1{
    color:white;
    text-align:center;
}

</style>