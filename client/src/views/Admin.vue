<template>
  <div class="container">
    <section class="col-md-10 col-md-offset-1">
      <div class="row" style="text-align: center;">
        <h1>Här syns alla färdiga dialoger!</h1>
        <h2>Antal färdiga dialoger: {{ dialogues.length }}</h2>
      </div>
      <div class="well" v-for="dialogue in dialogues" :key="dialogue.utterances[0].uttrID">
        <div class="dialogueTurn" v-for="utterance in dialogue.utterances" :key="utterance.uttrID">
          <h4 class="userUtterance">
            Användare: {{ utterance.uttr }}
          </h4>
          <h4 class="systemUtterance" v-if="utterance.systemResponseText">
            Busschaufför: {{ utterance.systemResponseText }}
          </h4>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  components: {},
  data() {
    return {
      dialogues: {},
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

    fetch('/api/getFinishedDialogues')
      .then(res => res.json())
      .then((data) => {
        this.dialogues = data.dialogues;
      })
      .catch(console.error);
  },
};
</script>
