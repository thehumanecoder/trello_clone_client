<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Commuter</span>
        <span class="font-weight-light"></span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
   <v-toolbar-items class="hidden-sm-and-down" v-if="!user">
      <v-btn flat :to="{name:'signup'}">Go To SignUp</v-btn>
      <v-btn flat :to="{name:'login'}">Go To LogIn</v-btn>
   </v-toolbar-items>
   <v-toolbar-items class="hidden-sm-and-down" v-if="user">
       <v-layout wrap justify-content align-center>
        <h3>{{user.user.displayName}}</h3>&nbsp;&nbsp;
         <v-avatar
          :size="40"
          color="grey lighten-4"
        >
          <img :src="user.user.imageUrl" alt="avatar">
        </v-avatar>
      </v-layout>
     <v-btn flat @click="logout">Log Out</v-btn>

   </v-toolbar-items>
          </v-toolbar>

    <v-content>
      <router-view/>
       <v-footer class="pa-3" app>
    <v-spacer></v-spacer>
    <div>Made with &#x1F49C; by Biswas </div>
  </v-footer>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'App',
  data() {
    return {

    };
  },
  computed: {
    ...mapState('auth', { user: 'payload' }),
  },
  methods: {
    ...mapActions('auth', { authLogout: 'logout' }),
    logout() {
      this.authLogout().then(() => this.$router.push('/login'));
    },
  },
};
</script>
