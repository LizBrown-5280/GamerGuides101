<template>
  <div>
    <h2> Account Statistics Page</h2>
    <p>To see your account stats enter in your ArenaNet GW2 API key in the input field below.  It can be retreived from here: <a href="https://account.arena.net/applications" target="_blank"> https://account.arena.net/applications</a>.</p>

    <input type="string" :value="apiKey" @change="setApiKey($event.target.value)" placeholder="Enter your GW2 API key here..."><br/>
    <span v-if="apiKeyErrorMsg" class="errorMsg">{{apiKeyErrorMsg}}</span>
    <hr />

    <!-- Tabbed navigation - each tab is made available if the API key provides authorization to that tab. -->
    <ul class="nav nav-tabs">
      <li v-for="(props, key) in getTabs" class="nav-item" :key="key">
        <a class="nav-link" :href="'#' + key" :class="{disabled: !props.permission, active: key === 'account' && props.permission}" data-toggle="tab">
          {{ key }}
        </a>
      </li>
    </ul>

    <!-- Panels - each panel is made available if the API key provides authorization to that panel. -->
    <div class="tab-content">
      <div class="tab-pane"  id="account" v-if="getTabs.account.permission" :class="{active: getTabs.account.permission}">
        <account-component></account-component>
      </div>
      <div class="tab-pane fade" id="builds" v-if="getTabs.builds.permission">
        <builds-component></builds-component>
      </div>
      <div class="tab-pane fade" id="characters"  v-if="getTabs.characters.permission">
        <characters-component></characters-component>
      </div>
      <div class="tab-pane fade" id="guilds" v-if="getTabs.guilds.permission">
        <guilds-component></guilds-component>
      </div>
      <div class="tab-pane fade" id="inventories" v-if="getTabs.inventories.permission">
        <inventories-component></inventories-component>
      </div>
      <div class="tab-pane fade" id="progression" v-if="getTabs.progression.permission">
        <progression-component></progression-component>
      </div>
      <div class="tab-pane fade" id="pvp" v-if="getTabs.pvp.permission">
        <pvp-component></pvp-component>
      </div>
      <div class="tab-pane fade" id="tradingpost" v-if="getTabs.tradingpost.permission">
        <trading-post-component></trading-post-component>
      </div>
      <div class="tab-pane fade" id="unlocks" v-if="getTabs.unlocks.permission">
        <unlocks-component></unlocks-component>
      </div>
      <div class="tab-pane fade" id="wallet"  v-if="getTabs.wallet.permission">
        <wallet-component></wallet-component>
      </div>
    </div>

  </div>
</template>

<script>
import {AccountComponent, BuildsComponent, CharactersComponent, GuildsComponent, InventoriesComponent, ProgressionComponent, PvpComponent, TabComponent, TradingPostComponent, UnlocksComponent, WalletComponent} from './gw2AccountComponents'
import {mapGetters, mapActions} from 'vuex'

export default {
  components: {
    AccountComponent, BuildsComponent, CharactersComponent, GuildsComponent, InventoriesComponent, ProgressionComponent, PvpComponent, TabComponent, TradingPostComponent, UnlocksComponent, WalletComponent
  },
  computed: {
    ...mapGetters({
      apiKey: 'getApiKey',
      apiKeyErrorMsg: 'getApiKeyErrorMsg',
      getTabs: 'getTabs'
    }),
    startingPage () {
      return 'account'
    }
  },
  methods: {
    ...mapActions(['setApiKey'])
  }
}
</script>

<style scoped lang="scss">
  .tab-content {
    max-height: 800px;
    overflow: auto;
  }
  .mainContent {
    background: #C3AF8C;
  }
  .disabled {
    cursor: context-menu;
  }
  label {
    width: 200px;
  }
  input {
    width: 100%;
    font-size: 0.75rem;
  }
  .errorMsg {
    font-size: 12px;
    color: red
  }
  .nav {
    margin-bottom: 30px;
  }
  .nav-link.active {
    color: white;
    background-color: rgba(255,255, 255, .4);
    border-color: #ddd #ddd #fff;
  }
</style>
