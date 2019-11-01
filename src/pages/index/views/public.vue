<template>
    <div class="public-content">
        <div class="detail-con-wrap">

            <div class="public inner">
                <div class="title">
                    <span class="location"></span>
                    <span>当前位置：</span>
                    <span @click="toHome()">首页 > </span>
                    <span>公示公告</span>
                </div>
                <div class="table">
                    <p class="tc">公示公告</p>
                    <el-table
                            :data="list"
                            style="width: 100%; cursor: pointer"
                            @row-click="toDetail">
                        <el-table-column
                                prop="title"
                                :show-overflow-tooltip="true"
                                width="1050">
                        </el-table-column>
                        <!-- <el-table-column
                                prop="viewNum"
                                width="150">
                        </el-table-column> -->
                        <el-table-column
                                prop="createTime"
                                width="150">
                        </el-table-column>
                    </el-table>
                    <el-pagination
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
  import { apiPath } from "../config.js"
  import Footer from "../../../components/footer.vue";
  export default {
    name: "public",
    components: {
      Footer
    },
    data() {
      return {
        id: '',
        list: [],
        currentPage: 1,
        pageSize: 10,
        total: null
      }
    },
    created() {
      this.receiveQueryId();
      this.getPublicList();
    },
    methods: {
      receiveQueryId() {
        this.id = this.$route.query.id;
      },
      getPublicList() {
        this.showLoading();
        this.$axios
          .get(apiPath + `/websiteInfo/getTypeNewsPageList?page=${ this.currentPage }&size=${ this.pageSize }&typeid=${ this.id }`)
          .then(res => {
            this.closeLoading();
            let { data, code, msg } = res.data;
            if (code === 0) {
              this.list = data;
              this.total = res.data.count;
              }
          });
      },
      showLoading() {
        this.loadingInstance = this.$loading.service({});
      },
      closeLoading() {
        this.loadingInstance.close();
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.getPublicList();
      },
      toHome() {
        this.$router.push({ path: '/' })
      },
      toDetail(row) {
        let href = this.$router.resolve({
          path:'/publicDetail',
          query:{
            id: row.ncId
          }
        }).href
        window.open(href,"_blank")
      }
    }
  }
</script>

<style scoped>
    .public-content {
        height: 100%;
        
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
        background-color: #fff;
        padding: 20px 20px 50px;
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
        bottom: 10px;
        right: 35px;
    }

    /deep/.el-table,
    /deep/.el-table td,
    /deep/.el-table th.is-leaf {
        border: none;
    }

    /deep/.el-table:before {
        content: none;
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

    /deep/.el-table .el-table__row td:nth-child(2) .cell:before {
        content: '';
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url("../../../assets/img/tourist/click.png") 100% 100% no-repeat;
        margin-right: 10px;
    }

    /deep/.el-table .el-table__row td:last-child .cell:before {
        content: '';
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url("../../../assets/img/tourist/date1.png") 100% 100% no-repeat;
        margin-right: 10px;
    }

    /deep/.hover-row {
        background-color: #fff;
        box-shadow: 0 7px 35px 0 rgba(213, 213, 227, 0.3);
    }

    /deep/.el-table thead {
        display: none;
    }

    .detail-con-wrap {
        min-height: 100%;
        margin-bottom: -384px;
        background: url("../../../assets/img/search/search-bg.jpg") center top repeat-y;
    }
</style>