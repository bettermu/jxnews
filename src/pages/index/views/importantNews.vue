<template>
    <div class="public-content">
        <div class="detail-con-wrap">
            <div class="public inner">
            <div class="title">
                <span class="location"></span>
                <span>当前位置：</span>
                <span>旅游服务 > </span>
                <span>泾县要闻</span>
            </div>
            <div class="table">
                <p class="tc">泾县要闻</p>
                <el-table
                        :data="newsList.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                        @row-click="toDetail"
                        style="width: 100%; cursor: pointer">
                    <el-table-column
                            prop="summary"
                            width="900">
                    </el-table-column>
                    <el-table-column
                            prop="viewNum"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            width="150">
                    </el-table-column>
                </el-table>
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="total, prev, pager, next"
                        :total="total"
                        background>
                </el-pagination>
            </div>
        </div>
            <div class="height-push"></div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
  import Footer from '../../../components/footer.vue'
  import { apiPath } from "../config.js"
  export default {
    name: "public",
    components: {
      Footer
    },
    data() {
      return {
        newsList: [],
        total: null,
        currentPage: 1,
        pageSize: 10
      }

    },
    created() {
      this.getNewsList();
    },
    methods: {
      //获取泾县要闻列表数据
      getNewsList(){
        this.showLoading();
        this.$axios.get(apiPath + "/tourismPageInterface/getYaoWenInfo").then((res)=>{
          this.closeLoading();
          let {code, msg, data} = res.data;
          if(code === 0){
            this.newsList = data[0].newsList;
            this.total = this.newsList.length;
          }
        })
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
      },
      handleSizeChange(size) {
        this.pageSize = size;
      },
      showLoading() {
        this.loadingInstance = this.$loading.service({});
      },
      closeLoading() {
        this.loadingInstance.close();
      },
      // toTs() {
      //   this.$router.push({ path: '/tourist' })
      // },
      toDetail(row) {
        let href = this.$router.resolve({
          name: "spotDetail",
          query: {
            id: row.id,
            type: '泾县要闻'
          }
        }).href;
        window.open(href, "_blank");
      }
    },
  }
</script>

<style scoped>
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
        height: 100%;
        background-color: #fff;
        padding: 20px 20px 80px;
    }

    .table p {
        font-family: PingFangSC-Semibold;
        font-size: 24px;
        font-weight: bold;
        font-stretch: normal;
        line-height: 30px;
        letter-spacing: 0;
        color: #292c2f;
    }

    .el-pagination {
        position: absolute;
        bottom: 30px;
        right: 10px;
    }

    /deep/.el-table,
    /deep/.el-table td, .el-table th.is-leaf {
        border: none;
    }

    /deep/.el-table .el-table__row td .cell {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 26px;
        letter-spacing: 0;
        color: #999;
    }

    /deep/.el-table .el-table__row td:first-child .cell {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        font-weight: bold;
        font-stretch: normal;
        line-height: 30px;
        letter-spacing: 0;
        color: #5b5b5b;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    /deep/.hover-row {
        background-color: #fff;
        box-shadow: 0 7px 35px 0 rgba(213, 213, 227, 0.3);
    }

    /deep/.el-table .el-table__row td:last-child .cell:before {
        content: '';
        display: inline-block;
        width: 16px;
        height: 11px;
        background: url("../../../assets/img/tourist/date1.png") 100% 100% no-repeat;
        margin-right: 15px;
    }

    /deep/.el-table .el-table__row td:nth-child(2) .cell:before {
        content: '';
        display: inline-block;
        width: 16px;
        height: 11px;
        background: url("../../../assets/img/tourist/click.png") 100% 100% no-repeat;
        margin-right: 15px;
    }

    /deep/.el-table:before {
        content: none;
    }
    /deep/.el-table th.is-leaf {
        border: none;
    }

    .detail-con-wrap {
        min-height: 100%;
        margin-bottom: -384px;
    }
</style>