<template>
  <div class="about">
    <h1>測試測試</h1>
  </div>
</template>
<script>
export default {
  data(){
    return {};
  },
  created(){
    const api = 'https://vue-course-api.hexschool.io/api/alex0811/products'
    this.$http.get(api).then((response) => {
      console.log(response.data)
    })
  }   
}
</script> 