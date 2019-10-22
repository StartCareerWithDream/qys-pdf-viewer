<template>
    <div class="pdf-document">
        <scroll-document v-if="pages.length"
                         v-bind="{ pages, pageCount, currentPage, scale, maxWidth, isImage, demensions }"
                         v-slot="{ page, scale }"
                         v-on="$listeners">
           <component :is="componentName" v-bind="{ page, scale, currentPage, onlyCanvas, watermarkText, maxWidth }"
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
        demensions: Array
    },
    components: { ScrollDocument, PdfPageContent, PdfSkeleton, PdfPageImage },
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
