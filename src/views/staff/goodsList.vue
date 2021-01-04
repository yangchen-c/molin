<template>
  <div id="app">
    <div class="btn">
      <!-- <el-button type="primary" @click="addShop">新建</el-button> -->
      <el-input v-model="listQuery.goodName" placeholder="请输入商品名称" clearable style="width: 180px" />
      <el-input v-model="listQuery.goodHouseId" placeholder="请输入商品库号" clearable style="width: 180px" />
      <el-input v-model="listQuery.userId" placeholder="请输入持有者ID" clearable style="width: 180px" />
      <el-input v-model="listQuery.appointBuyUser" placeholder="请输入指定买家ID" clearable style="width: 180px" />
      <el-select v-model="valueTableData11" placeholder="请选择会馆" @change="changeState($event)" clearable>
        <el-option v-for="item in tableData11" :key="item.id" :label="item.name" :value="item.name">
        </el-option>
      </el-select>
      <el-select v-model="valueTableData1" placeholder="请选择场次" @change="changeState1($event)" clearable>
        <el-option v-for="item in tableData1" :key="item.id" :label="item.name" :value="item.name">
        </el-option>
      </el-select>
      <el-date-picker v-model="valueDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
        @change="changeDate($event)">
      </el-date-picker>
      <el-select v-model="valuePrice" placeholder="请选择价格排序" @change="changeStatePrice($event)">
        <el-option v-for="item in optionsPrice" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" @click="getList()">搜索</el-button>
    </div>
    <div class="tablee">
      <el-table :data="tableData" border style="width: 100%" v-loading="pictLoading">
        <el-table-column align="center" prop="id" label="ID" width="50" />
        <el-table-column align="center" prop="goodHouseId" label="库号" width="50" />
        <el-table-column align="center" prop="goodName" label="名称" width="150" />
        <el-table-column align="center" prop="goodShow" label="列表图">
          <template slot-scope="scope">
            <img :src="scope.row.goodShow" alt style="width:50px;height:50px">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goodPrice" label="价格" />
        <el-table-column align="center" prop="shopName" label="所属会馆" width="200">
          <template slot-scope="scope">
            <el-tag type="success">{{scope.row.shopName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sessionName" label="所属场次" width="200">
          <template slot-scope="scope">
            <el-tag type="success">{{scope.row.sessionName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="state" label="状态" width="200">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.state == '0'">上架待被买</el-tag>
            <el-tag type="danger" v-if="scope.row.state == '1'">已售</el-tag>
            <el-tag type="danger" v-if="scope.row.state == '2'">下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="auctionDate" label="拍卖日期" />
        <el-table-column align="center" prop="appointBuyUser" label="指定买家ID" />
        <el-table-column align="center" prop="isMaterial" label="是否提货" width="200">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isMaterial == '0'">提货或转拍</el-tag>
            <el-tag type="danger" v-if="scope.row.isMaterial == '1'">提货</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="userId" label="持有者ID" />
        <el-table-column align="center" label="操作" width="350">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-document-copy" type="primary" @click="stateUp(scope.row)">上下架
            </el-button>
            <el-button size="mini" v-if="scope.row.state=='2'" icon="el-icon-document-copy" type="primary"
              @click="buyer(scope.row)">指定买家or提货
            </el-button>
            <el-button size="mini" v-if="scope.row.state=='2'" icon="el-icon-document-copy" type="primary"
              @click="getEditData(scope.row)">编辑
            </el-button>
            <!-- <el-button size="mini" icon="el-icon-delete" type="danger" @click="delData(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
        @pagination="getList" />
    </div>
    <!-- dialog弹出框 -->
    <el-dialog width="80%" :title="title1" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="库号" :label-width="formLabelWidth">
          <el-input v-model="form.goodHouseId" placeholder="请输入库号" style="width: 400px" :disabled="true" />
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="form.goodName" placeholder="请输入商品名称" style="width: 400px" :disabled="true" />
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="form.goodPrice" placeholder="请输入起拍价" style="width: 400px" :disabled="true" />
        </el-form-item>
        <el-form-item label="持有者ID" :label-width="formLabelWidth">
          <el-input v-model="form.userId" placeholder="请输入持有者ID" style="width: 400px" />
        </el-form-item>
        <el-form-item label="所属场次" :label-width="formLabelWidth">
          <el-select v-model="form.sessionId.id" clearable placeholder="请选择">
            <el-option v-for="item in tableData1" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="form.state" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拍卖日期" :label-width="formLabelWidth">
          <el-date-picker v-model="form.auctionDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上下架状态弹出框 -->
    <el-dialog width="30%" :title="title1" :visible.sync="dialogFormVisible2">
      <el-form :model="form">

        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="form.state" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 指定买家or提货弹出框 -->
    <el-dialog width="50%" :title="title1" :visible.sync="dialogFormVisible1">
      <el-form :model="form2">
        <el-form-item label="当前卖单ID" :label-width="formLabelWidth">
          <el-input v-model="form2.id" placeholder="请输入库号" style="width: 400px" :disabled="true" />
        </el-form-item>
        <el-form-item label="当前商品" :label-width="formLabelWidth">
          <el-input v-model="form2.goodName" placeholder="请输入商品名称" style="width: 400px" :disabled="true" />
        </el-form-item>
        <el-form-item label="当前卖单价格" :label-width="formLabelWidth">
          <el-input v-model="form2.goodPrice" placeholder="请输入当前卖单价格" style="width: 400px" :disabled="true" />
        </el-form-item>
        <el-form-item label="是否标记提货" :label-width="formLabelWidth">
          <el-switch v-model="form2.isMaterial" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="指定买家拍下" :label-width="formLabelWidth">
          <el-input v-model="form2.appointBuyUser" placeholder="请输入买家ID" style="width: 400px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="addSubmitBuy">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import * as qiniu from "qiniu-js";
  import {
    sgsList,
    sgsAdd,
    sgsUpdate,
    sgsDelete,
    uploadPath,
    sessionList1,
    shopList1, //所有会馆
  } from "@/api/api";
  import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

  export default {
    name: "Stafff",
    components: {
      Pagination
    },
    data() {
      return {
        // 会馆下拉筛选
        valueTableData1: '',
        tableData11: [],
        valueTableData11: '',
        // 时间筛选
        valueDate: '',
        // -----------------------------------
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          goodName: "",
          goodHouseId: "",
          userId: "",
          appointBuyUser: "",
        },
        options: [{
          value: '0',
          label: '上架待被买'
        }, {
          value: '2',
          label: '下架'
        }],
        valuePrice: '',
        optionsPrice: [{
          value: 'state1',
          label: '默认排序'
        }, {
          value: 'state2',
          label: '价格升序'
        }, {
          value: 'state3',
          label: '价格降序'
        }, ],
        num: '0',
        uploadData1: {
          //上传携带的额外参数
          // key: Date.parse(new Date()), //上传的文件名
          key: '',
          token: "o0LJCt2VuwyRhDWaphZRJfQcHbWGh79blp_UgjG4:kU4U_XCm_uNmVoBOKFOLmEFb8DA=:eyJzY29wZSI6InNsZWciLCJkZWFkbGluZSI6NDc0OTEwODM1MH0=", //后端生成的token
        },

        btnLoading: false,
        uploadPath,
        pictLoading: true,
        pictLoading1: false,
        name: "", // 会馆名称
        title1: "",
        // 表格数据
        tableData: [],
        tableData1: [], //场次数据
        paramsData: [], //参数数据
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        innerVisible: false,
        form: {
          id: '',
          goodHouseId: '',
          goodName: "",
          userId: '',
          goodShow: '',
          state: '',
          goodPrice: '',
          auctionDate: '',
          sessionId: {
            shopId: {
              id: '',
              name: ''
            }
          }
        },
        form2: {
          id: '',
          goodName: "",
          goodPrice: '',
          isMaterial: '',
          appointBuyUser: '',
        },
        formLabelWidth: "100px",
      };
    },
    created() {
      this.getList();
      this.getsessionList();
      this.getShopList(); //获取所有会馆
    },
    methods: {
      changeStatePrice(val) {
        if (val === 'state1') {
          this.num = 0
          this.getList()
        } else if (val === "state2") {
          this.num = 1
          this.getList()
        } else if (val === 'state3') {
          this.num = 2
          this.getList()
        } 
      },
      // 文件上传       
      // 列表图
      uploadUrl1: function (response) {
        this.form.show = "http://gvcdn.molinmall.cn/" + response.key;
      },
      // uploadUrl: function (response) {
      //   this.form.photo = "http://gvcdn.molinmall.cn/" + response.key;
      // },
      beforeUploadGetKey() { //每个文件上传之前 给它一个 名字
        this.uploadData.key = Date.parse(new Date());
      },
      checkFileSize: function (file) {
        if (file.size > 1048576) {
          this.$message.error(
            `${file.name}文件大于1024KB，请选择小于1024KB大小的图片`
          );
          return false;
        }
        return true;
      },
      // 获取会馆数据
      getShopList() {
        shopList1()
          .then((response) => {
            this.pictLoading = false;
            this.tableData11 = response.data.data;
          })
          .catch(() => {
            this.tableData11 = [];
          });
      },
      // 会馆筛选
      changeState(val) {
        // console.log(val)

        if (val === '') {
          this.tableData = this.tableDataAll
        } else if (val !== "") {
          this.tableData = this.tableDataAll.filter((el) => el.shopName === val)
        }
      },
      // 获取场次数据
      getsessionList() {
        sessionList1()
          .then((response) => {
            this.pictLoading = false;
            this.tableData1 = response.data.data;
          })
          .catch(() => {
            this.tableData1 = [];
          });
      },
      // 场次筛选
      changeState1(val) {
        // console.log(val)

        if (val === '') {
          this.tableData = this.tableDataAll
        } else if (val !== "") {
          this.tableData = this.tableDataAll.filter((el) => el.sessionName === val)
        }
      },
      // 日期筛选
      changeDate(val) {
        if (val === null) {
          this.tableData = this.tableDataAll
        } else if (val !== "") {
          this.tableData = this.tableDataAll.filter((el) => el.auctionDate === val)
        }
      },
      // 获取数据
      getList() {
        const params = {
          page: this.listQuery.page,
          size: this.listQuery.limit,
          num: this.num
        };
        const params1 = {
          goodName: this.listQuery.goodName !== "" ? this.listQuery.goodName : undefined,
          goodHouseId: this.listQuery.goodHouseId !== "" ? this.listQuery.goodHouseId : undefined,
          userId: this.listQuery.userId !== "" ? this.listQuery.userId : undefined,
          appointBuyUser: this.listQuery.appointBuyUser !== "" ? this.listQuery.appointBuyUser : undefined,
        };
        sgsList(params, params1)
          .then((response) => {
            this.pictLoading = false;
            this.tableData = response.data.data.currentList;
            this.tableDataAll = response.data.data.currentList;
            this.total = response.data.data.totalRecords
          })
        // .catch(() => {
        //   this.tableData = [];
        // });
      },

      // 新建
      addShop() {
        this.dialogFormVisible = true;
        this.form.goodHouseId = "";
        this.form.goodName = "";
        this.form.id = "";
        this.form.goodShow = "";
        this.form.state = "";
        this.form.goodPrice = "";
        this.form.userId = "";
        this.form.sessionId.shopId.id = "";
        this.title1 = "新增商品";
      },
      // 编辑
      getEditData(data) {
        this.dialogFormVisible = true;
        this.form.goodHouseId = data.goodHouseId;
        this.form.goodName = data.goodName;
        this.form.id = data.id;
        this.form.goodShow = data.goodShow;
        this.form.state = data.state;
        this.form.goodPrice = data.goodPrice;
        this.form.userId = data.userId;
        this.form.auctionDate = data.auctionDate;
        this.form.sessionId.shopId.id = data.sessionId.shopId.id;
        this.title1 = "编辑商品";
      },
      // 编辑上下架
      stateUp(data) {
        this.dialogFormVisible2 = true;
        this.form.goodHouseId = data.goodHouseId;
        this.form.goodName = data.goodName;
        this.form.id = data.id;
        this.form.goodShow = data.goodShow;
        this.form.state = data.state;
        this.form.goodPrice = data.goodPrice;
        this.form.userId = data.userId;
        this.form.auctionDate = data.auctionDate;
        this.form.sessionId.shopId.id = data.sessionId.shopId.id;
        this.title1 = "编辑上下架";
      },
      // 编辑新增确定事件
      addSubmit() {
        // this.btnLoading = true
        if (this.form.id) {
          sgsUpdate(this.form)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "商品修改成功",
              });
              this.dialogFormVisible = false;
              this.dialogFormVisible2 = false;
              this.getList();
            })
            .catch((response) => {
              this.$notify.error({
                title: "失败",
                message: response.data.message,
              });
            });
        } else {
          sgsAdd(this.form)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "商品添加成功",
              });
              this.dialogFormVisible = false;
              this.getList();
            })
            .catch((response) => {
              this.$notify.error({
                title: "失败",
                message: response.data.message,
              });
            });
        }
      },

      // 指定买家or提货
      // 编辑
      buyer(data) {
        this.dialogFormVisible1 = true;
        this.form2.goodName = data.goodName;
        this.form2.id = data.id;
        this.form2.goodPrice = data.goodPrice;
        this.form2.appointBuyUser = data.appointBuyUser;
        this.form2.isMaterial = data.isMaterial;

        this.title1 = "指定买家or提货";
      },
      addSubmitBuy() {
        // this.btnLoading = true
        if (this.form2.id) {
          sgsUpdate(this.form2)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "商品修改成功",
              });
              this.dialogFormVisible1 = false;
              this.getList();
            })
            .catch((response) => {
              this.$notify.error({
                title: "失败",
                message: response.data.message,
              });
            });
        }
      },
      // 删除
      delData(row) {
        this.$confirm("此操作将永久删除该会馆, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            const params = {
              id: row.id,
            };
            sgsDelete(params)
              .then((response) => {
                this.$notify.success({
                  title: "成功",
                  message: "商品删除成功",
                });
                this.getList();
              })
              .catch((response) => {
                this.$notify.error({
                  title: "失败",
                  message: response.data.message,
                });
              });
          })
          .catch(() => {
            this.$notify.error({
              title: "取消",
              message: "已取消删除",
            });
          });
      },
    },
  };

</script>

<style lang="less" scoped>
  @rem: 1920/100rem;

  #app {
    box-sizing: border-box;
    padding-left: 30 / @rem;
    padding-top: 30 / @rem;

    .tablee {
      margin-top: 20 / @rem;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }

    .avatar {
      width: 145px;
      height: 145px;
      display: block;
    }
  }

</style>
