
<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center">
    <h1>Generera en replik!</h1>
    <h3>Du är nu en resenär som ska prata med en busschafför</h3>
    <div v-if="status" :class="status">{{ statusText }}</div>
    <div v-if="dialogue">
      <h2>Skriv ett svar till följande dialog:</h2>
      <div class="well">
        <div class="dialogueTurn" v-for="utterance in dialogue.utterances" :key="utterance.uttrID">
          <h4 class="userUtterance">
            Resenär: {{ utterance.uttr }}
          </h4>
          <h4 class="systemUtterance">
            Busschaufför: {{ utterance.systemResponseText }}
          </h4>
        </div>
        <h4 class="userUtterance" v-if="this.utterance">
          Resenär: {{ this.utterance }}
        </h4>
      </div>
    </div>
    <div v-else>
      <h2>Starta en ny dialog!</h2>
      <div class="well">
        <h4 class="userUtterance" v-if="this.utterance">
          Resenär: {{ this.utterance }}
        </h4>
      </div>
    </div>
    <div class="flexBoxLogin">
      <button type="button" class="btn btn-info" data-toggle="modal" data-target="#infoModal">
        ?
      </button>
      <div class="loginForm">
        <input class="form-control" type="text" v-model="utterance" @keyup.enter="submitUtterance"/>
        <input class="btn btn-secondary" type="button" v-on:click="submitUtterance" value="Skicka in" />
      </div>
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
            <h2>Du har nu rollen som en resenär som pratar med en busschaufför!</h2>
            <p>
              Beroende på om det finns tidigare oavslutade konversationer i databasen eller inte
              kommer du ombeds att antingen starta en ny konversation eller att fortsätta på en
              existerande konversation.
            </p>
            <p>
              Du väljer alltid själv hur din replik ser ut. Syftet med varje konversation ska dock
              vara att ta reda på relevant information om bussresor och busslinjer så att du
              kan planera din resa.
            </p>
            <p>
              Nu är du i rollen av en resenär. Din uppgift är att försöka ta reda på saker om busslinjer genom att prata med och
              ställa frågor till busschaffören. Du kan fråga om saker som är relevanta till busslinjer, som exempelvis:
              busslinje, hållplatser, slutstationer, tidstabeller, mm.
            </p>
            <p>
              När du vill prata om en specifik busslinje eller hållplats, använd taggarna #busslinje och
              #plats istället för de faktiska busslinjerna eller platserna.
              <br><br>
              Exempelvis:
             <ul>
               <li><i>Hej, är det här buss 540?</i> -> <i>Hej, är det här buss #busslinje?</i></li>
               <li><i>Hej, går den här bussen till KTH?</i> -> <i>Hej, går den här bussen till #plats?</i></li>
             </ul>
            </p>
            <h3>Starta en ny konversation!</h3>
            <p>
              Du ska nu starta en ny konversation med en busschaufför! Du väljer själv vad du vill
              säga, men börja gärna med en hälsningsfras tillsammans med en inledande fråga.
            </p>
            <h3>Fortsätt på en existerande konversation!</h3>
            <p>
              Du ska nu fortsätta på en existerande konversation! Läs igenom vad som har sagts
              tidigare i konversationen och fundera på hur en naturlig fortsättning skulle låta.
              Om du känner att resenären inte har fått tillräcklig information kan du fortsätta fråga,
              eller så kan du välja att inte fråga något mer och avsluta konversationen.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-Primary" data-dismiss="modal">Stäng</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="(counter >= 1)">
      <br>
      <button type="button" v-on:click="goToNextStep()" class="btn btn-success btn-lg btn-block">
        Gå vidare
      </button>
    </div>
    <div v-else>
      <br>
      <button type="button" class="btn btn-success btn-lg btn-block" disabled>
        {{ this.counter }}/1
      </button>
    </div>
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
    counter: 0,
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
          this.status = `status-error-${!resp.ok}`;
          resp.text().then((text) => {
            this.statusText = `${text} \n ${this.utterance}`;

            this.utterance = '';
          });

          if (resp.ok) return resp;
          throw resp;
        })
        .then(() => {
          this.fetchDialogue();
          this.counter += 1;
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
          } else {
            this.responseTo = null;
          }
        })
        .catch(console.error);
    },
    goToNextStep() {
      this.$router.push({
        path: 'judge',
      });
    },
  },
  created() {
    this.fetchDialogue();
  },
};
</script>
