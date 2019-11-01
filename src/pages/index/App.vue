<template>
  <div id="app">
    <Header></Header>
    
    
      
    <router-view class="app-main"></router-view>
    
     
    
  </div>
</template>

<script>
import Header from '../../components/header.vue'
import Footer from '../../components/footer.vue'
export default {
  name: 'app',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
  html,body {
    height:100%;
  }

  #app {
    height:100%;
  }

  
  .app-main {
    padding-top:66px;
    box-sizing:border-box;
    min-height:100%;
  }
</style>
