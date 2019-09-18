<template>
    <div class="pdf-page-content"
         :class="{ 'is-loading': !loaded }"
         v-visible="renderPdf"
         ref="pdf-content"
         ondragstart='return false;'
         @drop="onDrop($event, pageNumber)"
         @dragover="onDragOver($event, pageNumber)"
         @dragleave="onDragleave($event, pageNumber)">
        <slot v-bind="{ pageNumber }"></slot>
        <span class="page-number-content">{{pageNumber}}</span>
    </div>
</template>

<script>
import visible from '../directives/visible';
import * as pdfjsViewer from 'qys-pdf/web/pdf_viewer';

export default {
    name: 'PdfPageContent',
    props: {
        page: Object,
        scale: Number,
        currentPage: Number,
        onlyCanvas: Boolean,
        watermark: Boolean,
        watermarkText: {
            type: String,
            default: `杨旺旺-${new Date().toLocaleString()}`
        }
    },
    inject: ['on-drop', 'on-drag-over', 'on-drag-leave', 'page-rendered', 'page-render-error'],
    data () {
        return {
            renderTask: null,
            loading: false,
            loaded: false
        };
    },
    computed: {
        pageNumber () {
            return this.page.pageNumber || 0;
        },
        viewport () {
            const cssDpi = 96 / 72;
            const scale = this.scale * cssDpi;
            const viewport = this.page.getViewport({ scale }).clone({ scale });
            return viewport;
        },
    },
    watch: {
        scale () {
            this.updatePdfRender();
        },
    },
    directives: { visible },
    methods: {

        /***** DOM事件处理 ***** */

        onDrop(e, pageNo) {
            this['on-drop'].call(this, e, pageNo)
        },

        onDragOver(e, pageNo) {
            this['on-drag-over'].call(this, e, pageNo)
        },

        onDragleave(e, pageNo) {
            this['on-drag-leave'].call(this, e, pageNo)
        },

        /**
        * 绘制水印
        */
        paintWaterMark (ctx) {
            ctx.font = '18px Microsoft YaHei';
            ctx.fillStyle = 'rgba(211, 210, 211, 0.3';
            for (let i = 0; i < 100; i++) {
                ctx.save();
                ctx.translate(300 * (i % 5), 280 * parseInt((i / 5).toString()));
                ctx.rotate(-(Math.PI * (1 / 4)));
                ctx.fillText(this.watermarkText, 0, 0);
                ctx.restore();
            }
        },

        /** 使用默认方式渲染 */
        renderPageView () {
            const viewport = this.page.getViewport({ scale: this.scale })
            console.log('%c⧭', 'color: #ffa280', viewport)
            // 渲染任务 通过onlyCanvas 配置是否需要html DOM节点
            this.renderTask = new pdfjsViewer.PDFPageView({
                container: this.$refs['pdf-content'],
                id: this.pageNumber,
                scale: this.scale,
                defaultViewport: viewport,
                textLayerFactory: this.onlyCanvas ? null : new pdfjsViewer.DefaultTextLayerFactory(),
                annotationLayerFactory: this.onlyCanvas ? null : new pdfjsViewer.DefaultAnnotationLayerFactory(),
            });
            this.renderTask.setPdfPage(this.page);
            this.renderTask.draw().then(() => {
                this.loading = false;
                this.loaded = true;
                this['pdf-rendered'].call(this, this.pageNumber);
                // 绘制水印
                if (this.watermark) {
                    const context = this.renderTask.canvas.getContext("2d");
                    this.paintWaterMark(context)
                }
            }).catch((error) => {
                this.loading = false;
                this['pdf-render-error'].call(this, this.pageNumber, error)
            });
        },

        /** 渲染pdf */
        renderPdf () {
            if (this.renderTask) return;
            this.loading = true;
            this.renderPageView(); 
        },

        /** 更新 pdfscale */
        updatePdfRender () {
            if (!this.renderTask) return;
            this.renderTask.update(this.scale);
            this.renderTask.draw().then(() => {
                this.loading = false;
                this.$emit('pdf-rendered', this.pageNumber);
                // 绘制水印
                if (this.watermark) {
                    const context = this.renderTask.canvas.getContext("2d");
                    this.paintWaterMark(context)
                }
            }).catch((error) => {
                this.loading = false;
                this.$emit('pdf-render-error', this.pageNumber, error);
            });
        },

        /** 销毁pdf实例 */
        destoryRenderTask () {
            if (!this.renderTask) return;
            this.renderTask.destroy();
            this.renderTask = null;
        },
    },
    beforeDestroy () {
        this.destoryRenderTask();
    },
};
</script>

<style lang="less" scoped>
.pdf-page-content {
    position: relative;

    &.is-loading {}

    .page-number-content {
        position: absolute;
        bottom: 3px;
        right: 9px;
        z-index: 1;
        color: #fff;
        user-select: none;
    }

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
}
</style>
