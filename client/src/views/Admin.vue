<template>
  <div class="container">
    <section class="col-md-10 col-md-offset-1">
      <div class="row" style="text-align: center;">
        <h1>Hello {{ userID }}!</h1>
      </div>

      <div class="row">
        <div class="well" v-for="utterance in userUtterances" :key="utterance.id">
          <div class="row" style="text-align: center;">
            <h4>
              <span>
                Uttr: {{ utterance.uttr }},
                votes: {{ utterance.votes }},
                score: {{ utterance.score }}
              </span>
            </h4>
          </div>
        </div>
      </div>

      <div class="row" style="text-align: center;">
        <h1>Add a user!</h1>
      </div>
      <form v-on:submit.prevent="addUser()">
        <input class="form-control" type="text" v-model="userID" required autofocus />
        <input class="btn btn-default" type="submit" value="Ok" />
      </form>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  components: {},
  data() {
    return {
      userUtterances: {},
      users: {},
      userID: '',
    };
  },
  methods: {
    addUser() {
      fetch('/api/registerUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: this.userID,
        }),
      });
    },
  },
  created() {
    fetch('/api/getUsers')
      .then(res => res.json())
      .then((data) => {
        this.users = data.users;
      })
      .catch(console.error);

    fetch('/api/getUserUtterances')
      .then(res => res.json())
      .then((data) => {
        this.userUtterances = data.userUtterances;
      })
      .catch(console.error);
  },
};
</script>
