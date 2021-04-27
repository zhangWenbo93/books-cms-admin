<!--  -->
<template>
    <div class="detail">
        <el-form
            ref="postForm"
            :model="postForm"
            :rules="rules"
        >
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
                                        prop="author"
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
                                        prop="publisher"
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
                                        prop="language"
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
                                                :src="'http://localhost:8089/admin-upload-ebook'+postForm.cover"
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
import { createBook } from '@/api/book'
import Sticky from '@/components/Sticky/index'
import Waring from './Waring'
import EbookUpload from '@/components/EbookUpload/index'
import MDinput from '@/components/MDinput/index'

const fields = {
    title: '书名',
    author: '作者',
    publisher: '出版社',
    language: '语言'
}

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
        const validateRequire = (rule, value, callback) => {
            if (!value) {
                // this.$message({
                //     message: fields[rule.field] + '为必传项',
                //     type: 'error'
                // })
                callback(new Error(fields[rule.field] + '为必传项'))
            } else {
                callback()
            }
        }
        return {
            loading: false,
            postForm: {},
            rules: {
                title: [{ validator: validateRequire }],
                author: [{ validator: validateRequire }],
                publisher: [{ validator: validateRequire }],
                language: [{ validator: validateRequire }]
            },
            fileList: [],
            labelWidth: '120px'
        }
    },

    methods: {
        showGuide() { },
        submitForm() {
            this.loading = true
            this.$refs.postForm.validate(valid => {
                if (valid) {
                    const book = Object.assign({}, this.postForm)
                    delete book.contents
                    delete book.contentsTree
                    createBook(book).then(res => {
                        this.$notify({
                            title: '成功',
                            message: res.msg,
                            type: 'success',
                            duration: 2000
                        })
                        this.clearData()
                    }).finally(() => {
                        this.loading = false
                    })
                } else {
                    this.loading = false
                }
            })
        },
        onUploadSuccess(data) {
            this.setData(data)
        },
        onUploadRemove() {
            this.clearData()
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
        },
        clearData() {
            this.postForm = Object.assign({}, this.$data.options)
            this.fileList = []
            this.contentsTree = []
            this.$refs.postForm.resetFields()
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
