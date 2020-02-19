<template>
  <div id="app">
    <ImpactResults v-bind:scores="this.scores" v-bind:average="this.average" />
  </div>
</template>

<script>
import ImpactResults from './components/ImpactResults.vue'

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getImpacts = async () => {
  await sleep(1000);
  return {
    scores: [
      {
        name: "Browser",
        time: 12240,
        low: 45,
        high: 90,
        average: 76,
      },
      {
        name: "Slack",
        time: 10800,
        low: 60,
        high: 98,
        average: 74,
      },
      {
        name: "Signal",
        time: 7560,
        low: 60,
        high: 97,
        average: 72,
      },
      {
        name: "Power Point",
        time: 7200,
        low: 60,
        high: 100,
        average: 79,
      },
      {
        name: "Calculator",
        time: 6840,
        low: 35,
        high: 80,
        average: 62,
      },
      {
        name: "Figma",
        time: 900,
        low: 50,
        high: 85,
        average: 77,
      },
      {
        name: "Google Docs",
        time: 780,
        low: 35,
        high: 80,
        average: 59,
      },
      {
        name: "Settings",
        time: 300,
        low: 30,
        high: 80,
        average: 67,
      }
    ],
    finalResult: 73
  }
}

export default {
  name: 'App',
  components: {
    ImpactResults
  },
  data: () => ({
    loading: false,
    scores: [],
    average: 0,
  }),
  created() {
    this.getImpactsFromAPI()
  },
  methods: {
    async getImpactsFromAPI() {
      this.loading = true;
      getImpacts()
        .then(data => {
          this.loading = false;
          this.scores = data.scores;
          this.average = data.finalResult;
        })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
