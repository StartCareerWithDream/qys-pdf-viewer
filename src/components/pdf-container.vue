<template>
    <div class="pdf-viewer-container">
      <!-- 头部 -->
        <div class="pdf-viewer-header" v-if="visibleHeader">
            <button @click="currentPage --;">-</button>
            {{currentPage}}
            <button @click="currentPage++;">+</button>
            {{pageCount}}

            <button @click="scale -= 0.1">scale --</button>
            <button @click="scale += 0.1">scale ++</button>
        </div>
        <!-- 文档内容 -->
        <pdf-document class="pdf-viewer-body" v-bind="{ pages, pageCount, currentPage, scale, onlyCanvas, watermark, watermarkText }">
            <template slot-scope="scope">
               <slot v-bind="scope"></slot>
            </template>
        </pdf-document>
    </div>
</template>

<script>
import PdfData from './pdf-data';
import PdfDocument from './pdf-document';

export default {
  components: { PdfDocument },
  name: 'PdfViewerContainer',
  mixins: [PdfData],
  data() {
    return {
      currentPage: 1,
      scale: 1,
    };
  },
  props: {
    visibleHeader: Boolean
  },
  provide() {
    return {
      'update-page-number': this.updateCurrentPage,
      'on-drop': this.onDrop,
      'on-drag-over': this.onDragOver,
      'on-drag-leave': this.onDragLeave
    };
  },
  watch: {
    currentPage: {
      handler(nv) {
        if (nv && nv === this.pages.length) {
          this.fetchPages(nv + 1);
        }
      },
    },
  },
  methods: {
    /** 更新页码 */
    updateCurrentPage(pageNo) {
      this.currentPage = pageNo;
    },

    /** 监听拖动时间 */
    onDrop(e, pageNo) {
        this.$emit('on-drop', e, pageNo)
    },

    onDragOver(e, pageNo) {
        this.$emit('on-drag-over', e, pageNo)
    },

    onDragLeave(e, pageNo) {
        this.$emit('on-drag-leave', e, pageNo)
    },
  },
};
</script>

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
