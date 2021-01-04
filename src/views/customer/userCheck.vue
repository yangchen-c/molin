<template>
  <div id="app">
    <div class="btn">
      <el-input v-model="listQuery.idCard" placeholder="请输入用户身份证" clearable style="width: 180px" />
      <!-- <el-input v-model="listQuery.phone" placeholder="请输入手机号" clearable style="width: 180px" /> -->
      <!-- <el-input v-model="listQuery.realName" placeholder="请输入用户姓名" clearable style="width: 180px" -->
        <!-- @keyup.enter.native="getList" /> -->
      <el-button type="primary" @click="getList()">搜索</el-button>
    </div>
    <div class="tablee">
      <el-table :data="tableData" border style="width: 100%" v-loading="pictLoading">
        <el-table-column align="center" prop="id" label="ID" width="50" />
        <el-table-column align="center" prop="userId.realName" label="真实姓名" />
        <el-table-column align="center" prop="idCard" label="身份证" />
        <el-table-column align="center" prop="front" label="身份证正面">
          <template slot-scope="scope">
            <img :src="scope.row.front" alt style="width:50px;height:50px">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="back" label="身份证反面">
          <template slot-scope="scope">
            <img :src="scope.row.back" alt style="width:50px;height:50px">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="state" label="审核状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.state == '0'">未审核</el-tag>
            <el-tag type="danger" v-if="scope.row.state == '1'">通过</el-tag>
            <el-tag type="danger" v-if="scope.row.state == '2'">不通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="shopId" label="所属会馆">
          <template slot-scope="scope">
            <el-tag>{{scope.row.userId.shopId.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="提交时间" />
        <el-table-column align="center" prop="approvedTime" label="审核时间" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-document-copy" type="primary" @click="getEditData(scope.row)">审核资料
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
        @pagination="getList" />
    </div>
    <!-- dialog弹出框 -->
    <el-dialog :title="title1" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="真实姓名" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="form.userId.realName" placeholder="" style="width: 400px" />
        </el-form-item>
        <el-form-item label="身份证号" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="form.idCard" placeholder="" style="width: 400px" />
        </el-form-item>
        <el-form-item label="提交时间" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="form.createTime" placeholder="" style="width: 400px" />
        </el-form-item>
        <el-form-item label="审核时间" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="form.approvedTime" placeholder="" style="width: 400px" />
        </el-form-item>
        <el-form-item label="身份证正面" :label-width="formLabelWidth">
          <img v-if="form.front" :src="form.front" class="avatar" />
          <i v-else class="el-icon-s-custom avatar-uploader-icon" />
        </el-form-item>
        <el-form-item label="身份证反面" :label-width="formLabelWidth">
          <img v-if="form.back" :src="form.back" class="avatar" />
          <i v-else class="el-icon-s-custom avatar-uploader-icon" />
        </el-form-item>
        <el-form-item label="审核状态" :label-width="formLabelWidth">
          <el-select v-model="valueState" clearable placeholder="请选择" @change="selectChanged">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="不通过理由" :label-width="formLabelWidth">
          <el-select v-model="valueReason" clearable placeholder="请选择" @change="selectChanged1">
            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
  import {
    uCheckList,
    uCheckAdd,
    uCheckUpdate,
  } from "@/api/api";
  import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
  export default {
    name: "Stafff",
    components: {
      Pagination
    },
    data() {
      return {
        valueState: '', //审核状态
        options: [{
          value: '0',
          label: '未审核'
        }, {
          value: '1',
          label: '通过'
        }, {
          value: '2',
          label: '不通过'
        }],


        valueReason: "", //审核不通过原因
        options1: [{
          value: '姓名与证件照不符',
          label: '姓名与证件照不符'
        }, {
          value: '性别与证件照不符',
          label: '性别与证件照不符'
        }, {
          value: '身份证号与证件照不符',
          label: '身份证号与证件照不符'
        }, {
          value: '身份证地址与证件照不符',
          label: '身份证地址与证件照不符'
        }, {
          value: '身份证照不清晰或有遮挡',
          label: '身份证照不清晰或有遮挡'
        }, {
          value: '视屏不清晰或语音内容有误',
          label: '视屏不清晰或语音内容有误'
        }, {
          value: '身份证已过有效期',
          label: '身份证已过有效期'
        }],


        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          idCard: "",
          realName: "",
          phone: "",
        },
        tel: "",
        name: "",
        btnLoading: false,
        pictLoading: true,
        name: "", // 会馆名称
        title1: "",
        // 表格数据
        tableData: [],
        dialogFormVisible: false,
        form: {
          id: '',
          state: '',
          createTime: '',
          approvedTime: '',
          front: '',
          back: '',
          userId: {
            realName: '',
            shopId: {
              id: ''
            }
          },
        },
        formLabelWidth: "100px",
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 审核状态选择
      selectChanged(value) {
        this.valueState = value
        console.log(this.valueState)
      },
      // 审核失败原因选择
      selectChanged1(value1) {
        this.valueReason = value1
        console.log(this.valueReason)
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
          idCard: this.listQuery.idCard !== "" ? this.listQuery.idCard : undefined,
          star: this.time1 !== "" ? this.time1 : undefined,
          end: this.time2 !== "" ? this.time2 : undefined,
        };
        uCheckList(params, params1).then((res) => {
          this.pictLoading = false
          this.tableData = res.data.data.currentList;
          this.total = res.data.data.totalRecords
        });
      },

      // 审核
      getEditData(data) {
        this.dialogFormVisible = true;
        this.form.id = data.id;
        this.form.idCard = data.idCard;
        this.form.createTime = data.createTime;
        this.form.approvedTime = data.approvedTime;
        this.form.front = data.front;
        this.form.back = data.back;
        this.form.userId.realName = data.userId.realName;
        // this.form.state = this.valueState;
        // this.form.reason = this.valueReason
        this.title1 = "审核资料";
      },
      // 编辑新增确定事件
      addSubmit() {
        // this.btnLoading = true
        const data = {
          id: this.form.id,
          state: this.valueState,
          reason: this.valueReason
        }
        if (this.form.id) {
          // uCheckUpdate(this.form)
          uCheckUpdate(data)
            .then(() => {
              this.$notify.success({
                title: "成功",
                message: "审核完成",
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
                message: "审核完成",
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
      width: 290px;
      height: 145px;
      display: block;
    }
  }

</style>
