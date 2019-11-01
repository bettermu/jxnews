<template>
    <div class="public-content">
        <div class="detail-con-wrap">
            <div class="public inner">
            <div class="title">
                <span class="location"></span>
                <span>当前位置：</span>
                <span @click="toTs()">旅游服务 > </span>
                <span>火车时刻表</span>
            </div>
            <div class="table">
                <p class="tc">火车时刻表</p>
                <div class="search-wrap clearfix">
                    <div class="input-wrap fl">
                        <el-input v-model="inputName" @keyup.enter.native="search" placeholder="请输入到达站点"></el-input>
                    </div>
                    <button class="search-btn cp fl" @click="search"></button>
                </div>
                <div class="table-content">
                    <div class="table-header">
                        <ul class="clearfix">
                            <li class="tc fl">
                                <span>车次</span>
                            </li>
                            <li class="tc fl">
                                <span>出发站/到达站</span>
                            </li>
                            <li class="tc fl">
                                <span>类型</span>
                            </li>
                            <li class="tc fl">
                                <span :class="{ 'active': active }">发车时间</span>
                                <!--<span class="sort" @click="sortByDepart()"></span>-->
                            </li>
                            <li class="tc fl">
                                <span :class="{ 'active': active1 }">到达时间</span>
                                <!--<span class="sort" @click="sortByArrive()"></span>-->
                            </li>
                        </ul>
                    </div>
                    <div class="table-body">
                        <div v-show="!list.length" class="no-data tc c666">暂无数据</div>
                        <ul  v-show="list.length">
                            <li class="row" v-for="(item, index) in list" :key="index">
                                <div class="info">
                                    <ul>
                                        <li class="tc fl ell" :title="item.trainNum">{{ item.trainNum || '暂无车次' }}</li>
                                        <li class="tc fl ell" :title="item.departureStation + ' — ' + item.arrivalStation">{{ item.departureStation || '暂无出发站' }}—{{ item.arrivalStation || '暂无到达站' }}</li>
                                        <li class="tc fl">{{ item.trainType || '暂无类型' }}</li>
                                        <li class="tc fl">{{ item.drivingTime || '暂无开车时间' }}</li>
                                        <li class="tc fl">{{ item.arrivalTime || '暂无到达时间' }}</li>
                                    </ul>
                                </div>
                                <div class="station">
                                    <span class="tc">途径站点</span>
                                    <span>{{ item.halfwayStation || '暂无途径站点' | addArrow }}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
            <div class="height-push"></div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
  import { apiPath } from "../config.js";
  import Footer from "../../../components/footer.vue";
  export default {
    name: "trainTime",
    components: {
      Footer
    },
    data() {
      return {
        inputName: "",
        list: [],
        active: false,
        active1: false
      }
    },
    created() {
      this.getTrainTimeList();
    },
    methods: {
      //获取分类列表数据
      getTrainTimeList(){
        this.showLoading()
        this.$axios.get(apiPath + "/tourismPageInterface/getTrainTimeList").then((res)=>{
          this.closeLoading()
          let {code, msg ,data} = res.data
          if(code === 0){
            this.list = data;
          }
        })
      },
      //搜索
      search(){
        this.showLoading();
        this.$axios.get(apiPath + `/tourismPageInterface/getTrainTimeList?arrivalStation=${this.inputName}`).then((res)=>{
          this.closeLoading();
          let {code, msg ,data} = res.data
          if(code === 0){
            this.list = data;
          }
        })
      },
      toTs() {
        this.$router.push({ path: '/tourist' })
      },
      // sortByDepart() {
      //   this.active = true
      //   this.active1 = false
      // },
      // sortByArrive() {
      //   this.active = false
      //   this.active1 = true
      // },
      showLoading() {
        this.loadingInstance = this.$loading.service({});
      },
      closeLoading() {
        this.loadingInstance.close();
      }
    },
    filters: {
      addArrow(val) {
        let value = val.split(';');
          return value.join(' → ')
      }
    }
  }
</script>

<style scoped>
    .detail-con-wrap {
        min-height: 100%;
        margin-bottom: -384px;
        background: url("../../../assets/img/search/search-bg.jpg") center top repeat-y;
    }

    .active {
        color: #499ae7!important;
    }
    .public-content {
        height: 100%;
        background: url("../../../assets/img/search/search-bg.jpg") center top repeat-y;
    }

    .inner {
        width: 1200px;
        margin: 0 auto;
        box-sizing: border-box;
    }

    .public .title {
        height: 50px;
        line-height: 50px;
        color: #999;
        font-family: PingFangSC-Regular;
        font-size: 14px;
    }

    .public .title span {
        vertical-align: middle;
    }

    .public .title span:last-child {
        color: #6bace9;
    }

    .public .title .location {
        display: inline-block;
        width: 12px;
        height: 14px;
        background: url("../../../assets/img/location.png");
        margin-right: 10px;
    }

    .table {
        position: relative;
        width: 100%;
        min-height: 650px;
        background-color: #fff;
        padding: 20px;
    }

    .table p {
        font-family: PingFangSC-Semibold;
        font-size: 24px;
        font-weight: 700;
        font-stretch: normal;
        line-height: 30px;
        letter-spacing: 0;
        color: #292c2f;
        margin-bottom: 30px;
    }

    .search-wrap {
        width: 959px;
        margin: 20px auto 14px;
    }

    .input-wrap {
        width: 845px;
    }

    .search-btn {
        border:none;
        outline: none;
        height:64px;
        width:114px;
        border-top-right-radius: 32px;
        border-bottom-right-radius: 32px;
        background:url('../../../assets/img/search/search-btn-icon.png') center no-repeat #499ae7;
        box-shadow: 0 0 15px 1px #ccc;
    }

    /deep/.select-wrap .el-select .el-input__inner {
        border: none;
        height: 64px;
        width: 189px;
        line-height: 64px;
        border-right: 1px solid #ccc;
        border-top-left-radius: 32px;
        border-bottom-left-radius: 32px;
        text-align: center;
        font-size: 18px;
        color: #333;
        box-shadow: 0 0 15px 1px #ccc;
    }

    /deep/.el-input__inner {
        -webkit-appearance: none;
        background-color: #FFF;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: 0;
        padding: 0 15px;
        -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
        box-shadow: 0 0 15px 1px #ccc;
    }

    /deep/.el-input__inner {
        border-radius: 32px 0 0 32px;
        height: 64px;
        line-height: 64px;
        font-size: 18px;
        box-shadow: 0 0 15px 1px #ccc;
    }

    .table-header {
        margin-top: 30px;
    }

    .table-header ul li span {
        height: 17px;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        font-weight: bold;
        font-stretch: normal;
        line-height: 56px;
        letter-spacing: 0px;
        color: #292c2f;
    }

    .table-header ul li .sort {
        display: inline-block;
        width: 10px;
        height: 14px;
        background: url(../../../assets/img/sort.png) 100% 100% no-repeat;
        vertical-align: center;
        margin-left: 10px;
        cursor: pointer;
    }

    .table-header li,
    .table-body li div ul li {
        display: inline-block;
        width: 20%;
    }

    .table-header li:first-child,
    .table-body li div ul li:first-child {
        width: 18%;
        padding: 0 1%;
    }

    .table-body .info li,
    .table-body .station span {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        font-weight: bold;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #848484;
    }


    .table-body li .info {
        height: 55px;
        line-height: 55px;
    }

    .table-body li .station {
        line-height: 55px;
    }

    .table-body .row {
        border: 1px solid #efefef;
        margin-bottom: 10px;
    }

    .table-body .info {
        background-color: #f4f9fd;
    }

    .table-body .row .station span:first-child {
        display: inline-block;
        width: 20%;
        vertical-align: top;
    }

    .table-body .row .station span:last-child {
        display: inline-block;
        width: 68%;
        padding: 0 65px;
    }
</style>