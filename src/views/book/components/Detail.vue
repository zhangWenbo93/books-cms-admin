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
                        <EbookUpload
                            :file-list="fileList"
                            :disabled="isEdit"
                            @onSuccess="onUploadSuccess"
                            @onRemove="onUploadRemove"
                        />
                    </el-col>
                    <el-col :span="24">
                        <el-form-item
                            style="margin-bottom: 40px;"
                            prop="title"
                        >
                            <MDinput
                                v-model="postForm.title"
                                :maxlength="100"
                                name="name"
                                required
                            >
                                书名
                            </MDinput>
                        </el-form-item>
                        <div>
                            <el-row>
                                <el-col
                                    :span="12"
                                    class="form-item-author"
                                >
                                    <el-form-item
                                        :label-width="labelWidth"
                                        label="作者："
                                    >
                                        <el-input
                                            v-model="postForm.author"
                                            placeholder="作者"
                                            style="width: 100%"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item
                                        :label-width="labelWidth"
                                        label="出版社："
                                    >
                                        <el-input
                                            v-model="postForm.publisher"
                                            placeholder="出版社"
                                            style="width: 100%"
                                        />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item
                                        :label-width="labelWidth"
                                        label="语言："
                                    >
                                        <el-input
                                            v-model="postForm.language"
                                            placeholder="语言"
                                            style="width: 100%"
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item
                                        :label-width="labelWidth"
                                        label="根文件："
                                    >
                                        <el-input
                                            v-model="postForm.rootFile"
                                            placeholder="根文件"
                                            style="width: 100%"
                                            disabled
                                        />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item
                                        :label-width="labelWidth"
                                        label="文件路径："
                                    >
                                        <el-input
                                            v-model="postForm.filePath"
                                            placeholder="文件路径"
                                            style="width: 100%"
                                            disabled
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item
                                        :label-width="labelWidth"
                                        label="解压路径："
                                    >
                                        <el-input
                                            v-model="postForm.unzipPath"
                                            placeholder="解压路径"
                                            style="width: 100%"
                                            disabled
                                        />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item
                                        :label-width="labelWidth"
                                        label="封面路径："
                                    >
                                        <el-input
                                            v-model="postForm.coverPath"
                                            placeholder="封面路径"
                                            style="width: 100%"
                                            disabled
                                        />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item
                                        :label-width="labelWidth"
                                        label="文件名称："
                                    >
                                        <el-input
                                            v-model="postForm.fileName"
                                            placeholder="文件名称"
                                            style="width: 100%"
                                            disabled
                                        />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item
                                        label-width="60px"
                                        label="封面："
                                    >
                                        <a
                                            v-if="postForm.cover"
                                            :href="postForm.cover"
                                            target="_blank"
                                        >
                                            <img
                                                :src="postForm.cover"
                                                class="preview-img"
                                            >
                                        </a>
                                        <span v-else>无</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item
                                        label-width="60px"
                                        label="目录："
                                    >
                                        <div
                                            v-if="postForm.contents && postForm.contents.length > 0"
                                            class="contents-wrapper"
                                        >
                                            <el-tree
                                                :data="contentsTree"
                                                @node-click="onContentClick"
                                            />
                                        </div>
                                        <span v-else>无</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-form>
    </div>
</template>

<script>
import Sticky from '@/components/Sticky/index'
import Waring from './Waring'
import EbookUpload from '@/components/EbookUpload/index'
import MDinput from '@/components/MDinput/index'

export default {
    name: 'Details',

    components: {
        Sticky,
        Waring,
        EbookUpload,
        MDinput
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
            postForm: {},
            fileList: [],
            labelWidth: '120px'
        }
    },

    methods: {
        showGuide() { },
        submitForm() {
            this.loading = true
            setInterval(() => {
                this.loading = false
            }, 1000)
        },
        onUploadSuccess(data) {
            this.setData(data)
        },
        onUploadRemove() {
            this.postForm = Object.assign({}, this.$data.options)
            this.fileList = []
            this.contentsTree = []
        },
        onContentClick(data) {
            const { text } = data

            text && window.open(text)
        },
        setData(data) {
            const {
                originalName,
                url,
                contentsTree
            } = data
            this.postForm = {
                ...data
            }
            this.fileList = [{ name: originalName, url }]
            this.contentsTree = contentsTree
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
