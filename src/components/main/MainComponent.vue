<template>
  <main>
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
  </main>
</template>

<script>
import router from '@/router'

export default {
  router
}
</script>

<style scoped lang="scss">
    .slide-leave-active {
        transition: opacity 0.5s ease;
        opacity: 0;
        // animation: slide-out 1s ease-out forwards;
    }
    .slide-leave {
        opacity: 1;
        // transform: translateX(0);
    }
    .slide-enter-active {
        animation: slide-in 1s ease-out forwards;
        transition: opacity 1s ease;
        opacity: 1;
    }
    .slide-enter {
        opacity: 0;
    }
    @keyframes slide-out {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(-30px);
        }
    }
    @keyframes slide-in {
        0% {
            transform: translateY(-30px);
        }
        100% {
            transform: translateY(0);
        }
    }
</style>

<style>
    main .container {
        margin-top: 25px;
        color: rgb(50, 50, 50);
        border-radius: 5px;
        padding: 25px;
    }
</style>
