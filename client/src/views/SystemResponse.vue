
<template>
  <div class="container-fluid" v-if="dialogue">
    <div class="row" style="text-align: center">
      <div class="col-md-4 col-md-offset-4">
        <h1>Fortsätt på denna dialog!</h1>
        <h4>
          Du har nu rollen som busschafför.
          Svara användaren genom att välja det av svaren som passar bäst, givet följande dialog.
        </h4>
        <div class="well">
          <div class="dialogueTurn" v-for="utterance in dialogue.utterances"
           :key="utterance.uttrID">
            <h4 class="userUtterance">
              Användare: {{ utterance.uttr }}
            </h4>
            <h4 v-if="utterance.systemResponseText" class="systemUtterance">
              Busschaufför: {{ utterance.systemResponseText }}
            </h4>
          </div>
        </div>
        <div class="flexBoxLogin">
          <button type="button" class="btn btn-info" data-toggle="modal" data-target="#infoModal">
            ?
          </button>
          <h3>Vilket av följande alternativ passar bäst?</h3>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <div class="well" v-for="template in templates" v-bind:key="template.templateID"
         @click="pickSystemResponse(template.templateID)">
          <h2>{{ template.template }}</h2>
        </div>
      </div>
    </div>
    <div class="modal fade" id="infoModal" tabindex="-1" role="dialog"
     aria-labelledby="infoModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="infoModalLabel">Guide</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Detta är förklaringen för sidan.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-Primary" data-dismiss="modal">Stäng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center" v-else>
    <h2>Seems like there is currently no utterance for you to respond to :(</h2>
    <h3>Try generating some new instead!</h3>
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
