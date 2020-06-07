<template>
    <div>
        <v-app-bar app fixed color="black">
            <v-toolbar color="black">
                <v-btn color='black' class="white--text" href="/">
                    Voltar ao início
                </v-btn>
                <div class="spacer"></div>
                <v-menu>
                    <template v-slot:activator="{ on: menu }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on: tooltip }">
                                <v-btn
                                color="primary"
                                dark
                                v-on="{ ...tooltip, ...menu }"
                                >
                                    <v-icon>mdi-acount</v-icon>
                                </v-btn>
                            </template>
                        <span>Im A ToolTip</span>
                        </v-tooltip>
                    </template>
                    <v-list>
                        <v-list-item link to="/novidades">
                            <v-list-item-title>What's new?</v-list-item-title>
                        </v-list-item>
                        <v-list-item link to="/globalFavourites">
                            <v-list-item-title>Global Favourites</v-list-item-title>
                        </v-list-item>
                        <div v-if="$store.state.jwt == ''">
                            <v-list-item link to="/registo">
                                <v-list-item-title>Register</v-list-item-title>
                            </v-list-item>
                            <v-list-item link to="/login">
                                <v-list-item-title>Login</v-list-item-title>
                            </v-list-item>
                        </div>
                        <!-- Para ver enquanto logged in -->
                        <div v-else>
                            <v-list-item link to="/perfil">
                                <v-list-item-title>See Profile</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="endLog">
                                <v-list-item-title>Leave Session</v-list-item-title>
                            </v-list-item>
                        </div>
                    </v-list>
                </v-menu>
            </v-toolbar>
        </v-app-bar>
    </div>
</template>

<script>
export default {
    methods : {
        endLog : async function (){
        this.$store.commit("eliminarToken")
        this.$router.go()
        }
  }
}
</script>