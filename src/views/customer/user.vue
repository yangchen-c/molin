<template>
  <div id="app" class="customer">
    <div class="btn">
      <el-button type="primary" @click="addShop">新建</el-button>
      <el-button type="info" @click="handleDownload">导出表格</el-button>
      <el-input v-model="listQuery.id" placeholder="请输入用户ID" clearable style="width: 180px; margin-left: 50px" />
      <el-input v-model="listQuery.phone" placeholder="请输入手机号" clearable style="width: 180px" />
      <el-input v-model="listQuery.realName" placeholder="请输入用户姓名" clearable style="width: 180px"
        @keyup.enter.native="getList" />
      <el-select v-model="valueState" placeholder="请选择用户状态" @change="changeState($event)">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker v-model="star" type="date" placeholder="选择注册日期" @change="starTime()" />
      <el-date-picker v-model="end" type="date" placeholder="选择日期" @change="starTime1()" />
      <el-button type="primary" @click="getList()">搜索</el-button>
    </div>
    <div class="all">总用户数：{{ this.total }}</div>
    <div class="tablee">
      <el-table :data="tableData" border style="width: 100%" v-loading="pictLoading">
        <el-table-column align="center" prop="id" label="ID" width="50" />
        <el-table-column align="center" prop="nickName" label="昵称" width="100" />
        <el-table-column align="center" prop="phone" label="注册手机号" width="130" />
        <el-table-column align="center" prop="parentId" label="推荐关系" />
        <el-table-column align="center" prop="aint" label="AINT余额" width="200" />
        <el-table-column align="center" prop="realName" label="真实姓名" width="200" />
        <!-- <el-table-column align="center" prop="shopName" label="归属分馆" width="200" /> -->
        <el-table-column align="center" prop="shopName" label="归属分馆" width="200">
          <template slot-scope="scope">
            <el-tag>{{scope.row.shopName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="idCard" label="身份证号" width="300" />
        <el-table-column align="center" prop="createTime" label="注册日期" width="300" />
        <el-table-column align="center" prop="aliPayId" label="支付宝账号" width="200" />
        <el-table-column align="center" prop="aliPayName" label="支付宝姓名" width="200" />
        <el-table-column align="center" prop="aliPayCode" label="支付宝收款截图">
          <el-popover placement="right" trigger="click" width="420" slot-scope="scope">
            <img :src="scope.row.aliPayCode" :alt="scope.row.aliPayCode" style="width: 400px;" />
            <img slot="reference" :src="scope.row.aliPayCode" :alt="scope.row.aliPayCode"
              style="max-height: auto;max-width: 50px;cursor: pointer;" />
          </el-popover>
        </el-table-column>
        <el-table-column align="center" prop="wxId" label="微信号" width="200" />
        <el-table-column align="center" prop="wxCode" label="微信收款截图">
          <el-popover placement="right" trigger="click" width="420" slot-scope="scope">
            <img :src="scope.row.wxCode" :alt="scope.row.wxCode" style="width: 400px;" />
            <img slot="reference" :src="scope.row.wxCode" :alt="scope.row.wxCode"
              style="max-height: auto;max-width: 50px;cursor: pointer;" />
          </el-popover>
        </el-table-column>
        <el-table-column align="center" prop="cardName" label="持卡人姓名" width="200" />
        <el-table-column align="center" prop="cardNumber" label="银行卡号" width="200" />
        <el-table-column align="center" label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-document-copy" type="primary" @click="getEditData(scope.row)">编辑
            </el-button>
            <el-button size="mini" icon="el-icon-document-copy" type="primary" @click="detail(scope.row)">余额更新
            </el-button>
            <el-button size="mini" icon="el-icon-office-building" type="success" @click="getAddress(scope.row)">收货地址
            </el-button>
            <el-button v-if="scope.row.buyLock=='0'" size="mini" icon="el-icon-lock" type="danger"
              @click="buyLock(scope.row)">限制抢拍</el-button>
            <el-button v-if="scope.row.buyLock=='1'" size="mini" icon="el-icon-unlock" type="warning"
              @click="buyLock1(scope.row)">解除抢拍限制</el-button>
            <el-button v-if="scope.row.state=='0'" size="mini" icon="el-icon-lock" type="danger"
              @click="state(scope.row)">限制登录</el-button>
            <el-button v-if="scope.row.state=='1'" size="mini" icon="el-icon-unlock" type="warning"
              @click="state1(scope.row)">解除登录限制</el-button>
            <el-button v-if="scope.row.transferLock=='0'" size="mini" icon="el-icon-lock" type="danger"
              @click="transferLock(scope.row)">限制资金转出</el-button>
            <el-button v-if="scope.row.transferLock=='1'" size="mini" icon="el-icon-unlock" type="warning"
              @click="transferLock1(scope.row)">解除资金转出限制</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
        @pagination="getList" />
    </div>
    <!-- 用户资料dialog弹出框 -->
    <el-dialog :title="title1" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户昵称" :label-width="formLabelWidth">
          <el-input v-model="form.nickName" placeholder="请输入用户昵称" style="width: 400px" />
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phone" placeholder="请输入手机号" style="width: 400px" maxlength="11" show-word-limit />
        </el-form-item>
        <el-form-item label="推荐关系" :label-width="formLabelWidth">
          <el-input v-model="form.parentId" placeholder="请输入推荐关系" style="width: 400px" />
        </el-form-item>
        <el-form-item label="余额" :label-width="formLabelWidth">
          <el-input v-model="form.aint" placeholder="请输入余额" style="width: 400px" />
        </el-form-item>
        <el-form-item label="真实姓名" :label-width="formLabelWidth">
          <el-input v-model="form.realName" placeholder="请输入真实姓名" style="width: 400px" />
        </el-form-item>
        <el-form-item label="身份证号" :label-width="formLabelWidth">
          <el-input v-model="form.idCard" placeholder="请输入身份证号" style="width: 400px" />
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" placeholder="请输入登录密码" style="width: 400px" />
        </el-form-item>
        <el-form-item label="交易密码" :label-width="formLabelWidth">
          <el-input v-model="form.businessPassword" placeholder="请输入交易密码" style="width: 400px" />
        </el-form-item>
        <el-form-item label="所属分管" :label-width="formLabelWidth">
          <!-- <el-select v-model="form.shopId.id" clearable placeholder="请选择"> -->
          <el-select v-model="form.shopName" clearable placeholder="请选择">
            <el-option v-for="item in tableData1" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="持卡人姓名" :label-width="formLabelWidth">
          <el-input v-model="form.cardName" placeholder="请输入持卡人姓名" style="width: 400px" />
        </el-form-item>
        <el-form-item label="银行卡号" :label-width="formLabelWidth">
          <el-input v-model="form.cardNumber" placeholder="请输入银行卡号" style="width: 400px" />
        </el-form-item>
        <el-form-item label="支付宝账号" :label-width="formLabelWidth">
          <el-input v-model="form.aliPayId" placeholder="请输入支付宝账号" style="width: 400px" />
        </el-form-item>
        <el-form-item label="支付宝姓名" :label-width="formLabelWidth">
          <el-input v-model="form.aliPayName" placeholder="请输入支付宝姓名" style="width: 400px" />
        </el-form-item>
        <el-form-item label="支付宝截图" :label-width="formLabelWidth">
          <el-upload :data="uploadData" :action="uploadPath" :show-file-list="false" :on-success="uploadUrl"
            :before-upload="checkFileSize" class="avatar-uploader" accept=".jpg, .jpeg, .png">
            <img v-if="form.aliPayCode" :src="form.aliPayCode" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过1024kb
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="微信号" :label-width="formLabelWidth">
          <el-input v-model="form.wxId" placeholder="请输入微信号" style="width: 400px" />
        </el-form-item>
        <el-form-item label="微信截图" :label-width="formLabelWidth">
          <el-upload :data="uploadData1" :action="uploadPath" :show-file-list="false" :on-success="uploadUrl1"
            :before-upload="checkFileSize" class="avatar-uploader" accept=".jpg, .jpeg, .png">
            <img v-if="form.wxCode" :src="form.wxCode" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过1024kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 收货地址弹出框 -->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible1" border>
      <el-table :data="gridData">
        <el-table-column property="createTime" label="日期" width="150"></el-table-column>
        <el-table-column property="receiveName" label="姓名" width="200"></el-table-column>
        <el-table-column property="receivePhone" label="电话" width="200"></el-table-column>
        <el-table-column property="area" label="地区"></el-table-column>
        <el-table-column property="site" label="地址"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 用户资料dialog弹出框 -->
    <el-dialog title="余额更新" :visible.sync="dialogFormVisible2">
      <el-form :model="form2">
        <el-form-item label="变更类型" :label-width="formLabelWidth">
          <el-select v-model="form2.typeDesc" placeholder="请选择变更类型">
            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="变更方式" :label-width="formLabelWidth">
          <el-select v-model="form2.sign" placeholder="请选择">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="变更数量" :label-width="formLabelWidth">
          <el-input v-model="form2.count" placeholder="请输入变更数量" style="width: 400px" />
        </el-form-item>
        <el-form-item label="变更备注" :label-width="formLabelWidth">
          <el-input v-model="form2.remark" placeholder="请输入变更备注" style="width: 400px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="addSubmit2">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as qiniu from "qiniu-js";

  import {
    userList,
    userAdd,
    userUpdate,
    shopList1,
    addressList,
    addressDelete,
    detailUpdate, //余额更新接口
    uploadPath,
  } from "@/api/api";
  // import tableC from '@/components/Table/index'
  import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

  export default {
    name: "Customer",

    components: {
      Pagination
    },
    data() {
      return {
        // 余额变更star
        form2: {
          userId: '',
          count: '',
          remark: "",
          typeDesc: "",
          // sign: "",
        },
        options1: [{
          value: '1',
          label: '委拍手续费'
        }, {
          value: '2',
          label: '站内转账'
        }, {
          value: '3',
          label: '系统发放'
        }, {
          value: '4',
          label: '流拍惩罚'
        }, {
          value: '5',
          label: '流拍补偿'
        }, {
          value: '6',
          label: '购买绿色通道'
        }],
        options2: [{
          value: '1',
          label: '增加'
        }, {
          value: '2',
          label: '减少'
        }],
        // 余额变更end
        uploadData: {
          //上传携带的额外参数
          key: Date.parse(new Date()), //上传的文件名
          token: "o0LJCt2VuwyRhDWaphZRJfQcHbWGh79blp_UgjG4:kU4U_XCm_uNmVoBOKFOLmEFb8DA=:eyJzY29wZSI6InNsZWciLCJkZWFkbGluZSI6NDc0OTEwODM1MH0=", //后端生成的token
        },
        uploadData1: {
          key: Date.parse(new Date()) + 1,
          token: "o0LJCt2VuwyRhDWaphZRJfQcHbWGh79blp_UgjG4:kU4U_XCm_uNmVoBOKFOLmEFb8DA=:eyJzY29wZSI6InNsZWciLCJkZWFkbGluZSI6NDc0OTEwODM1MH0=", //后端生成的token
        },
        uploadPath,
        star: '',
        // end: new Date(),
        end: '',
        time1: '',
        time2: '',
        valueState: '', //用户状态筛选
        options: [{
          value: 'state1',
          label: '全部用户'
        }, {
          value: 'state2',
          label: '抢拍被限'
        }, {
          value: 'state3',
          label: '登录被限'
        }, {
          value: 'state4',
          label: '资金转出被限'
        }],
        // 分页
        pictLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 5,
          id: "",
          realName: "",
          phone: "",
        },
        tel: "",
        name: "",
        tableData: [],
        tableData1: [],
        gridData: [],
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        formLabelWidth: "220px",
        title1: "",
        btnLoading: false,
        form: {
          nickName: "",
          phone: "",
          parentId: "",
          aint: "",
          realName: "",
          password: "",
          businessPassword: "",
          shopName: "",
          idCard: "",
          cardName: "",
          cardNumber: "",
          aliPayId: "",
          aliPayName: "",
          aliPayCode: "",
          wxId: "",
          wxCode: "",
        },
      };
    },
    created() {
      this.getList();
      this.getShopList();
    },
    methods: {
      // 余额star
      detail(data) {
        this.dialogFormVisible2 = true;
        this.form2.userId = data.id;
        this.form2.count = '';
        this.form2.remark = '';
      },
      addSubmit2() {
        if (this.form2.userId) {
          detailUpdate(this.form2)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "用户修改成功",
              });
              this.dialogFormVisible2 = false;
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
      // 余额end
      // 文件上传
      uploadUrl: function (response) {
        this.form.aliPayCode = "http://gvcdn.molinmall.cn/" + response.key;
      },
      uploadUrl1: function (response) {
        this.form.wxCode = "http://gvcdn.molinmall.cn/" + response.key;
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
      // 状态筛选
      changeState(val) {
        console.log(val)
        if (val === 'state1') {
          this.tableData = this.tableDataAll
        } else if (val === "state2") {
          this.tableData = this.tableDataAll.filter((el) => el.buyLock === 1)
        } else if (val === 'state3') {
          this.tableData = this.tableDataAll.filter((el) => el.state === 1)
        } else if (val === 'state4') {
          this.tableData = this.tableDataAll.filter((el) => el.transferLock === 1)
        }
      },
      // 获取收货地址
      getAddress(data) {
        const params = {
          id: data.id
        }
        // console.log(data.id)
        this.dialogFormVisible1 = true;
        addressList(params).then((res) => {
          this.gridData = res.data.data
          // console.log(res.data.data)
        })

      },
      // 获取会馆数据
      getShopList() {
        shopList1()
          .then((response) => {
            this.pictLoading = false;
            this.tableData1 = response.data.data;
          })
          .catch(() => {
            this.tableData1 = [];
          });
      },
      starTime() {
        this.time1 =
          this.star.getFullYear() +
          '-' +
          (this.star.getMonth() + 1 < 10 ?
            '0' + (this.star.getMonth() + 1) :
            this.star.getMonth() + 1) +
          '-' +
          (this.star.getDate() < 10 ?
            '0' + this.star.getDate() :
            this.star.getDate()) +
          ' ' +
          '00' +
          ':' +
          '00' +
          ':' +
          '00'
        console.log(this.time1)

      },
      starTime1() {
        this.time2 =
          this.end.getFullYear() +
          '-' +
          (this.end.getMonth() + 1 < 10 ?
            '0' + (this.end.getMonth() + 1) :
            this.end.getMonth() + 1) +
          '-' +
          (this.end.getDate() < 10 ?
            '0' + this.end.getDate() :
            this.end.getDate()) +
          ' ' +
          '23' +
          ':' +
          '59' +
          ':' +
          '59'
        console.log(this.time2)

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
          id: this.listQuery.id !== "" ? this.listQuery.id : undefined,
          star: this.time1 !== "" ? this.time1 : undefined,
          end: this.time2 !== "" ? this.time2 : undefined,
        };
        userList(params, params1).then((res) => {
          this.tableData = res.data.data.currentList;
          this.tableDataAll = res.data.data.currentList;
          this.total = res.data.data.totalRecords
        });
      },

      // 新增用户
      addShop() {
        this.dialogFormVisible = true;
        this.form.id = "";
        this.form.nickName = "";
        this.form.phone = "";
        this.form.parentId = "";
        this.form.aint = "";
        this.form.realName = "";
        this.form.password = "";
        this.form.businessPassword = "";
        this.form.shopName = "";
        this.form.idCard = "";
        this.form.cardName = "";
        this.form.cardNumber = "";
        this.form.aliPayId = "";
        this.form.aliPayName = "";
        this.form.aliPayCode = "";
        this.form.wxId = "";
        this.form.wxCode = "";
        this.title1 = "新增用户";
      },

      // 编辑
      getEditData(data) {
        this.dialogFormVisible = true;
        this.form.id = data.id;
        this.form.nickName = data.nickName;
        this.form.phone = data.phone;
        this.form.parentId = data.parentId;
        this.form.aint = data.aint;
        this.form.realName = data.realName;
        this.form.password = data.password;
        this.form.businessPassword = data.businessPassword;
        this.form.shopName = data.shopName;
        this.form.idCard = data.idCard;
        this.form.cardName = data.cardName;
        this.form.cardNumber = data.cardNumber;
        this.form.aliPayId = data.aliPayId;
        this.form.aliPayName = data.aliPayName;
        this.form.aliPayCode = data.aliPayCode;
        this.form.wxId = data.wxId;
        this.form.wxCode = data.wxCode;
        this.title1 = "编辑用户";
      },
      // 编辑新增确定事件
      addSubmit() {
        // this.btnLoading = true
        if (this.form.id) {
          userUpdate(this.form)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "用户修改成功",
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
          userAdd(this.form)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "用户添加成功",
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
      // 限制抢拍
      buyLock(row) {
        this.$confirm('此操作将限制用户抢拍, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            userUpdate({
                id: row.id,
                buyLock: '1'
              })
              .then((response) => {
                this.$notify.success({
                  title: '成功',
                  message: '限制成功'
                })
                this.getList()
              })
              .catch((response) => {
                this.$notify.error({
                  title: '失败',
                  message: response.data.message
                })
              })
          })
          .catch(() => {
            this.$notify.error({
              title: '取消',
              message: '已取消操作'
            })
          })
      },
      // 解除抢拍限制
      buyLock1(row) {
        this.$confirm('此操作将解除用户抢拍限制, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            userUpdate({
                id: row.id,
                buyLock: '0'
              })
              .then((response) => {
                this.$notify.success({
                  title: '成功',
                  message: '解除成功'
                })
                this.getList()
              })
              .catch((response) => {
                this.$notify.error({
                  title: '失败',
                  message: response.data.message
                })
              })
          })
          .catch(() => {
            this.$notify.error({
              title: '取消',
              message: '已取消操作'
            })
          })
      },
      // 限制资金转出
      transferLock(row) {
        this.$confirm('此操作将限制资金转出, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            userUpdate({
                id: row.id,
                transferLock: '1'
              })
              .then((response) => {
                this.$notify.success({
                  title: '成功',
                  message: '限制成功'
                })
                this.getList()
              })
              .catch((response) => {
                this.$notify.error({
                  title: '失败',
                  message: response.data.message
                })
              })
          })
          .catch(() => {
            this.$notify.error({
              title: '取消',
              message: '已取消操作'
            })
          })
      },
      // 解除资金转出限制
      transferLock1(row) {
        this.$confirm('此操作将解除资金转出限制, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            userUpdate({
                id: row.id,
                transferLock: '0'
              })
              .then((response) => {
                this.$notify.success({
                  title: '成功',
                  message: '解除成功'
                })
                this.getList()
              })
              .catch((response) => {
                this.$notify.error({
                  title: '失败',
                  message: response.data.message
                })
              })
          })
          .catch(() => {
            this.$notify.error({
              title: '取消',
              message: '已取消操作'
            })
          })
      },
      // 限制用户登录
      state(row) {
        this.$confirm('此操作将限制用户登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            userUpdate({
                id: row.id,
                state: '1'
              })
              .then((response) => {
                this.$notify.success({
                  title: '成功',
                  message: '限制成功'
                })
                this.getList()
              })
              .catch((response) => {
                this.$notify.error({
                  title: '失败',
                  message: response.data.message
                })
              })
          })
          .catch(() => {
            this.$notify.error({
              title: '取消',
              message: '已取消操作'
            })
          })
      },
      // 解除登录限制
      state1(row) {
        this.$confirm('此操作将解除登陆限制, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            userUpdate({
                id: row.id,
                state: '0'
              })
              .then((response) => {
                this.$notify.success({
                  title: '成功',
                  message: '解除成功'
                })
                this.getList()
              })
              .catch((response) => {
                this.$notify.error({
                  title: '失败',
                  message: response.data.message
                })
              })
          })
          .catch(() => {
            this.$notify.error({
              title: '取消',
              message: '已取消操作'
            })
          })
      },
      // 删除
      delData(row) {
        this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            const params = {
              id: row.id,
            };
            customerDelete(params)
              .then((response) => {
                this.$notify.success({
                  title: "成功",
                  message: "记录删除成功",
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
      // 导出表格
      handleDownload() {
        //   this.downloadLoading = true
        import("@/vendor/Export2Excel").then((excel) => {
          const tHeader = [
            "ID",
            "昵称",
            "注册手机号",
            "AINT余额",
            "真实姓名",
            "归属分馆",
            "注册日期",
          ];
          const filterVal = [
            "id",
            "nickName",
            "phone",
            "aint",
            "realName",
            "shopId.name",
            "createTime",
          ];
          excel.export_json_to_excel2(
            tHeader,
            this.tableData,
            filterVal,
            "客户管理"
          );
          this.downloadLoading = false;
        });
      },
    },
  };

</script>

<style lang="less">
  .customer {
    .el-button+.el-button {
      margin-left: 0 !important;
      margin-top: 5px;
    }
  }

</style>


<style lang="less" scoped>
  @rem: 1920/100rem;

  #app {
    box-sizing: border-box;
    padding-left: 30 / @rem;
    padding-top: 30 / @rem;

    .tablee {
      margin-top: 20 / @rem;
    }

    .all {
      margin-top: 20 / @rem;
      font-weight: 700;
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
