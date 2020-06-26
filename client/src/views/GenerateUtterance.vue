
<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center">
    <h1>Generate an utterance!</h1>
    <h2>{{ this.status }}</h2>
    <div v-if="dialogue">
      <h2>Fetched dialogue to generate an answer to!</h2>
      <div class="well" v-for="utterance in dialogue.utterances" :key="utterance.id">
        <h4>
          <span>
            User utterance: {{ utterance.uttr }} <br>
            System response: {{ utterance.systemResponseText }}
          </span>
        </h4>
      </div>
    </div>
    <div v-else>
      <h2>Start a new dialogue!</h2>
    </div>
    <form id="genUttrForm">
      <input class="form-control" type="text" v-model="utterance" required autofocus />
      <input class="btn btn-default" type="button"
       v-on:click="submitUtterance()" value="Submit" />
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
    status: '',
  }),
  methods: {
    submitUtterance() {
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
          if (resp.ok) return resp;
          resp.text().then((text) => {
            this.status = text;
            return text;
          });
          return resp;
        })
        .then(() => {
          this.fetchDialogue();
        })
        .catch((error) => {
          throw error;
        });

      document.getElementById('genUttrForm').reset();
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
