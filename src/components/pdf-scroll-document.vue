<template>
    <div class="pdf-scroll-document"
         ref="pdf-scroll-document"
         v-scroll.immediate="updateScrollBounds">
        <template v-for="(page, index) in pages">
            <pdf-scroll-page v-bind="{ page, scrollTop, clientHeight, currentPage, scale }"
                             @update-scroll-top="onUpdateScrollTop"
                             :key="index">
                <slot v-bind="{ page, scale }"></slot>
            </pdf-scroll-page>
        </template>
    </div>
</template>

<script>
import PdfScrollPage from './pdf-scroll-page';
import scroll from '../directives/scroll';

export default {
  name: 'PdfScrollDocument',
  components: { PdfScrollPage },
  props: {
    pageCount: Number,
    pages: Array,
    currentPage: Number,
    scale: Number,
  },
  data() {
    return {
      scrollTop: 0,
      clientHeight: 0,
      pageSetting: {
        a: 1,
      },
    };
  },
  inject: ['pages-fetch'],
  directives: { scroll },
  methods: {
    /** 更新当前滚动距离 */
    updateScrollBounds() {
      const { scrollTop, clientHeight } = this.$el;
      this.scrollTop = scrollTop;
      this.clientHeight = clientHeight;
    },

    /** 更新滚动条位置 */
    onUpdateScrollTop(scrollTop) {
      this.$el.scrollTop = scrollTop;
    },
  },
};
</script>

<style lang="less" scoped>
.pdf-scroll-document {
    position: relative;
    height: 100%;
    overflow: auto;
}
</style>
