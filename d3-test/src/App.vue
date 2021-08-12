<template>
  <div id="app">
    <router-link to="/links"><button>Links</button></router-link>
    <router-link to="/bar"><button>Bar</button></router-link>
    <router-link to="/tree1"><button>tree1</button></router-link>
    <router-link to="/tree2"><button>tree2</button></router-link>
    <router-link to="/radialTidyTree"><button>radialTidyTree</button></router-link>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style scoped>
button {
  margin: 10px;
}
</style>
