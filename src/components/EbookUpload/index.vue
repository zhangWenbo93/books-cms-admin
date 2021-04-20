<!--  -->
<template>
    <div class="upload-container">
        <el-upload
            :action="action"
            :headers="headers"
            :multiple="false"
            :limit="1"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            :on-error="onError"
            :on-remove="onRemove"
            :file-list="fileList"
            :on-exceed="onExceed"
            :disabled="disabled"
            drag
            show-file-list
            class="image-uploader"
        >
            <!-- accept="application/epub+zip" -->
            <el-button
                size="small"
                type="primary"
            >点击上传</el-button>
            <div
                slot="tip"
                class="el-upload__tip"
            >只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </div>
</template>

<script>
import { _encode } from '@/utils/auth'

export default {
    name: 'EbookUpload',

    props: {
        fileList: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            action: `${process.env.VUE_APP_BASE_API}/book/upload`
        }
    },

    computed: {
        headers() {
            return {
                Authorization: _encode()
            }
        }
    },

    methods: {
        onRemove() {

        },
        onExceed() {

        },
        beforeUpload() {

        },
        onSuccess() {

        },
        onError(err) {
            const errMsg = (err.message && JSON.parse(err.message)) || '上传失败'
            this.$message({
                message: (errMsg.msg && `上传失败，失败原因：${errMsg.msg}`) || '上传失败',
                type: 'error'
            })
            this.$emit('onError', err)
        }
    }
}
</script>

<style lang="scss" scoped></style>
