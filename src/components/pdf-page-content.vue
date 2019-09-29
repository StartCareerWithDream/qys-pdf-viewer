<template>
    <div class="pdf-page-content"
         ref="pdf-content"
         v-visible="renderPdf"
         ondragstart='return false;'
         @drop="$listeners['on-drop'] && $listeners['on-drop']($event, pageNumber)"
         @dragover="$listeners['on-drag-over'] && $listeners['on-drag-over']($event, pageNumber)"
         @dragleave="$listeners['on-drag-leave'] && $listeners['on-drag-leave']($event, pageNumber)">
        <slot v-bind="{ pageNumber }"></slot>
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
        watermarkText: String
    },
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
        // 处理当前页激活时渲染 10页前的页码销毁
        currentPage: {
            handler(nv) {
                if(nv === this.pageNumber) {
                    this.updatePdfRender()
                } else if(this.pageNumber <= nv - 10) {
                    this.resetRenderTask()
                }
            },
        }
    },
    directives: { visible },
    methods: {
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
                // 关闭骨架屏样式
                this.$parent.triggerSkeleton(false);
                this.$listeners['page-rendered'] && this.$listeners['page-rendered'].call(null, this.pageNumber)
                // 绘制水印
                if (this.watermarkText) {
                    const context = this.renderTask.canvas.getContext("2d");
                    this.paintWaterMark(context)
                }
            }).catch((error) => {
                this.loading = false;
                this.$listeners['page-render-error'] && this.$listeners['page-render-error'].call(null, this.pageNumber, error)
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
            this.$parent.triggerSkeleton(true);
            this.renderTask.update(this.scale);
            this.renderTask.draw().then(() => {
                this.loading = false;
                this.$parent.triggerSkeleton(false);
                // 绘制水印
                if (this.watermarkText) {
                    const context = this.renderTask.canvas.getContext("2d");
                    this.paintWaterMark(context)
                }
            }).catch((error) => {
                this.loading = false;
                this.$listeners['page-render-error'] && this.$listeners['page-render-error'].call(null, this.pageNumber, error)
            });
        },

        /** 销毁pdf实例 */
        destoryRenderTask () {
            if (!this.renderTask) return;
            this.renderTask.destory();
            this.renderTask = null;
        },

        /** 重置渲染实例 销毁DOM节点 */
        resetRenderTask() {
            if(!this.renderTask) return;
            this.renderTask.reset();
        }
    },
    beforeDestroy () {
        this.destoryRenderTask();
    },
};
</script>

<style lang="less" scoped>
.pdf-page-content {
    position: relative;
}
</style>
