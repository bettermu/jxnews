<template>
  <div class="pano">
    <iframe class="pano-frame" v-bind:src="url" frameborder="0"></iframe>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from '../../../components/footer.vue'
export default {
  name: "panorama",
  components:{
    Footer
  },
  data() {
    return {
      url: ""
    };
  },

  mounted() {
    this.url = `http://10.4.186.162:8086/zhgl-web/views/index.jsp?piId=${this
      .$route.query.id || ""}`;
    //this.url = `http://ahjxly.iflysec.com/zhgl-web/views/index.jsp?piId=${this
    //  .$route.query.id || ""}`;
  }
};
</script>

<style scoped>
.pano {
  height: 100%;
}
.pano-frame {
  display: block;
  width: 100%;
  height: calc(100% - 100px);
}
</style>
