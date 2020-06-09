<template>
  <div class="card">
    <template>
      <el-table :data="aList" border style="width: 100%"  v-if="this.type==='activity'">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="items[0].name" label="社团名称" width="180" ></el-table-column>
        <el-table-column prop="name" label="活动名称" width="180" ></el-table-column>
        <el-table-column prop="detail" label="活动内容" :show-overflow-tooltip="true" width="180" ></el-table-column>
        <el-table-column prop="items[0].college" label="所属分院" width="180" ></el-table-column>
        <el-table-column prop="cName" label="申请地点" width="150"></el-table-column>
        <el-table-column prop="number" label="限定人数" width="80"></el-table-column>
        <el-table-column prop="start_time" label="活动开始时间" width="180"></el-table-column>
        <el-table-column prop="end_time" label="活动结束时间" width="180"></el-table-column>
        <el-table-column fixed="right" label="操作" width="280" align="center">
          <template slot-scope="scope" >
            <el-button @click="handlePass(scope.row)" type="primary" size="mini">通过</el-button>
            <el-button @click="writeReason(scope.row)" type="danger" size="mini">不通过</el-button>
            <el-button @click="detail(scope.row)" type="success" size="mini">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table :data="aList" border style="width: 100%"  v-if="this.type==='class'">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="clubname" label="社团名称" width="180" ></el-table-column>
        <el-table-column prop="activity[0].name" label="活动名称" width="180" ></el-table-column>
        <el-table-column prop="activity[0].name" label="活动名称" width="180" ></el-table-column>
        <el-table-column prop="activity[0].detail" label="活动内容" :show-overflow-tooltip="true" width="180" ></el-table-column>
        <el-table-column prop="classroom[0].name" label="申请地点" width="150"></el-table-column>
        <el-table-column prop="activity[0].number" label="限定人数" width="80"></el-table-column>
        <el-table-column prop="time" label="活动时间" width="180" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column fixed="right" label="操作" width="280" align="center">
          <template slot-scope="scope" >
            <el-button @click="handlePass(scope.row)" type="primary" size="mini">通过</el-button>
            <el-button @click="writeReason(scope.row)" type="danger" size="mini">不通过</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>

  export default {
    name: "AdminActivity",
    data() {
      return {
        adminId:'1',//默认值为1
        activityId:'',
        tId:'',
        aList:[],
        type:'',
      };
    },
    created() {

      this.$bus.$on('getwait',(data) =>{
        this.getWaittoPassa()
      })
      this.adminId = localStorage.getItem("id")
      this.type = localStorage.getItem("type")
      console.log(this.adminId)//疑问这里不会有异步问题吗
      this.getWaittoPassa();

    },
    methods: {
      //选中的当前菜单
      handleSelect() {
        console.log("选中");
      },
      //待审核列表
      getWaittoPassa() {
        if(localStorage.getItem('type')==='activity'){
          this.axios.get("http://localhost:3000/admin/waittopassa?aid="+this.adminId).then(res => {
            if(res.data.code===200){
              this.aList = res.data.activities;
              console.log(this.aList)
            }
          });
        }else{
          this.axios.get("http://localhost:3000/admin/waittopassb?aid="+this.adminId).then(res=>{
            if(res.data.code===200){
              this.aList = res.data.activities;
              for(var i = 0;i<this.aList.length;i++){
                this.aList[i].time = this.renderTime(this.aList[i].activity[0].start_time)+" 到 "+this.renderTime(this.aList[i].activity[0].end_time)
              }
            }
          })
        }
      },

      //时间转换函数
      renderTime:function(d) {
        var date = new Date(d).toJSON();
        if (date == undefined) {
          return "";
        }
        return new Date(+new Date(date) ).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      },

      //通过活动
      handlePass(row) {
        this.$confirm('确定通过此活动申请？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.activityId = row._id
          if(localStorage.getItem('type')==='activity'){
            this.axios.get(`http://localhost:3000/admin/passactivity?aid=`+this.activityId)
              .then(res => {
                if(res.data.code === 200){
                  this.activityId = ''
                  this.getWaittoPassa()
                }
                else{
                  window.alert("审核失败")
                }
              })
          }else{
            this.axios.get("http://localhost:3000/admin/classroom/pass?tid="+row._id+"&aid="+row.activity[0]._id)
              .then(res => {
                // console.log(res)
                if(res.data.code === 200){
                  this.getWaittoPassa()
                }
                else{
                  window.alert("审核失败")
                }
              })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },

      //拒绝通过
      writeReason(row){
        if(localStorage.getItem('type')==='class'){
          this.$prompt('请输入拒绝通过原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            this.$message({
              type: 'success',
              message: '您的理由是: ' + value
            });
            console.log(value)
            this.handleUnPassrow(row,value)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        }else{
          this.activityId=row._id
          this.$confirm('确定不通过此活动申请？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.axios.get("http://localhost:3000/admin/cancelactivity?aid="+this.activityId).then((res=>{
              if(res.data.code === 200){
                this.activityId = ''
                this.getWaittoPassa()
              }
              else{
                window.alert("审核失败")
              }
            }))
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        }
      },
      handleUnPassrow(row,reason) {
        this.axios.get("http://localhost:3000/admin/classroom/unpass?tid="+row._id+"&reason="+reason)
          .then(res => {
            console.log(row._id)
            if(res.data.code === 200){
              this.getWaittoPassa()
            }
            else{
              window.alert("审核失败")
            }
          })
      },
      //查看活动详细内容
      detail(row){
        this.$bus.$emit('activitydetail',row)
      }
    }
  }
</script>

<style scoped>

</style>
