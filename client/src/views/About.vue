
<template>
<div class="text-box col-md-4 col-md-offset-4" style="text-align: left">
  <h2 style="text-align: center">Om arbetet</h2>
  <p>
    Först och främst, tack för att du är villig att hjälpa oss. Denna hemsida är en del i Christoffer Linnés och
    Pontus Olaussons kandidatexamensarbete och syftar att med hjälp av er generera konversationer mellan en fiktiv
    busschafför och resenär. Denna konversationsdata kommer användas för att träna en machine learning-modell för
    att undersöka hur bra man kan träna en dator att jobba som en busschafför.
  </p>
  <h3>Hur går det till?</h3>
  <p>
    Du kommer att hjälpa till att generera konversationer genom en metod i tre delar. Det börjar med att du först
    ska (1) Generera en replik som resenär, (2) Bedöma en annan replik, och (3) Välja svar som busschafför. Du kan
    gå igenom dessa steg hur många gånger som helst, ju fler gånger desto bättre data får vi. Första gången du går
    igenom varje steg, klicka gärna på <button type="button" class="btn btn-info btn-xs">?</button>-knappen för
    tydligare instruktioner.
  </p>
  <p>
    När du är i rollen av en resenär är din uppgift att försöka ta reda på saker om busslinjer genom att prata med och
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
  <p>
    För att det ska bli tydligare så kommer här några exempel på färdiga konversationer mellan en resenär och en busschafför:
    <div class="utteranceContainer">
      <div class="well" style="width:49%">
        <h5 class="userUtterance">Resenär: Hej, vet du vad slutstationen för buss #busslinje är?</h5>
        <h5 class="systemUtterance">Busschaufför: Slutstationen för buss #busslinje är #plats.</h5>
        <h5 class="userUtterance">Resenär: Tack så mycket!</h5>
        <h5 class="systemUtterance">Busschaufför: Kan jag hjälpa dig med något mer?</h5>
        <h5 class="userUtterance">Resenär: Nej, det är bra tack.</h5>
      </div>
      <div class="well" style="width:49%">
        <h5 class="userUtterance">Resenär: Min kompis hinner inte till den här bussen. När går nästa buss?</h5>
        <h5 class="systemUtterance">Busschaufför: Nästa buss på den här linjen går klockan #tid.</h5>
        <h5 class="userUtterance">Resenär: Då tar jag den också.</h5>
      </div>
    </div>
  </p>
  <h3>Varför har jag ett användarnamn?</h3>
  <p>
    Du har ett personligt användarnamn som du loggar in med innan du kan börja
    generera data. Användarnamnet är så att sidan kan hålla koll på vad du har gjort,
    så att du inte kommer bli ombedd att exempelvis rösta på repliker du har skrivit
    själv eller rösta på samma replik flera gånger.
  </p>
  <p>
    Om du har någon feedback eller om du undrar något, tveka inte att maila till oss:
    <br><b>Christoffer Linné, clinne@kth.se</b>
    <br><b>Pontus Olausson, polaus@kth.se</b>
  </p>
  <h3>
    Tack!
  </h3>
  <button type="button" v-on:click="start()" class="btn btn-success btn-lg">
      Börja
  </button>
  <br>
  <br>
  <br>
</div>
</template>

<script>
export default {
  name: 'About',
  components: {},
  data: () => ({
  }),
  methods: {
    start() {
      this.$router.push({
        path: 'genUttr',
      });
    },
  },
};
</script>
