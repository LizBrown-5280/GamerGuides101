<template>
  <div>
    <header-component></header-component>
    <main-component></main-component>
    <footer-component></footer-component>
  </div>
</template>

<script>
import {HeaderComponent, MainComponent, FooterComponent} from '@/components/main'

export default {
  components: {
    HeaderComponent,
    MainComponent,
    FooterComponent
  }
}
</script>

<style lang="scss">
</style>
