
<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center">
    <h1>Generera ett yttrande!</h1>
    <div v-if="status" :class="status">{{ statusText }}</div>
    <div v-if="dialogue">
      <h2>Skriv ett svar till följande dialog:</h2>
      <div class="well">
        <div class="dialogueTurn" v-for="utterance in dialogue.utterances" :key="utterance.uttrID">
          <h4 class="userUtterance">
            Användare: {{ utterance.uttr }}
          </h4>
          <h4 class="systemUtterance">
            Busschaufför: {{ utterance.systemResponseText }}
          </h4>
      </div>
      </div>
    </div>
    <div v-else>
      <h2>Starta en ny dialog!</h2>
    </div>
    <form id="genUttrForm">
      <input class="form-control" type="text" v-model="utterance" required autofocus />
      <input class="btn btn-default" type="button"
       v-on:click="submitUtterance()" value="Skicka in" />
    </form>
  </div>
</template>

<script>
export default {
  name: 'GenerateUtterance',
  components: {},
  data: () => ({
    dialogue: null,
    utterance: '',
    responseTo: null,
    statusText: '',
    status: null,
  }),
  methods: {
    submitUtterance() {
      document.getElementById('genUttrForm').reset();

      fetch('/api/submitUtterance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          utterance: this.utterance,
          responseTo: this.responseTo,
        }),
      })
        .then((resp) => {
          this.status = `status-error-${!resp.ok}`;
          resp.text().then((text) => {
            this.statusText = text;
          });

          if (resp.ok) return resp;
          throw resp;
        })
        .then(() => {
          this.fetchDialogue();
        })
        .catch((error) => {
          throw error;
        });
    },

    fetchDialogue() {
      fetch('/api/getDialogueForUserResponse')
        .then(res => res.json())
        .then((data) => {
          this.dialogue = data.dialogue;
          if (data.dialogue != null) {
            const { utterances } = data.dialogue;
            this.responseTo = utterances[utterances.length - 1].uttrID;
          }
        })
        .catch(console.error);
    },
  },
  created() {
    this.fetchDialogue();
  },
};
</script>
