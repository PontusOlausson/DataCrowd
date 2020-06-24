
<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center">
    <h1>Generate an utterance!</h1>
    <h2>{{ this.status }}</h2>
    <form id="genUttrForm">
      <input class="form-control" type="text" v-model="utterance" required autofocus />
      <input class="btn btn-default" type="button"
       v-on:click="submitUtterance()" value="Submit" />
    </form>
  </div>
</template>

<script>
export default {
  name: 'GenerateUtterance',
  components: {},
  data: () => ({
    utterance: '',
    status: '',
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
        }),
      })
        .then((resp) => {
          if (resp.ok) return resp;
          resp.text().then((text) => {
            this.status = text;
            return text;
          });
          return resp;
        })
        .then(() => {

        })
        .catch((error) => {
          throw error;
        });

      document.getElementById('genUttrForm').reset();
    },
  },
};
</script>
