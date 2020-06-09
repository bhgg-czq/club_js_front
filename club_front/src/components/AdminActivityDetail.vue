<template>
  <el-form  id="d" ref="form" label-width="80px" >
    <el-form-item label="社团名称">
      <el-input v-model="form.items[0].name" readonly></el-input>
    </el-form-item>
    <el-form-item label="活动名称" >
      <el-input v-model="form.name"  readonly></el-input>
    </el-form-item>
    <el-form-item label="所属分院">
      <el-input v-model="form.items[0].college" readonly></el-input>
    </el-form-item>
    <el-form-item label="申请地点">
      <el-input v-model="form.cName" readonly></el-input>
    </el-form-item>
    <el-form-item label="开始时间">
      <el-input v-model="form.start_time" readonly></el-input>
    </el-form-item>
    <el-form-item label="结束时间">
      <el-input v-model="form.end_time" readonly></el-input>
    </el-form-item>
    <el-form-item label="活动内容">
      <el-input v-model="form.detail" readonly></el-input>
    </el-form-item>
    <el-form-item label="限定人数">
      <el-input v-model="form.number" readonly></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handlePass()">通过</el-button>
      <el-button  type="danger"  @click="writeReason()">不通过</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: "AdminActivityDetail",
    data() {
      return {
        form: {
          clubName: '',
          activityName: ''
        }
      }
    },
    created() {
      this.$bus.$on('getactivitydetail', (data) => {
        this.form = data
      })
    },
    methods: {
      //通过活动
      handlePass() {
        this.$confirm('确定通过此活动申请？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var activityId = this.form._id
          this.axios.get(`http://localhost:3000/admin/passactivity?aid=` + activityId)
            .then(res => {
              if (res.data.code === 200) {
                this.$bus.$emit('towait')
              } else {
                window.alert("审核失败")
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },

      //拒绝通过
      writeReason() {
        var activityId = this.form._id
        this.$confirm('确定不通过此活动申请？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get("http://localhost:3000/admin/cancelactivity?aid=" + activityId).then((res => {
            if (res.data.code === 200) {
              this.$bus.$emit('towait')
            } else {
              window.alert("审核失败")
            }
          }))
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },

    }
  }
</script>

<style scoped>

</style>
