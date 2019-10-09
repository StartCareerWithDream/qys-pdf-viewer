<template>
    <div class="pdf-document">
        <scroll-document v-if="pages.length"
                         v-bind="{ pages, pageCount, currentPage, scale, maxWidth }"
                         v-slot="{ page, scale }"
                         v-on="$listeners">
            <pdf-page-content v-bind="{ page, scale, currentPage, onlyCanvas, watermarkText, maxWidth }"
                              v-on="$listeners">
                <template v-slot="scope">
                    <slot v-bind="scope"></slot>
                </template>
            </pdf-page-content>
        </scroll-document>
        <pdf-skeleton class="empty-page" v-else></pdf-skeleton>
    </div>
</template>

<script>
import ScrollDocument from './pdf-scroll-document';
import PdfPageContent from './pdf-page-content';
import PdfSkeleton from './pdf-skeleton'

export default {
    name: 'PdfDocument',
    props: {
        pages: Array,
        pageCount: Number,
        scale: Number,
        currentPage: Number,
        onlyCanvas: Boolean,
        watermarkText: String,
        maxWidth: Number
    },
    components: { ScrollDocument, PdfPageContent, PdfSkeleton },
};
</script>

<style lang="less" scoped>
.pdf-document {
    height: 100%;

    .empty-page {
        width: 793px;
        height: 1100px;
        margin: 0 auto;
        background: #fff;
    }
}
</style>
