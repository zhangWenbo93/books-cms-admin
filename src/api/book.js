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

export function fileNameBook(query) {
    return request({
        url: `/book/filename/${query}`,
        method: 'get'
    })
}

export function getCategory() {
    return request({
        url: `/book/category`,
        method: 'get'
    })
}

export function bookList(data) {
    return request({
        url: '/book/list',
        method: 'post',
        data
    })
}

export function deleteBook(query) {
    return request({
        url: `/book/delete/${query}`,
        method: 'get'
    })
}
