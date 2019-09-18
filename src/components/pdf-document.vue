<template>
    <div class="pdf-document">
        <scroll-document v-bind="{ pages, pageCount, currentPage, scale }"
            v-slot="{ page, scale }">
            <pdf-page-content v-bind="{ page, scale, currentPage, onlyCanvas, watermark, watermarkText }">
                <template slot-scope="scope">
                    <slot v-bind="scope"></slot>
                </template>
            </pdf-page-content>
        </scroll-document>
    </div>
</template>

<script>
import ScrollDocument from './pdf-scroll-document';
import PdfPageContent from './pdf-page-content';

export default {
  name: 'PdfDocument',
  props: {
    pages: Array,
    pageCount: Number,
    scale: Number,
    currentPage: Number,
    onlyCanvas: Boolean,
    watermark: Boolean,
    watermarkText: String
  },
  components: { ScrollDocument, PdfPageContent },
};
</script>

<style lang="less" scoped>
.pdf-document {
    height: 100%;
}
</style>
