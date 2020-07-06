
<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center">
    <h1>Logga in med ditt användarID!</h1>
    <div v-if="this.status" :class="status">{{ this.statusText }}</div>
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
          <div class="modal-body guideText">
            <p>
              För att bidra till detta arbete måste du logga in med det användarID som du mottagit.<br>
              Dessa användarID har formen <i>NamnXX</i>, exempelvis Sven12.<br>
              Syftet är att ge dig som användare rätt uppgifter att utföra, genom att hålla koll på din tidigare aktivitet.<br>
            </p>
            <p>
              Vill du få ett användarID så att du kan vara med och bidra till arbetet? Toppen!
              Hör av dig till Pontus Olausson eller Christoffer Linné så skapar vi ett åt dig!
            </p>
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
    statusText: '',
    status: null,
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
          this.status = 'status-error-true';
          error.text().then((text) => {
            this.statusText = text;
          });
        });
    },
  },
};
</script>
