
<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center" v-if="dialogue">
    <h1>Bedöm den gulmarkerade repliken!</h1>
    <div class="well">
      <div class="dialogueTurn" v-for="utterance in dialogue.utterances" :key="utterance.uttrID">
        <h4 v-bind:class="{ userUtterance: true, lastUtterance: !utterance.systemResponseText }">
          Resenär: {{ utterance.uttr }}
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
          v-on:click="passJudgement(1)" value="Bra" />
        <input class="btn btn-default" type="button"
          v-on:click="passJudgement(0)" value="Dålig" />
      </div>
    </div>
    <br>
    <div v-if="(counter >= 6)" style="text-align:right">
      <button type="button" v-on:click="goToNextStep()" class="btn btn-success" style="width:150px">Gå vidare</button>
    </div>
    <div v-else style="text-align:right">
      <button type="button" class="btn btn-success" disabled  style="width:150px">{{this.counter}}/6</button>
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
            <h2>Du ska nu bedöma en replik!</h2>
            <p>
              Tyvärr passar inte alla repliker in i konversationen eller är relevanta för ändamålet.
              Din uppgift nu är att bedöma om en replik passar bra eller dåligt i kontexten. Repliken
              du ska bedöma är den <b>sista</b> i konversationen.
            </p>
            <p>
              Tänk på att konversationen handlar om att en resenär ska försöka ta reda på information
              om busslinjer och resor genom att hålla en dialog med en busschafför. Även repliker som
              i sig passar in i konversationen är ibland tyvärr "dåliga" eftersom de handlar om något
              som inte är relevant för kontexten bussresor.
            </p>
            <p>
              Här är några exempel som skulle vara bra repliker, givet att de passar in i resten av
              konversationen:
              <ul>
              <li><i>Hej, vet du vad slutstationen för buss #busslinje är?</i></li>
              <li><i>Tack för svaret på min fråga, det var allt jag undrade.</i></li>
              </ul>
               Här är några exempel på repliker som inte passar detta ändamål:
              <ul>
              <li><i>Bonjour madame!</i></li>
              <li><i>Hej, vad tycker du om den politiska situationen i Tyskland?</i></li>
              </ul>
            </p>
            <p>
              När du röstar finns det inga rätt eller fel! Tänk efter om du tycker att repliken passar
              konversationen och om det är något som en busschafför kan svara på.
              Rösta genom knapparna under och gör gärna det på 3 olika repliker innan
              du går vidare till nästa steg.
            </p>
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
