<template>
    <div>
        <!-- loaging效果元件 -->
        <loading :active.sync="isLoading"></loading>

        <!-- 表單 -->
        <div class="text-right mt-4">
            <button class="btn btn-outline-success" @click="openproductModal('new')">新增產品</button>
        </div>
        <table class="table table-hover mt-4">
            <thead>
                <th width="150">商品分類</th>
                <th>產品名稱</th>
                <th width="120">原價</th>
                <th width="120">售價</th>
                <th width="100">是否上架</th>
                <th width="200">編輯</th>
            </thead>
            <tbody>
                <tr v-for="(item) in products" :key="item.id">
                    <td>{{item.category}}</td>
                    <td>{{item.title}}</td>
                    <td class="text-right">{{item.origin_price | currency}}</td>
                    <td class="text-right">{{item.price | currency}}</td>
                    <td>
                        <span v-if="item.is_enabled == 1 " class="text-success">啟用</span>
                        <span v-else class="text-danger">未啟用</span>
                    </td>   
                    <td>
                        <button class="btn btn-outline-primary btn-sm mr-2" @click="openproductModal('edit' , item)">編輯</button>
                        <button class="btn btn-outline-danger btn-sm dan" @click="openproductModal('delete', item)">刪除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- 分頁 -->
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" :class="{'disabled': !pagination.has_pre}">
                <a class="page-link" href="#" aria-label="Previous"
                    @click.prevent="getProducts(pagination.current_page - 1)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
                </li>
                <!-- pagination.total_pages -->
                <li class="page-item" v-for="page in pagination.total_pages" :key="page"
                    :class="{'active': pagination.current_page === page}">
                    <a class="page-link" href="#" @click.prevent="getProducts(page)">{{ page }}</a>
                    </li>
                <li class="page-item" :class="{'disabled': !pagination.has_next}">
                <a class="page-link" href="#" aria-label="Next"
                    @click.prevent="getProducts(pagination.current_page + 1)">
                    <span aria-hidden="true">&raquo;</span>
                </a>
                </li>
            </ul>
        </nav>

        <!-- Modal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content border-0">
            <div class="modal-header bg-dark text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                <span>新增產品</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                <div class="col-sm-4">
                    <div class="form-group">
                    <label for="image">輸入圖片網址</label>
                    <input type="text" class="form-control" id="image"
                        placeholder="請輸入圖片連結" v-model="tempProduct.imageUrl">
                    </div>
                    <div class="form-group">
                    <label for="customFile">或 上傳圖片
                        <i class="fas fa-spinner fa-spin"></i>
                    </label>
                    <input type="file" id="customFile" class="form-control"
                        ref="files" @change="uploadFile">
                    </div>
                    <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                    class="img-fluid" alt="" :src="tempProduct.imageUrl">
                </div>
                <div class="col-sm-8">
                    <div class="form-group">
                    <label for="title">標題</label>
                    <input type="text" class="form-control" id="title"
                        placeholder="請輸入標題" v-model="tempProduct.title" required>
                    </div>

                    <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="category">分類</label>
                        <input type="text" class="form-control" id="category"
                        placeholder="請輸入分類" v-model="tempProduct.category" required>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="price">單位</label>
                        <input type="unit" class="form-control" id="unit"
                        placeholder="請輸入單位" v-model="tempProduct.unit">
                    </div>
                    </div>

                    <div class="form-row">
                    <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                        <input type="number" class="form-control" id="origin_price"
                        placeholder="請輸入原價" v-model="tempProduct.origin_price">
                    </div>
                    <div class="form-group col-md-6">
                        <label for="price">售價</label>
                        <input type="number" class="form-control" id="price"
                        placeholder="請輸入售價" v-model="tempProduct.price">
                    </div>
                    </div>
                    <hr>

                    <div class="form-group">
                    <label for="description">產品描述</label>
                    <textarea type="text" class="form-control" id="description"
                        placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
                    </div>
                    <div class="form-group">
                    <label for="content">說明內容</label>
                    <textarea type="text" class="form-control" id="content"
                        placeholder="請輸入產品說明內容" v-model="tempProduct.content"></textarea>
                    </div>
                    <div class="form-group">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" v-model="tempProduct.is_enabled"
                            id="is_enabled" :true-value="1" :false-value="0">
                        <label class="form-check-label" for="is_enabled" >
                        是否啟用
                        </label>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
            </div>
            </div>
        </div>
        </div>
        <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content border-0">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                <span>刪除產品</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-danger" @click="deleteProduct">確認刪除</button>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    data(){

        return{
            products: [],
            tempProduct:{},
            pagination: {},
            isNew: '',
            isLoading: false,
        }
    },
    methods:{
        // 更新產品列表
        getProducts(page = 1){
            const api = `https://vue-course-api.hexschool.io/api/alex0811/admin/products?page=${page}`;
            const vm = this;
            this.isLoading = true;
            this.$http.get(api).then((response) => {
                vm.products = response.data.products;
                this.isLoading = false;
                vm.pagination = response.data.pagination;
            })
        }, 
        // 打開編輯  判斷是否為新增or編輯or刪除
        openproductModal(isNew, item){
            if(isNew === 'new'){
                this.tempProduct = {};
                isNew = 'new';
            } else if(isNew === 'edit') {
                //避免物件傳參考 用object.assign
                this.tempProduct = Object.assign( {} , item );
                isNew = 'edit';
            } else if(isNew === 'delete'){
                this.tempProduct = item;
                $('#delProductModal').modal('show');
                return
            }
            $('#productModal').modal('show');
        },
        //新增產品
        updateProduct(){
            let api = `https://vue-course-api.hexschool.io/api/alex0811/admin/product`
            const vm = this;
            let httpMethod = 'post';
            if (vm.isNew === 'edit'){
                api = `https://vue-course-api.hexschool.io/api/alex0811/admin/product/${vm.tempProduct.id}`;
                httpMethod = 'put';
            }
            this.$http[httpMethod](api,{ data: vm.tempProduct}).then((response) => {
                if(response.data.success){
                    $('#productModal').modal('hide');
                    vm.getProducts();
                    this.$bus.$emit('message:push', '新增成功', 'success')
                } else{
                    this.$bus.$emit('message:push', '新增失敗', 'danger')
                }
                // vm.products = response.data.products
            })
        },
        deleteProduct(){
            let vm = this;
            let api = `https://vue-course-api.hexschool.io/api/alex0811/admin/product/${vm.tempProduct.id}`;
            this.$http.delete(api).then((response) => {
                if(response.data.success){
                    $('#delProductModal').modal('hide');
                    this.getProducts();
                    this.$bus.$emit('message:push', '刪除成功', 'success')
                } else{
                    $('#delProductModal').modal('hide');
                    this.$bus.$emit('message:push', '刪除失敗', 'danger')
                }
            })
        },
        uploadFile(){
            const uploadedFile = this.$refs.files.files[0];
            const vm = this;
            const url = `https://vue-course-api.hexschool.io/api/alex0811/admin/upload`;
            const formData = new FormData();
            formData.append('file-to-upload',uploadedFile);
            this.$http.post(url,formData,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
            }).then((response) => {
                if(response.data.success){
                    vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);
                    console.log(response);
                    this.$bus.$emit('message:push', '上傳成功', 'success')
                } else{
                    this.$bus.$emit('message:push', response.data.message, 'danger')
                }
            })
        },
    },
    created() {
        this.getProducts();
    }, 
}
</script>
