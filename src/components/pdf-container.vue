<template>
    <div class="pdf-viewer-container">
        <!-- 头部 -->
        <pdf-toolbar :scale.sync="scale"
                     :current-page.sync="currentPage"
                     v-bind="{ pageCount }" />

        <!-- 文档内容 -->
        <pdf-document class="pdf-viewer-body"
                      v-bind="{ pages, pageCount, currentPage, scale, onlyCanvas, watermarkText, maxWidth, isImage, demensions }"
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
    props: {
        visibleToolbar: Boolean,
    },
    watch: {
        scale: {
            handler (nv) {
                this.maxWidth = 800 * nv;
            }
        },
    },
    methods: {
        /** 更新页码 */
        updateCurrentPage (pageNo) {
            this.currentPage = pageNo;
        },
    },
};
</script>


<style lang="less">
@import url("//at.alicdn.com/t/font_577600_jtwrq1t5f.css");
</style>
<style lang="less" scoped>
.pdf-viewer-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    margin: 0 auto;
    justify-items: center;
}
.pdf-viewer-body {
    flex: 1;
}
</style>
