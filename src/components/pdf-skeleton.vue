<!-- 模拟骨架屏 -->
<template>
    <div class="pdf-skeleton-container">
        <div class="skeleton-item" v-for="index in lines" :key="index"></div>
    </div>
</template>

<script>
export default {
    name: 'PDFSkeketonContainer',
    props: {
        height: {
            type: Number,
            default: 0
        }
    },
    computed: {
        lines() {
            const verticalPadding = 56 * 2;
            const itemHeight = 16 + 32;
            return this.height ? Math.ceil((this.height - verticalPadding - 16) / itemHeight) : 20
        }
    },
}
</script>

<style lang="less" scoped>
.pdf-skeleton-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 56px 80px;
    box-sizing: border-box;

    .skeleton-item {
        background: #f2f2f2;
        height: 16px;
        border-radius: 4px;
        background: #f2f2f2;
        position: relative;
        overflow: hidden;

        &:before {
            content: "";
            display: block;
            width: 300px;
            height: 16px;
            background: linear-gradient(to right, #f2f2f2, #e5e7ea, #f2f2f2);
            position: absolute;
            top: 0;
            left: 0;
            animation: skeleton infinite 1.5s ease;
        }

        + .skeleton-item {
            margin-top: 32px;
        }

        &:nth-child(4n - 3) {
            width: calc(100% - 2em);
            margin-left: 2em;
        }

        &:nth-child(4n) {
            width: 70%;
            margin-bottom: 24px;
        }
    }

    @keyframes skeleton {
        0% {
            left: -300px;
        }
        100% {
            left: 100%;
        }
    }
}
</style>