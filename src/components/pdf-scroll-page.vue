<template>
    <div class="pdf-scroll-page"
         :style="elementStyle"
         ref="pdf-scroll-page">
        <slot v-bind="{ page, scale }"></slot>
    </div>
</template>

<script>

export default {
  name: 'PdfScrollPage',
  props: {
    page: Object,
    scrollTop: Number,
    clientHeight: Number,
    currentPage: Number,
    scale: Number,
  },
  data() {
    return {
      offsetHeight: 0,
      offsetTop: 0,
      clientWidth: 0,
    };
  },
  inject: ['update-page-number'],
  mounted() {
    this.updateElementBounds();
  },
  computed: {
    pageNumber() {
      return this.page.pageNumber || 0;
    },
    // 是否聚焦当前页
    isFocus() {
      const {
        offsetTop, bottom, offsetHeight, scrollTop, clientHeight,
      } = this;
      if (!offsetHeight) return false;

      const halfHeight = (offsetHeight / 2);
      const halfScreen = (clientHeight / 2);
      const delta = offsetHeight >= halfScreen ? halfScreen : halfHeight;
      const threshold = scrollTop + delta;

      return offsetTop < threshold && bottom >= threshold;
    },

    bottom() {
      return this.offsetTop + this.offsetHeight;
    },

    viewport() {
      const cssDpi = 96 / 72;
      const scale = this.scale * cssDpi;
      const viewport = this.page.getViewport({ scale }).clone({ scale });
      return viewport;
    },

    elementStyle() {
      const { height, width } = this.viewport;
      return { height: `${height}px`, width: `${width}px` };
    },

    scrollBottom() {
      return this.scrollTop + this.clientHeight;
    },
  },
  watch: {
    isFocus: {
      handler(nv) {
        if (nv) {
          this['update-page-number'].call(null, this.pageNumber);
        }
      },
    },
    currentPage: {
      handler(nv) {
        if (this.pageNumber === nv) {
          if (this.isFocus) return;
          this.$emit('update-scroll-top', this.offsetTop);
        }
      },
    },
  },
  methods: {
    /** 更新元素高度 */
    updateElementBounds() {
      const { offsetTop, offsetHeight, clientWidth } = this.$el;
      this.offsetTop = offsetTop;
      this.offsetHeight = offsetHeight;
      this.clientWidth = clientWidth;
    },
  },
};
</script>

<style lang="less" scoped>
.pdf-scroll-page {
    margin: 0 auto 24px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
    position: relative;
}
</style>
