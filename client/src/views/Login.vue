
<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center">
    <h1>Logga in med ditt användarnamn!</h1>
    <div v-if="this.status" :class="status">{{ this.statusText }}</div>
    <div class="flexBoxLogin">
      <button type="button" class="btn btn-info" data-toggle="modal" data-target="#infoModal">
        ?
      </button>
      <div class="loginForm">
        <input class="form-control" type="text" v-model="userID" @keyup.enter="login" required />
        <input class="btn btn-secondary" type="button" value="Login" v-on:click="login"/>
      </div>
    </div>
    <input class="btn btn-link" type="button" value="Registrera användarnamn" data-toggle="modal" data-target="#registrationModal"/>
    <div class="modal fade" id="registrationModal" tabindex="-1" role="dialog" aria-labelledby="registrationModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="registrationModalLabel">Registrera ett nytt användarnamn</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body registrationModalBody">
            <input class="form-control" type="text" v-model="registrationID" required />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Stäng</button>
            <input class="btn btn-primary" type="button" value="Registrera" v-on:click="register" data-dismiss="modal"/>
          </div>
        </div>
      </div>
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
              För att bidra till detta arbete måste du logga in med det användarnamn som du har fått.<br>
              Dessa användarnamn har formen <i>NamnXX</i>, exempelvis Sven12.<br>
              Syftet är att ge dig som användare rätt uppgifter att utföra, genom att hålla koll på din tidigare aktivitet.<br>
            </p>
            <p>
              Har du några frågor så är det bara att höra av dig till Pontus Olausson (polaus@kth.se) eller Christoffer Linné (clinne@kth.se).
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
    registrationID: '',
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
            path: 'about',
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
    register() {
      fetch('/api/registerUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: this.registrationID,
        }),
      })
        .then((resp) => {
          this.status = `status-error-${!resp.ok}`;
          resp.text().then((text) => {
            this.statusText = text;
          });
        })
        .catch(err => console.error(err));
    },
  },
};
</script>
