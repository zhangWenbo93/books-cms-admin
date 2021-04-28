import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/vue-element-admin/article/list',
        method: 'get',
        params: query
    })
}

export function createBook(data) {
    return request({
        url: '/book/create',
        method: 'post',
        data
    })
}

export function updateBook(data) {
    return request({
        url: '/book/update',
        method: 'post',
        data
    })
}
