
<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center">
    <h1>What is your userID?</h1>
    <h2>{{ this.status }}</h2>
    <div class="flexBoxLogin">
      <button type="button" class="btn btn-info" data-toggle="modal" data-target="#infoModal">
        ?
      </button>
      <form class="loginForm">
        <input class="form-control" type="text" v-model="userID" required autofocus />
        <input class="btn btn-secondary" type="button"
         v-on:click="login()" value="Login" />
      </form>
    </div>
    <div class="modal fade" id="infoModal" tabindex="-1" role="dialog" aria-labelledby="infoModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="infoModalLabel">Guide</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. Detta är förklaringen för sidan. 
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-Primary" data-dismiss="modal">Stäng</button>
          </div>
        </div>
      </div>
    </div>
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
