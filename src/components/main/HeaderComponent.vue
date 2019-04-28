<template>
  <header>
    <div class="container">
      <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
        <ul class="nav navbar-nav">
          <!-- !!!! Originally bound the :to attr to computed prop why? for security purposes ???? -->
          <!-- active-class can be set globally vua the linkActiveClass router constrctor option
              https://router.vuejs.org/api/#tag https://router.vuejs.org/api/#router-construction-options -->
          <router-link class="nav-link" tag="li" active-class="active" exact to="/" ><a>Home</a></router-link>
          <router-link class="nav-link" tag="li" active-class="active" to="/guildwars2"><a>GuildWars2</a></router-link>
          <router-link class="nav-link" tag="li" active-class="active" to="/about"><a>About</a></router-link>

          <!-- 8/3/18 Removed @click.native..., not sure what my intentions were, but links seem to work fine without them. -->
          <!-- https://vuejs.org/v2/api/#v-on  -->
          <!-- <router-link class="nav-link" tag="li" active-class="active" @click.native="gw2Clicked = false" exact to="/" ><a>Home</a></router-link>
          <router-link class="nav-link" tag="li" active-class="active" @click.native="gw2Clicked = true" to="/guildwars2"><a>GuildWars2</a></router-link>
          <router-link class="nav-link" tag="li" active-class="active" @click.native="gw2Clicked = false" to="/about"><a>About</a></router-link> -->
        </ul>
      </nav>
      <div class="title">TC's Gamer Guides 101</div>
    </div>
  </header>
</template>

<script>
import router from '@/router'

export default {
  router
}
</script>

<style>
 .active > a {
    text-decoration: underline;
  }
  header {
    text-align: center;
  }
  header .title {
    margin-left: -251px;
    text-align: center;
    display: inline-block;
    width: 300px;
    height: 50px;
  }
  header .navbar {
    float: left;
    padding: 10px 0 0 0px;

  }
  header .title {
    color: white;
    font-size: 30px;
    text-align: center;
  }
</style>
