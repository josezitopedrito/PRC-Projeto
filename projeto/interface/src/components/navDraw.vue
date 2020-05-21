<template>
    <v-card>
        <v-navigation-drawer app
          permanent
          expand-on-hover
        >
          <v-list
            nav
            dense
          >
            <v-list-item link to="/novidades">
              <v-list-item-icon>
                <v-icon>mdi-import</v-icon>
              </v-list-item-icon>
              <v-list-item-title>What's new?</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/users">
              <v-list-item-icon>
                <v-icon>mdi-import</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Utilizadores</v-list-item-title>
            </v-list-item>
            <v-list-group
              prepend-icon="mdi-folder-open"
              value="true"
            >
              <template v-slot:activator>
                <v-list-item-title>Alteração de conteúdo</v-list-item-title>
              </template>
              <v-list-item link to="/edicao">
                <v-list-item-title>Edição</v-list-item-title>
              </v-list-item>
              <v-list-item link to="/adicao">
                <v-list-item-title>Adição</v-list-item-title>
              </v-list-item>
            </v-list-group>
            <v-list-item link to="/pedidos">
              <v-list-item-icon>
                <v-icon>mdi-account-multiple</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Pedidos de registo</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/about">
              <v-list-item-icon>
                <v-icon>mdi-information-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>About page</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>mdi-text</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Créditos</v-list-item-title>
            </v-list-item>
            <v-list-item link to="/">
              <v-list-item-icon>
                <v-icon>mdi-magnify</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Voltar à página de consulta</v-list-item-title>
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