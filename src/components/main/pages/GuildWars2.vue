<template>
  <div class="gw2">
    <div class="wrap">
      <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
        <ul id="gw2Routes" class="nav navbar-nav">
          <!-- ?<router-link class="nav-link" tag="li" active-class="active" exact :to="gw2homePath"><a>GW2 Home</a></router-link> -->
          <router-link class="nav-link" tag="li" active-class="active" exact :to="gw2accountstatsPath"><a>Account Stats</a></router-link>
          <router-link class="nav-link" tag="li" active-class="active" exact :to="gw2wvwPath"><a>World v. World Rank List</a></router-link>
        </ul>
      </nav>
    </div>

    <div class="content container">
      <h1>Guild Wars 2 <span>(fansite)</span></h1>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>

    <footer class="gw2Footer gw2TextBg container">
      <div class="gw2Logos">
        <a href="https://www.arena.net/en"><img src="../../../assets/img-bg/ArenaNet_LogoFrgb_Sm250.jpg" width="140" /></a>
        <a href="https://www.guildwars2.com/en/"><img src="../../../assets/img-bg/GW2_Logo.png" width="140" /></a>
        <a href="https://heartofthorns.guildwars2.com/"> <img src="../../../assets/img-bg/GW2-HoT_Texture_Centered_Trans_R.png" width="140" /></a>
        <a href="https://www.guildwars2.com/en/path-of-fire/"> <img src="../../../assets/img-bg/GW2-PoF_Texture_Centered_Trans.png" width="140" /></a>
      </div>

      <p>&copy; 2015 ArenaNet, LLC. All rights reserved. NCSOFT, the interlocking NC logo, ArenaNet, Guild Wars, Guild Wars Factions,
      Guild Wars Nightfall, Guild Wars: Eye of the North, Guild Wars 2, Heart of Thorns, and all associated logos and designs are
      trademarks or registered trademarks of NCSOFT Corporation. All other trademarks are the property of their respective owners.</p>
    </footer>

  </div>
</template>

<script>
// !!!! the <router-view></router-view> needs to be commented out when working on this page
// !!!! seem to loop infinitely until "RangeError: Maximim call stack size exceeded."
// !!!! need to look into.  :(
import router from '@/router'
import {axiosGet} from '@/utils/axiosGet'
import {mapGetters} from 'vuex'
import {setPromises} from '@/utils/core'

export default {
  data () {
    return {
      startTime: new Date().getTime() / 1000
    }
  },
  computed: {
    ...mapGetters(['getProfessions', 'getRanks']),
    gw2homePath () {
      return '/guildwars2/gw2home'
    },
    gw2accountstatsPath () {
      return '/guildwars2/gw2accountstats'
    },
    gw2wvwPath () {
      return '/guildwars2/gw2wvw'
    }
  },
  router,
  methods: {
    storeData (result) {
      if (result.connectionSucceeded === true) {
        this.$store.commit('setGw2Data', result.storeAs)
      } else {
        console.log('Failed to ajax: ' + result.storeAs.dataType + '.' + result.storeAs.endpointGrp)
      }
    }
  },
  created () {
    //  This obj will be renamed at end of these chained Promises and used for the html <list-component> loop
    let listArrTemp = [
      {list: this.getProfessions, endpoint: 'professions'},
      {list: this.getRanks, endpoint: 'ranks', addtlPath: 'wvw/'}
    ]

    let promises = setPromises(listArrTemp)

    Promise.all(promises.map(list => axiosGet(list.endpointUrl, list.storeAs))).then((result) => {
      for (let i = 0; i < result.length; i++) {
        this.storeData(result[i])
      }
    })
  }
}
</script>

<style>
 .gw2 {
    background: url('../../../assets/img-bg/lionsArch.jpg') no-repeat;
    background-size: cover;
    padding-bottom: 75px;
  }
  .gw2 .wrap {
    background: rgb(52, 58, 64);
  }
  .gw2 .wrap nav {
    width: 1023px;
    margin: 0 auto;
    padding: 0 15px;
  }
  .content {
    background: rgba(56, 36, 15, .90);
  }
  .gw2 .content,
  .content a:link,
  .content a:visited,
  .btn-link,
  .btn-link:hover {
    color: white;
  }

  /* ***** CSS for Card Components ***** */
  /* *********************************** */
  .sortBtnWrap {
    padding: 15px 5px 5px 0;
  }
  h4 {
    margin: 30px 0 20px;
  }
  button.btn.btn-link {
    text-align: left;
  }
  .card, .card-body, .card-header {
    background-color: inherit;
  }
  .card-header {
    background: rgba(255, 255, 255, .1);
  }
  .card-header span {
    text-transform: none;
    font-size: 12px;
    color: orange;
  }
  .card-body {
    padding-top: 0px;
  }
  .card-body.x10 {
    width: 570px;
    margin: 0 auto;
    overflow-x: hidden !important;
    padding: 20px 5px !important;
  }
  .loaderWrap {
    float: right;
  }
   .loader {
    border: 2px solid #f3f3f3;
    border-radius: 50%;
    border-top: 2px solid #3498db;
    width: 20px;
    height: 20px;
    -webkit-animation: spin 2s linear infinite; /* Safari */
    animation: spin 2s linear infinite;
  }
  .dispInlineBlk {
    display: inline-block;
  }
  /* Safari */
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* ***** CSS for ItemComponent.vue .itemBox ***** */
  /* ********************************************** */
  .itemBox {
    border: 1px solid gray;
    border-radius: 3px;
    width: 52px;
    height: 52px;
    margin: 2px;
    display: inline-block;
    position: relative;
    vertical-align: bottom;
  }
  .def-na {
    font-size: 14px;
    background-color: rgba(0, 0, 0, .80);
    width: 50px;
    height: 50px;
    text-align: center;
    padding-top:10px;
    color: white;
  }
  .itemBgImg {
    width: 50px;
    height: 50px;
  }
  .itemBox img.locked {
    opacity: .3;
  }
    .itemBox img.locked:hover {
    opacity: 1;
  }
  /* Item Overlay */
  .overlay {
    position: absolute;
    top: 0px;
    right: 0px;
    color: white;
    font-size: 14px;
    background-color: rgb(56, 36, 15);
    border-radius: 25px;
    padding: 1px 2px;
  }
  #unlocks .overlay {
    background: transparent;
    bottom: 0px;
    left: 0px;
    right: initial;
    top: initial;
  }
  .overlay img {
    width: 15px;
  }
  .overlay img:hover {
    opacity: 1;
    width: 20px;
  }
  /* Item Popup */
  .itemDetailsPopup {
    position: absolute;
    top: 60px;
    left: -1px;
    display: none;
    width: 332px;
    background: rgba(0, 0, 0, .90);
    z-index: 10;
    border-radius: 3px;
    color: white;
    padding: 0 10px;
    font-size: 13px;
  }
  .itemBox:hover .itemDetailsPopup {
    display: block;
  }
  .grp .itemBox:nth-child(10n + 6) .itemDetailsPopup,
  .grp .itemBox:nth-child(10n + 7) .itemDetailsPopup,
  .grp .itemBox:nth-child(10n + 8) .itemDetailsPopup,
  .grp .itemBox:nth-child(10n + 9) .itemDetailsPopup,
  .grp .itemBox:nth-child(10n + 10) .itemDetailsPopup {
    left: auto;
    right: -1px;
  }
  .itemBox:nth-last-child(-1n + 30) .itemDetailsPopup {
    top: auto;
    bottom: 55px;
  }
  .grouped .itemBox:nth-last-child(-1n + 30) .itemDetailsPopup {
    top: 55px;
    bottom: auto;
  }
  #bankCard .itemBox:nth-child(30n + 31) {
    margin-top: 30px !important;
  }
  .itemDetailsPopup > div {
    margin: 10px 0;
  }
  .itemDetailsPopup .title img {
    width: 40px;
    height: 40px;
    border: 1px solid grey;
  }
  /* item text details */
  .nonEquipmentDetails li {
    margin-bottom: 5px;
  }
  .nonEquipmentDetails img {
    /* width: 37px;
    float: left;
    padding-bottom: 5px; */
  }
  .vendorValue img {
    width: 20px;
  }
  .iconColorWrap {
    width: 40px;
    height: 40px;
    display: inline-block;
    border: 1px solid gray;
  }
  .iconColorWrap img {
    width: 40px;
    height: 40px;
    border: 1px solid grey;
  }
  .title > div {
    display: inline-block;
    vertical-align: middle;
  }
  .title .name {
    font-weight: bold;
    padding: 0;
    margin: 0;
  }
  .setWidth {
    display: inline-block;
    width: 70px;
  }
  .missingX {
    color: red;
    width: 20px;
    height: 20px;
    display: inline-block;
    text-align: center;
  }
  li img {
    width: 20px;
  }
  ul, li {
    list-style-type: none;
    padding: 0;
  }
  .rarityBasic {
    color: white;
  }
  .rarityFine, .upgrades, .infusions {
    color: #007bff;
  }
  .rarityRare {
    color: yellow;
  }
  .rarityMasterwork {
    color: #279727;
  }
  .rarityExotic {
    color: #ffa315;
  }
  .rarityLegendary {
    color: rgb(198, 55, 255);
  }
  .borderRarityNone {
    color: grey;
  }
  .borderRarityBasic {
    border-color: white;
  }
  .borderRarityFine {
    border-color: #007bff;
  }
  .borderRarityRare {
    border-color: yellow;
  }
  .borderRarityMasterwork {
    border-color: #279727;
  }
  .borderRarityExotic {
    border-color: #ffa315;
  }
  .borderRarityLegendary {
    border-color: rgb(198, 55, 255);
  }
  .colorRed {
    color: pink
  }
  .vendorValue > img {
    width: 20px;
    height: 20px;
  }

  /* ***** Generic CSS***** */
  /* ********************** */
  .capitalize {
    text-transform: capitalize;
  }
</style>

<style scoped>
  .fixed-top {
    position: fixed;
    top: 43px;
    right: 0;
    left: 0;
    z-index: 1030;
  }
  .navbar {
    padding: 0rem 2rem .5rem 8.5rem
  }
  .nav-link {
    font-size: .75rem;
    padding: .1rem 1rem;
  }
  .gw2 footer {
    text-align: center;
    font-size: 11px;
    background: rgba(56, 36, 15, .90);
    color: white;
  }
  .gw2Logos {
    width: 580px;
    height: 115px;
    display: inline-block;
    margin: 0 auto 10px;
    background-color: white;
    border: 3px solid rgb(255, 255, 255, 03);
    border-radius: 5px;
  }
</style>
