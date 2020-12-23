<template lang="pug">
div(id="app")

  <router-view></router-view>

</template>

<script>

export default {
  name: 'App',

  created () {
    if (this.$route.path === '/') this.$router.push('/home')
  },
}

</script>

<style lang="scss">

</style>
