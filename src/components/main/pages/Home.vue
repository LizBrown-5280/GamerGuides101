<template>
  <div class="home">
    <section class="container">
      <h1>TC's Gamer Guides 101</h1>
    </section>

    <section class="cols container">
      <div class="col col1 container">
        <h2>Guild Wars 2</h2>
        <router-link class="nav-link" tag="li" active-class="active" exact :to="gw2accountstatsPath"><a>Account Stats</a> <span>July 23, 2018</span></router-link>
        <router-link class="nav-link" tag="li" active-class="active" exact :to="gw2wvwPath"><a>World v. World Rank List</a> <span>July 23, 2018</span></router-link>
      </div>
      <div class="col col2 container">
        <h2 class="noline">More to come later</h2>
      </div>
    </section>

  </div>
</template>

<script>
import router from '@/router'

export default {
  computed: {
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
  router
}
</script>

<style scoped lang="scss">
.home {
  background: url('../../../assets/img-bg/lionsArch.jpg') no-repeat;
  background-size: cover;
  color: rgb(25, 25, 25);
  border-radius: 5px;
  padding: 25px 10px 75px;
}
.home .container {
  background: rgba(255, 255,255, .8)
}
.cols.container {
  background-color: transparent;
  padding: 0;
}
.col {
  display: inline-block;
  width: 33%;
  vertical-align: top;
}
.col1 {
  height: 300px;
}
.col2 {
  width: 66%;
}
.br {
  border-right: 1px solid #343a40;
}
h2 {
  text-decoration: underline;
  font-size: 1.6rem;
}
h2.noline {
  text-decoration: none;
}
.nav-link {
  padding: .2rem 1rem;
}
.nav-link a {
  color: black;
}
.nav-link span {
  font-size: .60rem;
}
</style>
