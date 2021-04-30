<!--  -->
<template>
    <div>booklist</div>
</template>

<script>
import { bookList } from '@/api/book'
export default {
    name: 'Booklist',

    async created() {
        const list = await bookList()
        console.log(list)
    }
}
</script>

<style lang="scss" scoped></style>
