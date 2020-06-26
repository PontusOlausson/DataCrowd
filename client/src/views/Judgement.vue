
<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center" v-if="dialogue">
    <h1>Fetched utterance to judge!</h1>
    <div class="well" v-for="utterance in dialogue.utterances" v-bind:key="utterance.uttrID">
      <h3>
        User utterance: {{ utterance.uttr }}
      </h3>
      <h4 v-if="utterance.systemResponseText">
        System response: {{ utterance.systemResponseText }}
      </h4>
    </div>
    <input class="btn btn-default" type="button"
      v-on:click="passJudgement(1)" value="Good" />
    <input class="btn btn-default" type="button"
      v-on:click="passJudgement(0)" value="Bad" />
  </div>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center" v-else>
    <h2>Seems like there is currently no utterance that you can judge :(</h2>
    <h3>Try generating some new instead!</h3>
  </div>
</template>

<script>
export default {
  name: 'Judgement',
  components: {},
  data: () => ({
    dialogue: null,
    status: '',
  }),
  methods: {
    fetchDialogue() {
      fetch('/api/getDialogueForJudgement')
        .then(res => res.json())
        .then((data) => {
          this.dialogue = data.dialogue;
        })
        .catch(console.error);
    },
    passJudgement(score) {
      fetch('/api/passJudgement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uttrID: this.dialogue.utterances[this.dialogue.utterances.length - 1].uttrID,
          score,
        }),
      })
      .then(() => {
        this.fetchDialogue();
      })
      .catch(console.error);
    },
  },
  created() {
    this.fetchDialogue();
  },
};
</script>
