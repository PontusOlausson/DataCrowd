
<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center" v-if="utterance">
    <h1>Fetched utterance to judge!</h1>
    <h2>{{ this.utterance.uttr }}</h2>
    <input class="btn btn-default" type="button"
     v-on:click="passJudgement(1)" value="Good" />
     <input class="btn btn-default" type="button"
      v-on:click="passJudgement(0)" value="Bad" />
  </div>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center" v-else>
    <h2>Seems like there is currently no utterance that you can judge :(</h2>
  </div>
</template>

<script>
export default {
  name: 'Judgement',
  components: {},
  data: () => ({
    utterance: null,
    status: '',
  }),
  methods: {
    fetchUtterance() {
      fetch('/api/getUtteranceForJudgement')
        .then(res => res.json())
        .then((data) => {
          this.utterance = data.utterance;
        })
        .catch(console.error);
    },
    passJudgement(score) {
      console.log('test');
      fetch('/api/passJudgement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uttrID: this.utterance.id,
          score: score,
        }),
      })
      .then((resp) => {
        if (resp.ok) {
          this.fetchUtterance();
        }
      })
      .catch(console.error);
    },
  },
  created() {
    this.fetchUtterance();
  },
};
</script>
