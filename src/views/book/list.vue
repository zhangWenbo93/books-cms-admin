<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input
                v-model="listQuery.title"
                clearable
                placeholder="书名"
                style="width: 200px; margin-right: 10px;"
                class="filter-item"
            />
            <el-input
                v-model="listQuery.author"
                clearable
                placeholder="作者"
                style="width: 200px; margin-right: 10px;"
                class="filter-item"
            />
            <el-select
                v-model="listQuery.category"
                placeholder="分类"
                clearable
                class="filter-item"
                @change="handleCategory"
            >
                <el-option
                    v-for="item in categoryList"
                    :key="item.value"
                    :label="item.categoryText + `(${item.num})`"
                    :value="item.category"
                />
            </el-select>
            <el-button
                v-waves
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                style="margin-left: 10px"
                @click="forceRefresh"
            >
                查询
            </el-button>
            <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-edit"
                style="margin-left: 5px"
                @click="handleCreate"
            >
                新增
            </el-button>
            <el-checkbox
                v-model="showCover"
                class="filter-item"
                style="margin-left:5px;"
                @change="changeShowCover"
            >
                显示封面
            </el-checkbox>
        </div>
        <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            @sort-change="sortChange"
        >
            <el-table-column
                label="ID"
                prop="id"
                sortable="custom"
                align="center"
                width="80"
            />
            <el-table-column
                label="书名"
                width="150"
                align="center"
            >
                <template slot-scope="{ row: { titleWrapper }}">
                    <span v-html="titleWrapper" />
                </template>
            </el-table-column>
            <el-table-column
                label="作者"
                width="150"
                align="center"
            >
                <template slot-scope="{ row: { authorWrapper }}">
                    <span v-html="authorWrapper" />
                </template>
            </el-table-column>
            <el-table-column
                label="出版社"
                prop="publisher"
                width="150"
                align="center"
            />
            <el-table-column
                label="分类"
                prop="categoryText"
                width="100"
                align="center"
            />
            <el-table-column
                label="语言"
                prop="language"
                align="center"
            />
            <el-table-column
                v-if="showCover"
                label="封面图片"
                width="150"
                align="center"
            >
                <template slot-scope="scope">
                    <a
                        :href="scope.row.cover"
                        target="_blank"
                    >
                        <img
                            :src="scope.row.cover"
                            style="width:120px;height:180px"
                        >
                    </a>
                </template>
            </el-table-column>
            <el-table-column
                label="文件名"
                prop="fileName"
                width="100"
                align="center"
            />
            <el-table-column
                label="文件路径"
                width="100"
                align="center"
            >
                <template slot-scope="{ row: { filePath }}">
                    <span>{{ filePath | valueFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="封面路径"
                width="100"
                align="center"
            >
                <template slot-scope="{ row: { coverPath }}">
                    <span>{{ coverPath | valueFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="解压路径"
                width="100"
                align="center"
            >
                <template slot-scope="{ row: { unzipPath }}">
                    <span>{{ unzipPath | valueFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="上传人"
                width="100"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.createUser | valueFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="上传时间"
                width="100"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.createDt | timeFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="120"
                fixed="right"
            >
                <template slot-scope="{ row }">
                    <PreviewDialog
                        title="电子书信息"
                        :data="row"
                    >
                        <el-button
                            type="text"
                            icon="el-icon-view"
                        />
                    </PreviewDialog>
                    <el-button
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(row)"
                    />
                    <el-button
                        type="text"
                        icon="el-icon-delete"
                        style="color:#f56c6c"
                        @click="handleDelete(row)"
                    />
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.pageSize"
            @pagination="refresh"
        />
    </div>
</template>

<script>
import { bookList, getCategory, deleteBook } from '@/api/book'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import PreviewDialog from './components/PreviewDialog'

export default {
    name: 'Booklist',

    components: { Pagination, PreviewDialog },

    directives: { waves },

    filters: {
        timeFilter(time) {
            return time ? parseTime(time, '{y}-{m}-{d} {h}:{i}') : '无'
        },
        valueFilter(value) {
            return value || '无'
        }
    },

    data() {
        return {
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: false,
            downloadLoading: false,
            listQuery: {
                page: 1,
                pageSize: 20
            },
            showCover: true,
            categoryList: []
        }
    },
    created() {
        this.parseQuery()
    },
    mounted() {
        this.getList()
        this.getCategory()
    },
    // 解决路有变化时当前页面的数据刷新
    beforeRouteUpdate(to, from, next) {
        if (to.path === from.path) {
            const newQuery = Object.assign({}, to.query)
            const oldQuery = Object.assign({}, from.query)
            if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
                this.getList()
            }
        }
        next()
    },
    methods: {
        // 处理查询条件
        parseQuery() {
            // 收集查询条件
            const query = Object.assign({}, this.$route.query)
            let listQuery = {
                page: 1,
                pageSize: 20,
                order: 'ASC'
            }
            if (query) {
                query.page && (query.page = Number(query.page))
                query.pageSize && (query.pageSize = Number(query.pageSize))
                query.category && (query.category = Number(query.category))
                listQuery = {
                    ...listQuery,
                    ...query
                }
            }
            this.listQuery = listQuery
        },
        // 处理过滤数据后的查询
        handleFilter() {
            this.listQuery.page = 1
            this.refresh()
        },
        // 查询按钮事件
        forceRefresh() {
            this.handleFilter()
        },
        // 创建图书
        handleCreate() {
            this.$router.push('/book/create')
        },
        // 展示图片列
        changeShowCover(value) {
            this.showCover = value
        },
        // 获取图书分类
        async getCategory() {
            const res = await getCategory()
            this.categoryList = res.data
        },
        // 排序
        sortChange(val) {
            const order = val.order === 'descending' ? 'DESC' : 'ASC'
            this.listQuery.order = order
            this.handleFilter()
        },

        handleCategory(val) {
            this.listQuery.category = val
        },
        // 分页事件
        refresh() {
            this.$router.push({
                path: '/book/list',
                query: this.listQuery
            })
        },
        // 更新图书
        handleUpdate({ fileName }) {
            this.$router.push(`/book/edit/${fileName}`)
        },
        // 删除图书
        handleDelete({ fileName }) {
            this.$confirm('此操作将永久删除该电子书, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteBook(fileName).then(response => {
                    this.$notify({
                        title: '成功',
                        message: response.msg || '删除成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.listQuery.page = 1
                    this.getList()
                })
            })
        },
        // 获取图书列表
        async getList() {
            this.listLoading = true
            const response = await bookList(this.listQuery)
            const {
                list,
                count
            } = response.data
            this.list = list
            this.total = count
            this.listLoading = false
            this.list.forEach(book => {
                book.titleWrapper = this.wrapperKeyword('title', book.title)
                book.authorWrapper = this.wrapperKeyword('author', book.author)
            })
        },
        // 处理搜索词高亮
        wrapperKeyword(k, v) {
            function highlight(value) {
                return '<span style="color: #1890ff">' + value + '</span>'
            }
            if (!this.listQuery[k]) {
                return v
            } else {
                return v.replace(new RegExp(this.listQuery[k], 'ig'), v => highlight(v))
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>
