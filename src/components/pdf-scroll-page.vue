<template>
    <div class="pdf-scroll-page"
         :style="elementStyle"
         ref="pdf-scroll-page">
        <slot v-bind="{ page, scale }"></slot>
        <pdf-skeleton v-if="showSkeleton"></pdf-skeleton>
        <span class="page-number-content">{{pageNumber}}</span>
    </div>
</template>

<script>
import PdfSkeleton from './pdf-skeleton'

export default {
  components: { PdfSkeleton },
  name: 'PdfScrollPage',
  props: {
    page: Object,
    scrollTop: Number,
    clientHeight: Number,
    currentPage: Number,
    scale: Number,
    isToBottom: Boolean
  },
  data() {
    return {
      offsetHeight: 0,
      offsetTop: 0,
      clientWidth: 0,
      showSkeleton: true
    };
  },
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
      const threshold = scrollTop + delta * 2;
      const direction = this.isToBottom ? bottom >= threshold : bottom >= scrollTop
      return offsetTop < threshold  && direction;
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
      let { height, width } = this.viewport;
      if(width > 800) {
        height = 800 / width * height;
        width = 800
      }
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
            this.$listeners['update-page-number'] && this.$listeners['update-page-number'](this.pageNumber)
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

    triggerSkeleton(visible) {
      this.showSkeleton = visible;
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
      content: '';
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
