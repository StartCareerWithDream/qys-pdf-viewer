<template>
    <div class="pdf-viewer-container">
        <!-- 头部 -->
        <pdf-toolbar :scale.sync="scale"
                     :current-page.sync="currentPage"
                     v-bind="{ pageCount, documentDimension }" />

        <!-- 文档内容 -->
        <pdf-document class="pdf-viewer-body"
                      ref="pdf-document"
                      v-bind="{ pages, pageCount, currentPage, scale, onlyCanvas, watermarkText, maxWidth, isImage, dimensions }"
                      v-on="$listeners"
                      @update-page-number="updateCurrentPage">
            <template v-slot="scope">
                <slot v-bind="scope"></slot>
            </template>
        </pdf-document>
    </div>
</template>

<script>
import PdfData from './pdf-data';
import PdfDocument from './pdf-document';
import PdfToolbar from './pdf-toolbar'

export default {
    components: { PdfDocument, PdfToolbar },
    name: 'PdfViewerContainer',
    mixins: [PdfData],
    data () {
        return {
            focusPage: 1,
            currentPage: 1,
            scale: 1,
            maxWidth: 800,
        };
    },
    watch: {
        defaultMaxWidth: {
            handler(nv) {
                this.maxWidth = nv;
            },
            immediate: true
        },
        scale: {
            handler (nv = 1) {
                this.maxWidth = this.defaultMaxWidth * nv;
                this.$emit('scale-change', parseInt(nv * 100) / 100);
            }
        },
    },
    methods: {
        /** 更新页码 */
        updateCurrentPage (pageNo) {
            this.currentPage = pageNo;
        },

        updateScrollTop(scrollTop) {
            this.$refs['pdf-document'].updateScrollTop(scrollTop)
        },
    },
};
</script>


<style lang="less">
@import url("../fonts/iconfont.css");
</style>
<style lang="less" scoped>
.pdf-viewer-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0 auto;
    justify-items: center;
}
.pdf-viewer-body {
    flex: 1;
}
</style>
