<template>
  <div id="app" class="rel">
    
    
    <router-view class="app-main"></router-view>
    
    
  </div>
</template>

<script>
export default {
  name: 'app',
  
}
</script>

<style>
  html,body {
    height:100%;
  }

  #app {
    height:100%;
    background:url('../../assets/img/person/person-bg.jpg') no-repeat;
    background-size:100%;
  }

  
</style>
