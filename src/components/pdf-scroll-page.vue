<template>
    <div class="pdf-scroll-page"
         :style="elementStyle"
         ref="pdf-scroll-page">
        <slot v-bind="{ page, scale }"></slot>
        <span class="page-number-content">{{pageNumber}}</span>
    </div>
</template>

<script>
import { clone } from '../utils/base';

export default {
    name: 'PdfScrollPage',
    props: {
        page: Object,
        scrollTop: Number,
        clientHeight: Number,
        currentPage: Number,
        scale: Number,
        isToBottom: Boolean,
        maxWidth: Number,
        isImage: Boolean
    },
    data () {
        return {
            offsetHeight: 0,
            offsetTop: 0,
            clientWidth: 0,
            isScroll: false,
        };
    },
    mounted () {
        this.updateElementBounds();
    },
    computed: {
        pageNumber () {
            return this.page.pageNumber || 0;
        },
        // 是否聚焦当前页
        isFocus () {
            const { offsetTop, bottom, offsetHeight, scrollTop, clientHeight } = this;
            if (!offsetHeight) return;

            const halfHeight = (offsetHeight / 2);
            const halfScreen = (clientHeight / 2);
            const delta = offsetHeight >= halfScreen ? halfScreen : halfHeight;
            const threshold = scrollTop + delta;

            return offsetTop < threshold && bottom >= threshold;
        },

        bottom () {
            return this.offsetTop + this.offsetHeight;
        },

        viewport () {
            const cssDpi = 96 / 72;
            const scale = this.scale * cssDpi;
            const viewport = this.isImage ? this.getImageViewport(clone(this.page), scale) :
                this.page.getViewport({ scale }).clone({ scale });
            return viewport;
        },

        elementStyle () {
            let { height, width } = this.viewport;
            height = this.maxWidth / width * height;
            if(this.maxWidth > width) {
              width = this.maxWidth;
            }
            return { height: `${height}px`, width: `${width}px` };
        },

        scrollBottom () {
            return this.scrollTop + this.clientHeight;
        },

        isFocusNo () {
            return this.currentPage === this.pageNumber
        }
    },
    watch: {
        isFocusNo: {
            handler (nv) {
                if (nv) this.updatePageNumber()
            },
        },
        isFocus (nv) {
            nv && this.$listeners['update-page-number'] && this.$listeners['update-page-number'](this.pageNumber);
        },
        scale: 'updateElementBounds'
    },
    methods: {
        updatePageNumber () {
            if (this.isFocus) return;
            this.onUpdateScrollTop();
        },

        /** 图片模式下获取 viewport */
        getImageViewport (demension, scale) {
            let { width = 0, height = 0 } = demension;
            width = width * scale;
            height = height * scale;
            return Object.assign(demension, { width, height })
        },

        /** 更新元素高度 */
        updateElementBounds () {
            this.$nextTick(() => {
                const { offsetTop = 0, offsetHeight = 0, clientWidth = 0 } = this.$el || {};
                this.offsetTop = offsetTop;
                this.offsetHeight = offsetHeight;
                this.clientWidth = clientWidth;
            })
        },

        onUpdateScrollTop () {
            this.$emit('update-scroll-top', this.offsetTop);
        }
    },
};
</script>

<style lang="less" scoped>
.pdf-scroll-page {
    margin: 0 auto 24px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
    position: relative;
    background: #fff;

    &:before {
        content: "";
        display: block;
        border-bottom: 24px solid #ccc;
        border-right: 24px solid #ccc;
        border-left: 24px solid transparent;
        border-top: 24px solid transparent;
        position: absolute;
        bottom: -1px;
        right: -1px;
        z-index: 1;
    }

    .page-number-content {
        position: absolute;
        bottom: 3px;
        right: 9px;
        z-index: 1;
        color: #fff;
        user-select: none;
    }
}
</style>
