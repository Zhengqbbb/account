<template>
  <div class="main">
    <h2>记账本</h2>
    {{data}}
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component({})
export default class Main extends Vue {
  data = [];

  fetchData() {
    
  }

  created() {
    this.fetchData();
  }
}
</script>

<style scoped>
.main {
  height: 100vh;
  overflow: hidden;
}
</style>
