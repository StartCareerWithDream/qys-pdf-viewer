<template>
    <div class="pdf-document">
        <scroll-document v-if="pages.length"
                         ref="scroll-document"
                         v-bind="{ pages, pageCount, currentPage, scale, maxWidth, isImage, dimensions }"
                         v-slot="{ page, scale, viewport, optimalScale, pageNumber }"
                         v-on="$listeners">
           <component :is="componentName" v-bind="{ page, scale, currentPage, onlyCanvas, watermarkText, maxWidth, optimalScale, viewport, pageNumber }"
                              v-on="$listeners">
                <template v-slot="scope">
                    <slot v-bind="scope"></slot>
                </template>
           </component>
        </scroll-document>
        <pdf-skeleton class="empty-page" v-else></pdf-skeleton>
    </div>
</template>

<script>
import ScrollDocument from './pdf-scroll-document';
import PdfPageContent from './pdf-page-content';
import PdfPageImage from './pdf-page-image';
import PdfSkeleton from './pdf-skeleton'

export default {
    name: 'PdfDocument',
    computed: {
        componentName() {
            return this.isImage ? 'PdfPageImage' : 'PdfPageContent'
        },
    },
    props: {
        pages: Array,
        pageCount: Number,
        scale: Number,
        currentPage: Number,
        onlyCanvas: Boolean,
        watermarkText: String,
        maxWidth: Number,
        isImage: Boolean,
        dimensions: Array
    },
    components: { ScrollDocument, PdfPageContent, PdfSkeleton, PdfPageImage },
    methods: {
        updateScrollTop(scroll) {
            this.$refs['scroll-document'].onUpdateScrollTop(scroll);
        }
    }
};
</script>

<style lang="less" scoped>
.pdf-document {
    height: 100%;

    .empty-page {
        width: 800px;
        height: 1100px;
        margin: 0 auto;
        background: #fff;
    }
}
</style>
