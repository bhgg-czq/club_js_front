<template>
    <div>

      <!--进度条-->
      <el-steps :space="400" :active="step" finish-status="success" align-center=true>
        <el-step title="提交申请"></el-step>
        <el-step title="审批活动"></el-step>
        <el-step title="检查场地" :status="value"></el-step>
      </el-steps>


      <!--卡片-->
      <el-row>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>申请表</span>
            </div>
            <div class="text item" v-html="this.msg">

            </div>
          </el-card>
        </el-col>

        <el-col :span="6" v-if="this.step == 2">
          <el-card :body-style="{ padding: '0px' }">
            <img src="../assets/1.jpg" class="image" height="300px">
            <div style="padding: 14px;">
              <span style="font-size: 14px;color: rebeccapurple">{{this.waitPass}}</span>
              <div class="bottom clearfix">
                <el-button type="text" class="button" @click="handleAddress" :disabled="select">场地选择</el-button>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8" v-if="this.value == 'error'">
          <el-card class="box-card1">
            <el-alert v-for="item in notPassList" :key="item.aId"
              :title=item.items.name
              type="error"
              :description=item.reason
              show-icon>
            </el-alert>
          </el-card>
        </el-col>

      </el-row>

      <!--活动场地申请弹出框-->
      <div class="dialogs">
        <el-dialog title="活动场地申请" :visible.sync="addDialogFormVisible" style="width:1100px; left:200px; top:10px">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">

            <el-form-item label="活动时间" required>
              <el-date-picker
                v-model="ruleForm.time"
                type="datetimerange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="活动场地" prop="className">
              <el-select v-model="ruleForm.className" filterable @focus="getAvailableList">
                <el-option
                  v-for="item in allList"
                  :key="item.roomid"
                  :label="item.name"
                  :value="item.roomid"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="btn">
              <el-button type="primary" @click="submitForm">立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>

        </el-dialog>
      </div>

    </div>
</template>

<script>
    export default {
        name: "Progress",
        data(){
          return{
            msg:'',   //从activity获取的内容
            step:1,   //进程
            value:'', //步骤三的状态
            select:false,   //场地选择按钮的状态，默认可使用

            addDialogFormVisible:false,   //弹出框
            ruleForm:{            //填写对象
              className:'',
              time:''
            },

            //与场地相关的，解决场地冲突
            allList:[],   //所有场地列表+是否可选属性
            passList:[],    //已经通过审核的场地

            notPassList:[],   //该活动场地申请未通过的列表
            waitPass:'活动场地申请',  //等待审核的场地名称
          }
        },
      created() {
          this.msg=localStorage.getItem('msg');

          console.log(localStorage.getItem('apass'))
          if(localStorage.getItem('apass')==='true'){
            this.step=2;
            console.log(this.step)
          }


          this.getRoList();
          this.getPassList();
          this.getWaitPass();

         // 判断步骤三状态，若有数据则状态为失败
          this.getNotPass();
      },
      methods:{
        //waittoPass(正在审核的场地）
        getWaitPass(){
          this.axios.get("http://localhost:3000/leader/classroom/waitPass?aid="+localStorage.getItem('aid')).then(res=>{
            console.log("dfsdfdsfdsfsdfsdfs")
            console.log(res.data.activities)
            if(res.data.activities.length){
              var start= this.renderTime(res.data.activities[0].startTime);
              var end=this.renderTime(res.data.activities[0].endTime);
              var name=res.data.activities[0].items[0].name;

              this.waitPass="于 "+start+" 到 "+end+" 使用 "+name+" 的场地申请已提交，请耐心等待";

              //场地选择按钮禁用
              this.select=true;
            }

          })
        },
        //时间转换函数
        renderTime(date){
          var dateee = new Date(date).toJSON();
          return new Date(+new Date(dateee) ).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        },

        //notPassList
        getNotPass(){
          this.axios.get("http://localhost:3000/leader/classroom/getunPass?aid="+localStorage.getItem('aid')).then(res=>{
            if(res.data.code.activities){
              this.notPassList=res.data.activities;
              this.step=2;
              this.value='error';
              console.log(this.step)
            }
            else{
              this.notPassList=null;
              console.log(this.notPassList)
            }
            //console.log(res.data)

          })
        },

        //allList
        getRoList(){
          this.axios.get("http://localhost:3000/leader/listAllRoom").then(res=>{
            this.allList=res.data.roomlist;
            console.log(res.data)
          })
        },
        //passList
        getPassList(){
          this.axios.get("http://localhost:3000/leader/classroom/getPass").then(res=>{
            if(res.data.code==200)
              this.passList=res.data.activities;
            console.log("fdfdf"+this.passList)
            console.log(this.passList)
          })
        },
        //allList(根据所选时间进行判断加属性）
        getAvailableList(){
          //初始化
          this.allList.forEach(item => {
            this.$set(item, 'disabled', false)
          })

          for(var room of this.passList){
            console.log("fdsfdsfsdfdsfdsfs")
            console.log(room)
            //将日期转换成时间戳进行比较
            var start = new Date(room.startTime);
            var start1=start.getTime(start);

            var end = new Date(room.endTime);
            var end1=end.getTime(end);

            var s = this.ruleForm.time[0]+28800000;
            var e = this.ruleForm.time[1]+28800000;

            var rid=room.rId;

            if(!(s>end1 || e<start1)){
              for(var r of this.allList){
                console.log(r.id);
                if(r.roomid==rid){
                  console.log(r.roomid);
                  this.$set(r, 'disabled', true)
                  break;
                }
              }
            }
          }
        },

        handleAddress(){
          this.addDialogFormVisible=true;
        },

        //重置弹出框
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },

        //提交申请
        submitForm(){
          var _this=this;
          this.axios({
            method:'post',
            url:"http://localhost:3000/leader/activity/checkroom",
            data:{
              aid:localStorage.getItem('aid'),
              rid:this.ruleForm.className,
              start:this.ruleForm.time[0],
              end:this.ruleForm.time[1]
            }
          }).then(res=>{
            if (res.data.code===200){
              this.$message({
                message: '申请场地成功！'
              })

              for(var r of _this.allList)
                if(r.roomid == _this.ruleForm.className){
                  var start= this.renderTime(this.ruleForm.time[0]);
                  var end=this.renderTime(this.ruleForm.time[1]);
                  var name=r.name;

                  this.waitPass="于 "+start+" 到 "+end+" 使用 "+name+" 的场地申请已提交，请耐心等待";

                  //场地选择按钮禁用
                  this.select=true;
                }

              _this.addDialogFormVisible=false
              _this.ruleForm={}
            }

          })
        }
      }
    }
</script>

<style scoped>
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
  .el-steps{
    padding-top: 100px;
  }

  /*卡片样式*/
  .el-row{
    padding-top: 20px;
    padding-left: 65px;
  }
  .el-col{
    margin: 0 30px;

  }
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .box-card {
    width: 300px;
  }
  .box-card1 {
    width: 400px;
  }

  .btn{
    text-align: right;
  }
</style>
