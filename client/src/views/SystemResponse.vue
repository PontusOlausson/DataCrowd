
<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center" v-if="dialogue">
    <h1>Fetched utterance waiting for response!</h1>
    <div class="well">
      <div class="dialogueTurn" v-for="utterance in dialogue.utterances" :key="utterance.uttrID">
        <h3 class="userUtterance">
          Användare: {{ utterance.uttr }}
        </h3>
        <h4 v-if="utterance.systemResponseText" class="systemUtterance">
          Busschaufför: {{ utterance.systemResponseText }}
        </h4>
      </div>
    </div>
    <div>
      <h2>Which of the following responses is the best fit?</h2>
      <div class="well" v-for="template in templates" v-bind:key="template.templateID"
       @click="pickSystemResponse(template.templateID)">
        <h3>{{ template.template }}</h3>
      </div>
    </div>
  </div>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center" v-else>
    <h2>Seems like there is currently no utterance that you pick a response to :(</h2>
    <h3>Try generating some new instead utterances instead!</h3>
  </div>
</template>

<script>
export default {
  name: 'SystemResponse',
  components: {},
  data: () => ({
    dialogue: null,
    status: '',
    templates: [],
  }),
  methods: {
    fetchDialogue() {
      fetch('/api/getDialogueForSystemResponse')
        .then(res => res.json())
        .then((data) => {
          this.dialogue = data.dialogue;
        })
        .catch(console.error);
    },
    pickSystemResponse(templateID) {
      fetch('/api/addSystemResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateID,
          uttrID: this.dialogue.utterances[this.dialogue.utterances.length - 1].uttrID,
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

    fetch('/api/getTemplates')
      .then(res => res.json())
      .then((data) => {
        this.templates = data.templates;
      })
      .catch(console.error);
  },
};
</script>
