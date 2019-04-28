<template>
  <div id="app">
    <main-content class="mainContent"></main-content>
  </div>
</template>

<script>
import MainContent from './components/MainContent'

export default {
  name: 'app',
  components: {
    MainContent
  }
}
</script>

<style>
  body {
    background: #343a40;
  }
</style>
