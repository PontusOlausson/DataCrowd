
<template>
  <div class="sysDialog" v-if="dialogue">
    <div class="row">
      <div class="text-box col-md-4 col-md-offset-4" style="text-align: center">
        <h1>Fortsätt på denna dialog!</h1>
        <h4>
          Du har nu rollen som busschafför.
          Svara resenären genom att välja det av svaren som passar bäst, givet följande dialog.
        </h4>
        <div class="well">
          <div class="dialogueTurn" v-for="utterance in dialogue.utterances"
           :key="utterance.uttrID">
            <h4 class="userUtterance">
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
          <h3>Vilket av följande alternativ passar bäst?</h3>
        </div>
        <div v-if="(counter >= 3)">
          <br>
          <button type="button" v-on:click="goToNextStep()"
           class="btn btn-success btn-lg btn-block">
            Börja om
          </button>
          <br>
        </div>
        <div v-else>
          <br>
          <button type="button" class="btn btn-success btn-lg btn-block" disabled>
            {{ this.counter }}/3
          </button>
          <br>
        </div>
    </div>
    <div class="row">
      <div class="text-box col-md-8 col-md-offset-2">
        <div class="templateButton well well-sm col-md-4" v-for="template in templates" v-bind:key="template.templateID"
         @click="pickSystemResponse(template.templateID)">
          <div class="templateText">{{ template.template }}</div>
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
            <div class="modal-body guideText">
              <h2>Du ska nu välja ett svar i rollen som busschafför!</h2>
              <p>
                Du bör nu se en replik eller en konversation mellan en busschafför och en resenär. Din
                uppgift nu är att välja ett svar utifrån rollen som busschafför. Försök välja ett av
                svaren som passar bra i konversationen och som besvarar det resenären undrar.
              </p>
              <p>
                I vissa fall skulle flera svar kunna passa in och besvara resenärens funderingar.
                Då har du möjlighet att vara kreativ och välja något du tycker skulle vara intressant.
                I vissa fall passar inget svar bra. Då kan du antingen välja ett svar som passar ganska
                bra alternativt välja svaret "Inget alternativ passar". Om du anser att busschaffören
                inte borde säga något mer utan att konversationen är klar, välj då alternativet "Dialogen är klar".
              </p>
              <p>
                Här är ett par exempel som skulle vara bra svar på den tidigare konversationen,
                kursiva rader är tidigare repliker från resenären, fetstilta kursiva rader är svar från busschaffören:
                <ul>
                <li><i>Resenär: Min kompis hinner inte till den här bussen. När går nästa buss?</i></li>
                <li><i><b>Busschaufför: Nästa buss på den här linjen går klockan #tid.</b></i></li>
                </ul>
                <ul>
                <li><i>Resenär: Hej, vet du vad slutstationen för buss #busslinje är?</i></li>
                <li><i><b>Busschaufför: Slutstationen för buss #busslinje är #plats.</b></i></li>
                <li><i>Resenär: Tack så mycket!</i></li>
                <li><i><b>Busschaufför: Kan jag hjälpa dig med något mer?</b></i></li>
                <li><i>Resenär: Nej, det är bra tack.</i></li>
                <li><i><b>Busschaufför: Dialogen är klar</b></i></li>
                </ul>
              </p>
              <p>
                Välj något svar som du tycker skulle passa bra i en konversation mellan
                en busschafför och en resenär samt som besvarar resenärens funderingar.
                Välj svar genom att klicka på svarsalternativet som passar bäst. Gör gärna det för 3 olika konversationer
                innan du går vidare.
              </p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-Primary" data-dismiss="modal">Stäng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center" v-else>
    <h2>Det finns för närvarande inga repliker som du kan välja systemsvar till :(</h2>
    <h3>Testa att generera några nya repliker istället!</h3>
    <div>
      <br>
      <button type="button" v-on:click="goToNextStep()" class="btn btn-success btn-lg btn-block">
        Börja om
      </button>
    </div>
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
    counter: 0,
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
          this.counter += 1;
        })
        .catch(console.error);
    },
    goToNextStep() {
      this.$router.push({
        path: 'genUttr',
      });
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
