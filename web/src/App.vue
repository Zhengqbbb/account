<template>
  <div id="app">
    <div class="left"></div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class App extends Vue {}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
.left {
  float: left;
  height: 100vh;
  width: 200px;
}
</style>
