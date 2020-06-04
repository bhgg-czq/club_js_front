<template>
  <div class="card">
    <template>
      <el-table :data="aList" border style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="applyDate" label="申请日期" width="120"></el-table-column>
        <el-table-column prop="clubName" label="社团名称" width="180"></el-table-column>
        <el-table-column prop="collegeName" label="所属分院" width="180"></el-table-column>
        <el-table-column prop="activityName" label="活动名称" width="180"></el-table-column>
        <el-table-column prop="className" label="活动地点" width="150"></el-table-column>
        <el-table-column prop="number" label="限定人数" width="80"></el-table-column>
        <el-table-column prop="startTime" label="活动时间" width="180"></el-table-column>
        <el-table-column prop="isPass" label="审核结果" width="80"></el-table-column>


        <el-table-column fixed="right" label="操作" width="170">
          <template slot-scope="scope">
            <el-button @click="handlePass(scope.row)" type="primary" size="mini">通过</el-button>
            <el-button @click="handleUnPass(scope.row)" type="danger" size="mini">不通过</el-button>
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
          aList:[],
          type:''

        };
      },
      created() {

        this.$bus.$on('getwait',(data) =>{
          this.getWaittoPassa()
        })
        this.$bus.$on('getalready',(data) =>{
          this.getAlreadyPassa()
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
          let data = new FormData();
          data.append('type',this.type)
          this.axios.post(`http://localhost:8181/api/admin/waittopassa/${this.adminId}`,data).then(res => {
            // console.log(res);
            this.aList = res.data;
            console.log(this.aList)
          });
        },
        //已审核列表
        getAlreadyPassa() {
          let data = new FormData();
          data.append('type',this.type)
          this.axios.post(`http://localhost:8181/api/admin/passa/${this.adminId}`,data).then(res => {
            // console.log(res);
            this.aList = res.data;
            for(var i = 0;i<this.aList.length;i++){
              if(this.aList[i].bPass === 1)
                this.aList[i].isPass = '通过'
              else this.aList[i].isPass = '未通过'
            }
            console.log(this.aList)
          });
        },
        //通过活动
        handlePass(row) {
          this.activityId = row.aId
          this.axios.post(`http://localhost:8181/api/admin/passactivity/${this.adminId}/${this.activityId}`)
            .then(res => {
              // console.log(res)
              if(res.status === 200){
                this.activityId = ''
                this.getWaittoPassa()
              }
              else{
                window.alert("审核失败")
              }
            })
        },

        //拒绝通过
        handleUnPassrow(row) {
          this.aid = row.aId
          this.axios.post(`http://localhost:8181/api/admin/cancelactivity/${this.activitId}`)
            .then(res => {
              // console.log(res)
              if(res.status === 200){
                this.getWaittoPassa()
              }
              else{
                window.alert("审核失败")
              }
            })
        },
        //搜索
        handleSearch() {},
        onSubmit() {}
    }
    }
</script>

<style scoped>

</style>
