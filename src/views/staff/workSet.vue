<template>
  <div id="app">
    <div class="btn">
      <el-button type="primary" @click="addShop">新建</el-button>
    </div>
    <div class="tablee">
      <el-table :data="tableData" border style="width: 100%" v-loading="pictLoading">
        <el-table-column align="center" prop="houseId" label="库号" width="50" />
        <el-table-column align="center" prop="name" label="名称" />
        <el-table-column align="center" prop="photo" label="列表图">
          <template slot-scope="scope">
            <img v-for="item in scope.row.photo.split(',')" :key="item.id" :src="item" alt
              style="width:50px;height:50px">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="startPrice" label="起拍价" />
        <el-table-column align="center" prop="currentPrice" label="转拍后的价格" />
        <el-table-column align="center" prop="sessionId.shopId.name" label="所属会馆" width="200">
          <template slot-scope="scope">
            <el-tag type="success">{{scope.row.sessionId.shopId.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sessionId.name" label="所属场次" width="200">
          <template slot-scope="scope">
            <el-tag type="success">{{scope.row.sessionId.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="state" label="状态" width="200">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.state == '0'">未上架</el-tag>
            <el-tag type="danger" v-if="scope.row.state == '1'">等待抢</el-tag>
            <el-tag type="danger" v-if="scope.row.state == '2'">正常出售</el-tag>
            <el-tag type="danger" v-if="scope.row.state == '3'">已售</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="userId.realName" label="卖家名称" width="200">
          <template slot-scope="scope">
            <el-tag>{{scope.row.userId.realName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-document-copy" type="primary" @click="getEditData(scope.row)">编辑
            </el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="delData(scope.row)">删除</el-button>
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
          <el-input v-model="form.houseId" placeholder="请输入库号" style="width: 400px" />
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" placeholder="请输入商品名称" style="width: 400px" />
        </el-form-item>
        <el-form-item label="起拍价" :label-width="formLabelWidth">
          <el-input v-model="form.startPrice" placeholder="请输入起拍价" style="width: 400px" />
        </el-form-item>
        <el-form-item label="转拍后的价格" :label-width="formLabelWidth">
          <el-input v-model="form.currentPrice" placeholder="请输入转拍后的价格" style="width: 400px" />
        </el-form-item>
        <el-form-item label="所属场次" :label-width="formLabelWidth">
          <el-select v-model="form.sessionId.id" clearable placeholder="请选择">
            <el-option v-for="item in tableData1" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- 设置商品参数 ------------------------------------------------------------------------------------>
        <el-form-item label="商品参数" :label-width="formLabelWidth">
          <el-button type="primary" @click="addShop1">新增商品参数</el-button>
          <el-button type="primary" @click="addSubmit2">清空商品参数</el-button>

          <el-table :data="paramsData" border style="width: 100%" v-loading="pictLoading1">
            <el-table-column align="center" prop="k" label="参数名" width="300" />
            <el-table-column align="center" prop="v" label="详情" />
            <!-- <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-document-copy" type="primary" @click="getEditData(scope.row)">编辑
                </el-button>
                <el-button size="mini" icon="el-icon-delete" type="danger" @click="delData(scope.row)">删除</el-button>
              </template>
            </el-table-column> -->
          </el-table>
          <el-dialog width="70%" title="商品参数" :visible.sync="innerVisible" append-to-body>
            <el-form :model="form1">
              <el-form-item label="参数名" :label-width="formLabelWidth">
                <el-input v-model="form1.k" placeholder="请输入参数名" style="width: 400px" />
              </el-form-item>
              <el-form-item label="详情" :label-width="formLabelWidth">
                <el-input v-model="form1.v" placeholder="请输入详情" style="width: 400px" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="innerVisible = false">取 消</el-button>
              <el-button type="primary" :loading="btnLoading" @click="addSubmit1">确 定</el-button>
            </div>
          </el-dialog>
        </el-form-item>
        <!-- 设置商品参数 ----------------------------------------------------------------------------------->

        <el-form-item label="商品列表图" :label-width="formLabelWidth">
          <el-upload :data="uploadData" :action="uploadPath" :on-success="handleGalleryUrl1" :on-remove="handleRemove1"
            :before-upload="beforeUploadGetKey" multiple accept=".jpg, .jpeg, .png, .gif" list-type="picture-card"
            :file-list="form.banner1">
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as qiniu from "qiniu-js";
  import {
    goodsList,
    goodsAdd,
    goodsUpdate,
    goodsDelete,
    uploadPath,
    sessionList,
  } from "@/api/api";
  import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

  export default {
    name: "Stafff",
    components: {
      Pagination
    },
    data() {
      return {
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          realName: "",
          phone: "",
        },
        options: [{
          value: '0',
          label: '展示'
        }, {
          value: '1',
          label: '不展示'
        }],
        uploadData: {
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
        innerVisible: false,
        form: {
          id: '',
          houseId: '',
          name: "",
          photo: "",
          photo1: [],
          state: '',
          startPrice: '',
          currentPrice: '',
          desc: '',
          sessionId: {
            shopId: {
              id: '',
              // name: ''
            }
          }
        },
        // 参数表单
        form1: {
          k: '',
          v: ''
        },
        formLabelWidth: "100px",
      };
    },
    created() {
      this.getList();
      this.getsessionList();
    },
    methods: {
      // 文件上传       

      // uploadUrl: function (response) {
      //   this.form.photo = "http://gvcdn.molinmall.cn/" + response.key;
      // },
      beforeUploadGetKey() { //每个文件上传之前 给它一个 名字
        this.uploadData.key = Date.parse(new Date());
      },

      handleGalleryUrl1(res, file, fileList) {
        // console.log(res)
        const banner = "http://gvcdn.molinmall.cn/" + res.key;
        this.form.photo1.push(banner)
        this.form.photo = this.form.photo1.join(',')

      },
      handleRemove1: function (file, fileList) {
        for (var i = 0; i < this.form.photo.length; i++) {
          // 这里存在两种情况
          // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
          //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
          // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
          var url
          if (file.response === undefined) {
            url = file.url
          } else {
            url = file.response.data.url
          }

          if (this.form.photo[i].url === url) {
            this.form.photo.splice(i, 1)
          }
        }
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
      getsessionList() {
        sessionList()
          .then((response) => {
            this.pictLoading = false;
            this.tableData1 = response.data.data;
          })
          .catch(() => {
            this.tableData1 = [];
          });
      },
      // 获取数据
      getList() {
        const params = {
          page: this.listQuery.page,
          size: this.listQuery.limit,
        };
        const params1 = {
          realName: this.listQuery.realName !== "" ? this.listQuery.realName : undefined,
          phone: this.listQuery.phone !== "" ? this.listQuery.phone : undefined,
        };
        goodsList(params, params1)
          .then((response) => {
            this.pictLoading = false;
            this.tableData = response.data.data.currentList;
            this.total = response.data.data.totalRecords
          })
        // .catch(() => {
        //   this.tableData = [];
        // });
      },
      // 新建参数
      addShop1() {
        this.innerVisible = true;
        this.form1.k = ''
        this.form1.v = ''
      },
      // 新增商品参数
      addSubmit1() {
        const desc1 = JSON.parse(this.form.desc)
        let key = this.form1.k
        let value = this.form1.v
        desc1[key] = value


        const params = {
          id: this.form.id,
          desc: JSON.stringify(desc1)
        }
        goodsUpdate(params)
          .then(() => {
            this.$notify.success({
              title: "成功",
              message: "参数成功",
            });
            // this.getEditData()
            this.getList();
            this.innerVisible = false;
            this.form.desc = JSON.stringify(desc1)
            var a = JSON.stringify(desc1)
            const map = JSON.parse(a)
            var keys = []
            for (var key in map) {
              var obj = new Object();
              obj['k'] = key
              obj['v'] = map[key]
              keys.push(obj)
            }
            this.paramsData = keys
            // this.dialogFormVisible = false;

          })
          .catch((response) => {
            this.$notify.error({
              title: "失败",
              // message: response.data.message,
            });
          });
      },
      // 清空商品参数
      addSubmit2() {
        const params = {
          id: this.form.id,
          desc: '{}'
        }
        goodsUpdate(params)
          .then(() => {
            this.$notify.success({
              title: "成功",
              message: "清除成功",
            });
            this.innerVisible = false;
            this.dialogFormVisible = false;
            this.getList();
          })
          .catch((response) => {
            this.$notify.error({
              title: "失败",
              message: response.data.message,
            });
          });
      },
      // 新建
      addShop() {
        this.dialogFormVisible = true;
        this.form.houseId = "";
        this.form.name = "";
        this.form.id = "";
        this.form.photo = "";
        this.form.state = "";
        this.form.startPrice = "";
        this.form.currentPrice = "";
        this.form.sessionId.shopId.id = "";
        this.title1 = "新增商品";
      },
      // 编辑
      getEditData(data) {
        this.dialogFormVisible = true;
        this.form.houseId = data.houseId;
        this.form.name = data.name;
        this.form.id = data.id;
        this.form.photo = data.photo;
        this.form.state = data.state;
        this.form.startPrice = data.startPrice;
        this.form.currentPrice = data.currentPrice;
        this.form.sessionId.shopId.id = data.sessionId.shopId.id;
        this.form.desc = data.desc;
        var a = data.desc
        const map = JSON.parse(a)
        var keys = []
        for (var key in map) {
          var obj = new Object();
          obj['k'] = key
          obj['v'] = map[key]
          keys.push(obj)
        }
        this.paramsData = keys
        // console.log(this.paramsData)
        this.title1 = "编辑商品";
      },
      // 编辑新增确定事件
      addSubmit() {
        // this.btnLoading = true
        if (this.form.id) {
          goodsUpdate(this.form)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "商品修改成功",
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
        } else {
          goodsAdd(this.form)
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
            goodsDelete(params)
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
