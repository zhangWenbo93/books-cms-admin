<!--  -->
<template>
    <div class="detail">
        <el-form :model="postForm">
            <sticky :class-name="'sub-navbar'">
                <el-button
                    v-show="!isEdit"
                    @click.prevent.stop="showGuide"
                >
                    显示帮助
                </el-button>
                <el-button
                    v-loading="loading"
                    type="success"
                    class="ml10"
                    @click="submitForm"
                >
                    {{ isEdit ? '编辑' : '新增' }}电子书
                </el-button>
            </sticky>
            <div class="detail-container">
                <Waring />
                <el-row>
                    <el-col :span="24">
                        <EbookUpload />
                    </el-col>
                    <el-col :span="24" />
                </el-row>
            </div>
        </el-form>
    </div>
</template>

<script>
import Sticky from '../../../components/Sticky/index'
import Waring from './Waring'
import EbookUpload from '../../../components/EbookUpload/index'

export default {
    name: 'Details',

    components: {
        Sticky,
        Waring,
        EbookUpload
    },

    props: {
        isEdit: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            loading: false,
            postForm: {}
        }
    },

    methods: {
        showGuide() { },
        submitForm() {
            this.loading = true
            setInterval(() => {
                this.loading = false
            }, 1000)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.detail {
    position: relative;
    .detail-container {
        padding: 40px 45px 20px 50px;
        .preview-img {
            width: 200px;
            height: 270px;
        }
        .contents-wrapper {
            padding: 5px 0;
        }
    }
}
</style>
