const install = function(Vue){
  const Bus = new Vue({
    methods:{
      emit (event,...args){
        this.$emit(event,...args)
      },
      on(event,...args){
        this.$on(event,callback)
      },
      off(event,...args){
        this.$off(event,callback)
      }
    }
  })
  Vue.prototype.$bus = Bus
}
export default install
