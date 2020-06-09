<template>
  <div>
        <el-main style="height: 642px">
          <div class="search">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item >
                <el-input style="width: 150px" v-model="formInline.keyStr" placeholder="搜索关键字" ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleAdd">活动申请</el-button>
              </el-form-item>

            </el-form>
          </div>

          <div class="card">
            <template>
              <el-table :data="activityList.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width: 1181.35px">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="apply_date" :formatter="renderTime" label="申请日期" width="150" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="name" label="活动名称" width="150" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="cName" label="活动地点" width="120"></el-table-column>
                <el-table-column prop="limited" label="面向对象" width="120" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="number" label="限定人数" width="120"></el-table-column>
                <el-table-column prop="budget" label="预算" width="120"></el-table-column>
                <el-table-column prop="start_time" :formatter="renderTime" label="活动时间" width="180" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="detail" label="活动详情" width="180" :show-overflow-tooltip="true"></el-table-column>


                <el-table-column fixed="right" label="操作" width="220" align="center" v-if="type==0">
                  <template slot-scope="scope">
                    <el-button @click="handleCheck(scope.$index)" type="primary" size="mini">查看进度</el-button>
                    <el-button @click="cancle(scope.$index)" type="danger" size="mini">取消申请</el-button>
                  </template>
                </el-table-column>

                <el-table-column fixed="right" label="活动状态" width="180" align="center" v-if="type==1">
                  <template slot-scope="scope">
                    <span v-if="scope.row.a_pass=== true" style="color: lawngreen">审核通过</span>
                    <span v-if="scope.row.a_pass=== false" style="color: red">审核失败</span>
                  </template>
                </el-table-column>

              </el-table>
            </template>
          </div>

          <!--分页器-->
          <div class="page">
            <el-pagination
              background
              layout="prev, pager, next"
              :total=total
              @current-change="ChangePage"
              :current-page=currentPage

              @size-change="ChangeSize"
              :page-size=pageSize
            >
            </el-pagination>
          </div>

          <!--活动申请弹出框-->
          <div class="dialogs">
            <el-dialog title="活动申请" :visible.sync="addDialogFormVisible" style="width:1100px; left:250px; top:10px">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="活动名称" prop="activityName">
                  <el-input v-model="ruleForm.activityName" ></el-input>
                </el-form-item>

                <el-row>
                  <el-col :span="11">
                    <el-form-item label="面向对象" prop="peopletype">
                      <el-select v-model="ruleForm.peopletype" >
                        <el-option label="面向全校" value=1></el-option>
                        <el-option label="面向分院" value=2></el-option>
                        <el-option label="社团内部" value=3></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="11">
                    <el-form-item label="活动场地" prop="className">
                      <el-select v-model="ruleForm.className" filterable>
                        <el-option
                          v-for="item in roomList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.name">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>



                <el-form-item label="活动时间" required>
                  <el-col :span="11">
                    <el-date-picker
                      v-model="ruleForm.time"
                      type="datetimerange"
                      value-format="timestamp"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-col>
                </el-form-item>

                <el-row>
                  <el-col :span="11">
                    <el-form-item label="活动预算" prop="budget">
                      <el-input v-model="ruleForm.budget" ></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="11">
                    <el-form-item label="参与人数" prop="number">
                      <el-input v-model="ruleForm.number"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>


                <el-form-item label="活动内容" prop="detail">
                  <el-input type="textarea" v-model="ruleForm.detail"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="submitForm">立即创建</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
          </div>

        </el-main>
  </div>
</template>

<script>
  export default {
    name: 'Member',
    data() {
      return {
        row: 0,

        formLabelWidth: "100px",
        addDialogFormVisible: false,

        id: 1,  //社团id
        type: 1,  //社团审核状态

        activityList: [], //活动列表

        currentPage: 1, //当前页
        pageSize: 7,    //默认每页信息的数量
        total: 100,    //默认获得数量为100条

        roomList:[],  //活动地点列表

        formInline: {
          keyStr: ''
        },

        msg:'',  //查看进度的活动详情

        //弹出框内容
        ruleForm: {
          activityName: '',
          peopletype: '',
          time: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
          budget: '',
          detail:'',
          number:'',
          className:'',
        },

        rules: {
          activityName: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          peopletype: [
            {required: true, message: '请选择参与人员', trigger: 'change'}
          ],
          time: [
            {type: 'datetime', required: true, message: '请选择日期', trigger: 'change'}
          ],
          detail: [
            {required: true, message: '请填写活动内容', trigger: 'blur'}
          ]
        }

      };
    },

    components: {},

    created() {
      this.id = localStorage.getItem('id')
      this.type = localStorage.getItem('type')

      this.getwaitActList(this.type)
      this.getRoList()
    },
    methods: {
      //选中的当前菜单
      handleSelect() {
        console.log("选中");
      },
      //获得活动地点列表
      getRoList(){
        this.axios.get("http://localhost:3000/leader/listAllRoom").then(res=>{
          this.roomList=res.data.roomlist;
        })
      },

      //得到未通过审批的活动信息
      getwaitActList(ty) {
        if (ty == 0)
          this.axios.get("http://localhost:3000/leader/activity/waitPass?cid=" + this.id).then(res => {
            this.activityList = res.data.activities;
            // console.log(res.data)
          })
        else
          this.axios.get("http://localhost:3000/leader/activity/pass/?cid=" + this.id).then(res => {
            this.activityList = res.data.activities;
              console.log(res.data)
          })


        this.total = this.activityList.length;
      },

      //当前页面切换
      ChangePage: function (currentPage) {
        this.currentPage = currentPage

        this.getwaitActList(this.type)
      },
      //监听页面数量的改变
      ChangeSize: function (pageSize) {
        this.pageSize = pageSize;
      },

      // //根据用户输入关键次进行搜索
      handleSearch() {
      //   var keyword=this.formInline.keyStr;
      //   if(keyword=="")
      //     this.$message({
      //       type: "info",
      //       message: "搜索词不能为空!"
      //     });
      //   else{
      //     this.axios.get("http://localhost:8181/api/passage/show2/"+this.id+"/"+keyword).then(res=>{
      //       this.currentPage=1;
      //       this.passageList=res.data;
      //       this.total=this.passageList.length;
      //     })
      //   }
       },

      //活动申请按钮处理
      handleAdd(){
        this.addDialogFormVisible=true;
      },

      //弹出框处理
      //提交
      submitForm() {
        let _this=this;
        this.axios({
          method:'post',
          url:'http://localhost:3000/leader/activity/add',
          data:{
            cid:_this.id,
            place:_this.ruleForm.className,
            start:_this.ruleForm.time[0],
            end:_this.ruleForm.time[1],
            number:_this.ruleForm.number,
            budget:_this.ruleForm.budget,
            detail:_this.ruleForm.detail,
            limit:_this.ruleForm.peopletype,
            name:_this.ruleForm.activityName
          }
        }).then(res=>{
          console.log(res.data)

          if(res.data.code ===200)
            this.$message({
              message: res.data.message
            })

            _this.addDialogFormVisible=false
            _this.getwaitActList(0);
            _this.ruleForm={}
        })

      },
      //重置弹出框
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      //查看活动申请的进度
      handleCheck(i){
        localStorage.setItem('apass',this.activityList[i].a_pass);
        localStorage.setItem('bpass',this.activityList[i].b_pass);
        localStorage.setItem('aid',this.activityList[i]._id);
        console.log(this.activityList[i].a_pass)

        this.msg=
          '活动名称：'+this.activityList[i].name+'<br><br>'+'活动内容：'+this.activityList[i].detail
          +'<br><br>'+'活动人数：'+this.activityList[i].number+'<br><br>'+'预算：'+this.activityList[i].budget+'<br><br>'+'申请时间：'+this.renderTime1(this.activityList[i].apply_date)

        this.$emit('my-check',this.msg);

      },

      //取消活动申请
      cancle(i){
        this.$confirm("此操作将永久取消该活动的申请, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
              var aId=this.activityList[i]._id;
              var _this=this;
              this.axios.get("http://localhost:3000/leader/activity/cancel?id="+aId).then(res=>{
                if(res.data.code==200){
                  _this.$message({
                    type:"success",
                    message:"活动取消成功！"
                  })
                  _this.getwaitActList(_this.type);
                }
              })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },


      ///时间转换函数
      renderTime:function(row, column) {
        var date = new Date(row[column.property]).toJSON();
        if (date == undefined) {
          return "";
        }
        return new Date(+new Date(date) ).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      },

      renderTime1:function(d) {
        var date = new Date(d).toJSON();
        if (date == undefined) {
          return "";
        }
        return new Date(+new Date(date) ).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      },

      onSubmit(row) {}

    }
  };
</script>


<style scoped>
  .page{
    margin-top:50px;
    margin-left: 500px;
  }
  .el-col {
    border-radius: 4px;
    background-color: #ffffff;
  }
  .el-menu-item{
    background-color: #D3DCE6;
    text-align: left;
  }
  .el-main{
    background-color: #f2f2f2;
  }
  img{
    margin: 30px 0;
  }
</style>
