(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7d88e253"],{"2d13":function(t,e,n){"use strict";var a=n("cf7e"),r=n.n(a);r.a},"333d":function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"pagination-container",class:{hidden:t.hidden}},[n("el-pagination",t._b({attrs:{background:t.background,"current-page":t.currentPage,"page-size":t.pageSize,layout:t.layout,total:t.total},on:{"update:currentPage":function(e){t.currentPage=e},"update:current-page":function(e){t.currentPage=e},"update:pageSize":function(e){t.pageSize=e},"update:page-size":function(e){t.pageSize=e},"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}},"el-pagination",t.$attrs,!1))],1)},r=[];n("c5f6");Math.easeInOutQuad=function(t,e,n,a){return t/=a/2,t<1?n/2*t*t+e:(t--,-n/2*(t*(t-2)-1)+e)};var i=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)}}();function o(t){document.documentElement.scrollTop=t,document.body.parentNode.scrollTop=t,document.body.scrollTop=t}function u(){return document.documentElement.scrollTop||document.body.parentNode.scrollTop||document.body.scrollTop}function l(t,e,n){var a=u(),r=t-a,l=20,c=0;e="undefined"===typeof e?500:e;var s=function t(){c+=l;var u=Math.easeInOutQuad(c,a,r,e);o(u),c<e?i(t):n&&"function"===typeof n&&n()};s()}var c={name:"Pagination",props:{total:{required:!0,type:Number},page:{type:Number,default:1},limit:{type:Number,default:20},pageSizes:{type:Array,default:function(){return[10,20,30,50]}},layout:{type:String,default:"total, sizes, prev, pager, next, jumper"},background:{type:Boolean,default:!0},autoScroll:{type:Boolean,default:!0},hidden:{type:Boolean,default:!1}},computed:{currentPage:{get:function(){return this.page},set:function(t){this.$emit("update:page",t)}},pageSize:{get:function(){return this.limit},set:function(t){this.$emit("update:limit",t)}}},methods:{handleSizeChange:function(t){this.$emit("pagination",{page:this.currentPage,limit:t}),this.autoScroll&&l(0,800)},handleCurrentChange:function(t){this.$emit("pagination",{page:t,limit:this.pageSize}),this.autoScroll&&l(0,800)}}},s=c,d=(n("2d13"),n("2877")),m=Object(d["a"])(s,a,r,!1,null,"2fc659d3",null);e["a"]=m.exports},"35ae":function(t,e,n){},"4ec3":function(t,e,n){"use strict";n.d(e,"G",(function(){return r})),n.d(e,"s",(function(){return i})),n.d(e,"q",(function(){return o})),n.d(e,"t",(function(){return u})),n.d(e,"r",(function(){return l})),n.d(e,"I",(function(){return c})),n.d(e,"H",(function(){return s})),n.d(e,"J",(function(){return d})),n.d(e,"a",(function(){return m})),n.d(e,"E",(function(){return p})),n.d(e,"F",(function(){return f})),n.d(e,"B",(function(){return g})),n.d(e,"C",(function(){return h})),n.d(e,"z",(function(){return b})),n.d(e,"D",(function(){return v})),n.d(e,"A",(function(){return y})),n.d(e,"w",(function(){return O})),n.d(e,"x",(function(){return _})),n.d(e,"u",(function(){return w})),n.d(e,"y",(function(){return j})),n.d(e,"v",(function(){return S})),n.d(e,"l",(function(){return k})),n.d(e,"j",(function(){return L})),n.d(e,"m",(function(){return z})),n.d(e,"k",(function(){return N})),n.d(e,"o",(function(){return x})),n.d(e,"i",(function(){return C})),n.d(e,"n",(function(){return $})),n.d(e,"p",(function(){return P})),n.d(e,"g",(function(){return D})),n.d(e,"f",(function(){return Q})),n.d(e,"h",(function(){return F}));var a=n("b775"),r="https://upload.qiniup.com/";function i(t){return Object(a["a"])({url:"user/loginManager",method:"get",params:t})}function o(t){return Object(a["a"])({url:"user/loginManager",method:"post",data:t})}function u(t){return Object(a["a"])({url:"user/loginManager",method:"put",data:t})}function l(t){return Object(a["a"])({url:"user/loginManager",method:"delete",params:t})}function c(t,e){return Object(a["a"])({url:"user/getPaging/".concat(t.page,"/").concat(t.size),method:"get",params:e})}function s(t){return Object(a["a"])({url:"user",method:"post",data:t})}function d(t){return Object(a["a"])({url:"user",method:"put",data:t})}function m(t){return Object(a["a"])({url:"address/getAddressList",method:"get",params:t})}function p(t,e){return Object(a["a"])({url:"examine/getPaging/".concat(t.page,"/").concat(t.size),method:"get",params:e})}function f(t){return Object(a["a"])({url:"examine",method:"put",data:t})}function g(t,e){return Object(a["a"])({url:"shop/getPaging/".concat(t.page,"/").concat(t.size),method:"get",params:e})}function h(t){return Object(a["a"])({url:"shop",method:"get",params:t})}function b(t){return Object(a["a"])({url:"shop",method:"post",data:t})}function v(t){return Object(a["a"])({url:"shop",method:"put",data:t})}function y(t){return Object(a["a"])({url:"shop",method:"delete",params:t})}function O(t,e){return Object(a["a"])({url:"session/getPaging/".concat(t.page,"/").concat(t.size),method:"get",params:e})}function _(t){return Object(a["a"])({url:"session",method:"get",params:t})}function w(t){return Object(a["a"])({url:"session",method:"post",data:t})}function j(t){return Object(a["a"])({url:"session",method:"put",data:t})}function S(t){return Object(a["a"])({url:"session",method:"delete",params:t})}function k(t,e){return Object(a["a"])({url:"good/getPaging/".concat(t.page,"/").concat(t.size),method:"get",params:e})}function L(t){return Object(a["a"])({url:"good",method:"post",data:t})}function z(t){return Object(a["a"])({url:"good",method:"put",data:t})}function N(t){return Object(a["a"])({url:"good",method:"delete",params:t})}function x(t,e){return Object(a["a"])({url:"order/getPaging/".concat(t.page,"/").concat(t.size),method:"get",params:e})}function C(t,e){return Object(a["a"])({url:"order/getPaging/".concat(t.page,"/").concat(t.size,"/").concat(t.num),method:"get",params:e})}function $(t){return Object(a["a"])({url:"order",method:"post",data:t})}function P(t){return Object(a["a"])({url:"order",method:"put",data:t})}function D(t,e){return Object(a["a"])({url:"coupon/getPaging/".concat(t.page,"/").concat(t.size),method:"get",params:e})}function Q(t){return Object(a["a"])({url:"coupon",method:"post",data:t})}function F(t){return Object(a["a"])({url:"coupon",method:"put",data:t})}},5417:function(t,e,n){"use strict";var a=n("b06e"),r=n.n(a);r.a},b06e:function(t,e,n){},cf7e:function(t,e,n){},e7fe:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"orderf",attrs:{id:"app"}},[n("div",{staticClass:"btn"},[n("el-button",{attrs:{type:"info"},on:{click:t.handleDownload}},[t._v("导出表格")]),t._v(" "),n("el-input",{staticStyle:{width:"180px"},attrs:{placeholder:"请输入用户姓名",clearable:""},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.getOrderList(e)}},model:{value:t.listQuery.realName,callback:function(e){t.$set(t.listQuery,"realName",e)},expression:"listQuery.realName"}}),t._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.getOrderList()}}},[t._v("搜索")]),t._v(" "),n("el-select",{attrs:{placeholder:"请选择订单状态"},on:{change:function(e){return t.changeState(e)}},model:{value:t.valueState,callback:function(e){t.valueState=e},expression:"valueState"}},t._l(t.options,(function(t){return n("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})})),1)],1),t._v(" "),n("div",{staticClass:"tablee"},[n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.pictLoading,expression:"pictLoading"}],staticStyle:{width:"100%"},attrs:{data:t.tableData,border:""}},[n("el-table-column",{attrs:{align:"center",prop:"id",label:"ID",width:"50"}}),t._v(" "),n("el-table-column",{attrs:{align:"center",prop:"materialId",label:"订单状态",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[0===e.row.state?n("el-tag",{attrs:{type:"success"}},[t._v("待付款")]):t._e(),t._v(" "),1===e.row.state?n("el-tag",{attrs:{type:"success"}},[t._v("已付款")]):t._e(),t._v(" "),2===e.row.state?n("el-tag",{attrs:{type:"success"}},[t._v("已完成/待转拍")]):t._e(),t._v(" "),3===e.row.state?n("el-tag",{attrs:{type:"danger"}},[t._v("已取消")]):t._e()]}}])}),t._v(" "),n("el-table-column",{attrs:{align:"center",prop:"orderGoodId",label:"商品信息"}}),t._v(" "),n("el-table-column",{attrs:{align:"center",prop:"saleUserName",label:"卖家"}}),t._v(" "),n("el-table-column",{attrs:{align:"center",prop:"saleUserPhone",label:"卖家电话"}}),t._v(" "),n("el-table-column",{attrs:{align:"center",prop:"buyUserName",label:"买家"}}),t._v(" "),n("el-table-column",{attrs:{align:"center",prop:"buyUserPhone",label:"买家电话"}}),t._v(" "),n("el-table-column",{attrs:{align:"center",prop:"price",label:"订单金额",width:"200"}}),t._v(" "),n("el-table-column",{attrs:{align:"center",prop:"goodId.houseId",label:"库号",width:"200"}}),t._v(" "),n("el-table-column",{attrs:{align:"center",prop:"shopName",label:"归属分馆",width:"200"}}),t._v(" "),n("el-table-column",{attrs:{align:"center",prop:"sessionName",label:"所属场次",width:"200"}}),t._v(" "),n("el-table-column",{attrs:{align:"center",prop:"goodId.name",label:"拍品标题",width:"200"}}),t._v(" "),n("el-table-column",{attrs:{align:"center",prop:"createTime",label:"注册日期",width:"200"}}),t._v(" "),n("el-table-column",{attrs:{align:"center",label:"操作",fixed:"right",width:"120"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button",{attrs:{size:"mini",icon:"el-icon-document-copy",type:"primary"},on:{click:function(n){return t.getEditData(e.row)}}},[t._v("编辑货运\n          ")])]}}])})],1),t._v(" "),n("pagination",{attrs:{total:t.total,page:t.listQuery.page,limit:t.listQuery.limit},on:{"update:page":function(e){return t.$set(t.listQuery,"page",e)},"update:limit":function(e){return t.$set(t.listQuery,"limit",e)},pagination:t.getOrderList}})],1),t._v(" "),n("el-dialog",{attrs:{title:t.title1,visible:t.dialogFormVisible},on:{"update:visible":function(e){t.dialogFormVisible=e}}},[n("el-form",{attrs:{model:t.form}},[n("el-form-item",{attrs:{label:"快递公司","label-width":t.formLabelWidth}},[n("el-input",{staticStyle:{width:"400px"},attrs:{placeholder:"请输入快递公司"},model:{value:t.form.serviceCompany,callback:function(e){t.$set(t.form,"serviceCompany",e)},expression:"form.serviceCompany"}})],1),t._v(" "),n("el-form-item",{attrs:{label:"快递单号","label-width":t.formLabelWidth}},[n("el-input",{staticStyle:{width:"400px"},attrs:{placeholder:"请输入快递单号"},model:{value:t.form.serviceNumber,callback:function(e){t.$set(t.form,"serviceNumber",e)},expression:"form.serviceNumber"}})],1)],1),t._v(" "),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:function(e){t.dialogFormVisible=!1}}},[t._v("取 消")]),t._v(" "),n("el-button",{attrs:{type:"primary",loading:t.btnLoading},on:{click:t.addSubmit}},[t._v("确 定")])],1)],1)],1)},r=[],i=n("4ec3"),o=n("333d"),u={name:"Customer",components:{Pagination:o["a"]},data:function(){return{timer:"",countdown:[],timer1:0,flag:!0,flag1:!1,valueState:"",options:[{value:"state1",label:"全部订单"},{value:"state2",label:"已提货"},{value:"state3",label:"待付款"},{value:"state4",label:"已付款"},{value:"state5",label:"已完成/待转拍"},{value:"state6",label:"已取消"}],num:"100",value:"",pictLoading:!0,total:0,listQuery:{page:1,limit:10,realName:"",phone:""},tel:"",name:"",tableData:[],tableData1:[],gridData:[],dialogFormVisible:!1,dialogFormVisible1:!1,formLabelWidth:"220px",title1:"",btnLoading:!1,form:{id:"",serviceCompany:"",serviceNumber:""}}},created:function(){this.getOrderList(),this.getShopList()},filters:{capitalize:function(t){var e=parseInt(t/3600),n=parseInt((t-3600*e)/60),a=t-3600*e-60*n,r=e<10?"0"+e:e,i=n<10?"0"+n:n,o=a<10?"0"+a:a;return r+":"+i+":"+o}},methods:{changeState:function(t){"state2"===t?(this.num=4,this.getOrderList()):"state1"===t?(this.num=100,this.getOrderList()):"state3"===t?(this.num=0,this.getOrderList()):"state4"===t?(this.num=1,this.getOrderList()):"state5"===t?(this.num=2,this.getOrderList()):"state6"===t&&(this.num=3,this.getOrderList())},getAddress:function(t){var e=this,n={id:t.id};this.dialogFormVisible1=!0,Object(i["a"])(n).then((function(t){e.gridData=t.data.data}))},getShopList:function(){var t=this;Object(i["C"])().then((function(e){t.pictLoading=!1,t.tableData1=e.data.data})).catch((function(){t.tableData1=[]}))},getOrderList:function(){var t=this,e={page:this.listQuery.page,size:this.listQuery.limit,num:this.num},n={realName:""!==this.listQuery.realName?this.listQuery.realName:void 0,phone:""!==this.listQuery.phone?this.listQuery.phone:void 0};Object(i["i"])(e,n).then((function(e){t.tableData=e.data.data.currentList,t.total=e.data.data.totalRecords}))},addShop:function(){this.dialogFormVisible=!0,this.form.id="",this.form.nickName="",this.form.phone="",this.title1="新增用户"},getEditData:function(t){this.dialogFormVisible=!0,this.form.id=t.id,this.form.serviceCompany=t.serviceCompany,this.form.serviceNumber=t.serviceNumber,this.title1="编辑货运"},addSubmit:function(){var t=this;this.form.id?Object(i["p"])(this.form).then((function(){t.$notify.success({title:"成功",message:"货运修改成功"}),t.dialogFormVisible=!1,t.getOrderList()})).catch((function(e){t.$notify.error({title:"失败",message:e.data.message})})):Object(i["n"])(this.form).then((function(){t.$notify.success({title:"成功",message:"货运添加成功"}),t.dialogFormVisible=!1,t.getOrderList()})).catch((function(e){t.$notify.error({title:"失败",message:e.data.message})}))},delData:function(t){var e=this;this.$confirm("此操作将永久删除该记录, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var n={id:t.id};customerDelete(n).then((function(t){e.$notify.success({title:"成功",message:"记录删除成功"}),e.getOrderList()})).catch((function(t){e.$notify.error({title:"失败",message:t.data.message})}))})).catch((function(){e.$notify.error({title:"取消",message:"已取消删除"})}))},handleDownload:function(){var t=this;Promise.all([n.e("chunk-86a68bf8"),n.e("chunk-581b2547")]).then(n.bind(null,"4bf8d")).then((function(e){var n=["ID","名称","联系电话","家庭住址","门店","订单金额","交付日期"],a=["id","name","phone","address","store.name","payment","deliveryTime"];e.export_json_to_excel2(n,t.tableData,a,"买单卖单"),t.downloadLoading=!1}))}}},l=u,c=(n("ee00"),n("5417"),n("2877")),s=Object(c["a"])(l,a,r,!1,null,"6fa3d42b",null);e["default"]=s.exports},ee00:function(t,e,n){"use strict";var a=n("35ae"),r=n.n(a);r.a}}]);