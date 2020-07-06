
<template>
<div class="text-box col-md-4 col-md-offset-4" style="text-align: left">
  <h2 style="text-align: center">Om arbetet</h2>
  <p>
    Först och främst, tack för att du är villig att hjälpa oss. Denna hemsida är en del i Christoffer Linnés och
    Pontus Olaussons kandidatexamensarbete och syftar att med hjälp av er generera konversationer mellan en fiktiv
    busschafför och resenär. Denna konversationsdata kommer användas för att träna en machine learning-modell för
    att undersöka hur bra man kan träna en dator att jobba som en busschafför.
  </p>
  <h3 >Hur går det till?</h3>
  <p>
    Du kommer att hjälpa till att generera konversationer genom en metod i tre delar. Det börjar med att du först
    ska (1) Generera en replik som resenär, (2) Bedöma en annan replik, och (3) Välja svar som busschafför. Hur detta ska göras
    förklaras på varje sida om du klickar på [?]-knappen.
  </p>
  <p>
    För att det ska bli tydligare: här kommer några exempel på färdiga konversationer mellan en resenär och en busschafför:
    <div class=flexBoxLogin>
      <ul>
      <li><i>Resenär: Min kompis hinner inte till den här bussen. När går nästa buss?</i></li>
      <li><i>Busschaufför: Nästa buss på den här linjen går klockan #tid.</i></li>
      <li><i>Resenär: Då tar jag den också.</i></li>
      <li><i>Busschaufför: Dialogen är klar</i></li>
      </ul>
      <ul>
      <li><i>Resenär: Hej, vet du vad slutstationen för buss #busslinje är?</i></li>
      <li><i>Busschaufför: Slutstationen för buss #busslinje är #plats.</i></li>
      <li><i>Resenär: Tack så mycket!</i></li>
      <li><i>Busschaufför: Kan jag hjälpa dig med något mer?</i></li>
      <li><i>Resenär: Nej, det är bra tack.</i></li>
      <li><i>Busschaufför: Dialogen är klar</i></li>
      </ul>
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
    Om du har något feedback eller om du undrar något, tveka inte att maila till oss:
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
