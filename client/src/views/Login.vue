
<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center">
    <h1>What is your userID?</h1>
    <h2>{{ this.status }}</h2>
    <form>
      <input class="form-control" type="text" v-model="userID" required autofocus />
      <input class="btn btn-default" type="button"
       v-on:click="login()" value="Login" />
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  components: {},
  data: () => ({
    userID: '',
    status: '',
  }),
  methods: {
    login() {
      fetch('/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: this.userID,
        }),
      })
        .then((resp) => {
          if (resp.ok) return resp;
          this.$store.commit('setIsAuthenticated', false);
          throw resp;
        })
        .then(() => {
          this.$store.commit('setIsAuthenticated', true);
          this.$router.push({
            path: 'genUttr',
          });
        })
        .catch((error) => {
          console.error('Authentication failed unexpectedly');
          error.text().then((text) => {
            this.status = text;
          });
        });
    },
    register() {
      fetch('/api/registerUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: this.userID,
        }),
      })
        .then((resp) => {
          if (resp.ok) return resp;
          this.$router.push({
            path: '/',
          });
          throw new Error(resp.text);
        })
        .then(() => {
          this.$router.push({
            path: '/',
          });
        })
        .catch((error) => {
          console.error('Registration failed unexpectedly');
          throw error;
        });
    },
  },
};
</script>
