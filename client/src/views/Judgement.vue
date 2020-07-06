
<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center" v-if="dialogue">
    <h1>Fetched utterance to judge!</h1>
    <div class="well">
      <div class="dialogueTurn" v-for="utterance in dialogue.utterances" :key="utterance.uttrID">
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
      <div>
        <input class="btn btn-default" type="button"
          v-on:click="passJudgement(1)" value="Good" />
        <input class="btn btn-default" type="button"
          v-on:click="passJudgement(0)" value="Bad" />
      </div>
    </div>
    <div v-if="(counter >= 3)">
      <br>
      <button type="button" v-on:click="goToNextStep()" class="btn btn-success btn-lg btn-block">Gå vidare</button>
    </div>
    <div v-else>
      <br>
      <button type="button" class="btn btn-success btn-lg btn-block" disabled>{{this.counter}}/3</button>
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
    <h2>Det finns för närvarande inga repliker som du kan bedöma :(</h2>
    <h3>Testa att välja systemsvar istället!</h3>
    <div>
      <br>
      <button type="button" v-on:click="goToNextStep()" class="btn btn-success btn-lg btn-block">Gå vidare</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Judgement',
  components: {},
  data: () => ({
    dialogue: null,
    status: '',
    counter: 0,
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
          this.counter += 1;
        })
        .catch(console.error);
    },
    goToNextStep() {
      this.$router.push({
        path: 'sysres',
      });
    },
  },
  created() {
    this.fetchDialogue();
  },
};
</script>
