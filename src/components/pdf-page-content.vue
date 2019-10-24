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
import PdfSkeleton from './pdf-skeleton'
import Vue from 'vue'

export default {
    name: 'PdfPageContent',
    props: {
        page: Object,
        scale: Number,
        currentPage: Number,
        onlyCanvas: Boolean,
        watermarkText: String,
        maxWidth: Number
    },
    data () {
        return {
            pdfViewer: null,
            renderStatus: 0, // 0 未渲染 1 已渲染 2 已重置
            loaded: false
        };
    },
    computed: {
        pageNumber () {
            return this.page.pageNumber || 0;
        },
        viewport () {
            const cssDpi = 96 / 72;
            let scale = this.scale * cssDpi;
            const viewport = this.page.getViewport({ scale }).clone({ scale });
            return viewport;
        },
        optimalScale () {
            return this.maxWidth / this.viewport.width * this.scale;
        }
    },
    watch: {
        scale () {
            this.updatePdfRender();
        },
        // 处理当前页激活时渲染 10页前的页码销毁
        currentPage: {
            handler (nv) {
                const gap = nv - this.pageNumber;
                if (-2 <= gap && gap <= 2) {
                    if (this.pdfViewer) {
                        // 判断重置过才更新
                        this.pdfViewer.renderingState === 0 && this.updatePdfRender(true)
                    } else { // 防止 v-visible 未触发
                        // 延迟1S 尽量保证使用 v-visible 触发
                        setTimeout(() => {
                            this.renderPdf()
                        }, 500)
                    }
                } else if (this.pageNumber <= nv - 10) {
                    // 渲染过才能重置
                    this.pdfViewer && this.pdfViewer.renderingState === 3 && this.resetpdfViewer()
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
            ctx.font = '24px Microsoft YaHei';
            ctx.fillStyle = 'rgba(211, 210, 211, 0.3';
            for (let i = 0; i < 100; i++) {
                ctx.save();
                ctx.translate(400 * (i % 5), 373 * parseInt((i / 5).toString()));
                ctx.rotate(-(Math.PI * (1 / 4)));
                ctx.fillText(this.watermarkText, 0, 0);
                ctx.restore();
            }
        },

        /** 使用默认方式渲染 */
        renderPageView () {
            // 渲染任务 通过onlyCanvas 配置是否需要html DOM节点
            // 骨架屏配置
            const el = new (Vue.extend(PdfSkeleton))().$mount();

            this.pdfViewer = new pdfjsViewer.PDFPageView({
                container: this.$refs['pdf-content'],
                id: this.pageNumber,
                scale: this.optimalScale,
                textLayerMode: false,
                renderInteractiveForms: false,
                useOnlyCssZoom: false,
                skeleton: el.$el,
                maxCanvasPixels: 5242880,
                defaultViewport: this.page.getViewport(this.optimalScale),
                textLayerFactory: this.onlyCanvas ? null : new pdfjsViewer.DefaultTextLayerFactory(),
                annotationLayerFactory: this.onlyCanvas ? null : new pdfjsViewer.DefaultAnnotationLayerFactory(),
                renderer: 'canvas'
            });

            this.pdfViewer.setPdfPage(this.page);
            this.pdfViewer.draw().then(() => {
                this.loaded = true;
                this.$listeners['page-rendered'] && this.$listeners['page-rendered'].call(null, this.pageNumber)
                // 绘制水印
                if (this.watermarkText) {
                    const context = this.pdfViewer.canvas.getContext("2d");
                    this.paintWaterMark(context)
                }
            }).catch((error) => {
                this.$listeners['page-render-error'] && this.$listeners['page-render-error'].call(null, this.pageNumber, error)
            });

        },

        /** 渲染pdf */
        renderPdf () {
            if (this.pdfViewer) return;
            this.renderPageView();
        },

        /** 更新 pdfscale */
        updatePdfRender (init) {
            if (!this.pdfViewer) return;
            this.pdfViewer.update(this.optimalScale);
    
            if (init && this.loaded) {
                this.pdfViewer.draw().then(() => {
                    // 绘制水印
                    if (this.watermarkText) {
                        const context = this.pdfViewer.canvas.getContext("2d");
                        this.paintWaterMark(context)
                    }
                }).catch((error) => {
                    this.$listeners['page-render-error'] && this.$listeners['page-render-error'].call(null, this.pageNumber, error)
                });
            }
        },

        /** 销毁pdf实例 */
        destorypdfViewer () {
            if (!this.pdfViewer) return;
            this.pdfViewer.destroy && this.pdfViewer.destroy();
            this.pdfViewer = null;
        },

        /** 重置渲染实例 销毁DOM节点 */
        resetpdfViewer () {
            if (!this.pdfViewer) return;
            this.renderStatus = 2;
            this.pdfViewer.destroy();
        }
    },
    beforeDestroy () {
        this.destorypdfViewer();
    },
};
</script>

<style lang="less" scoped>
.pdf-page-content {
    position: relative;
}
</style>
