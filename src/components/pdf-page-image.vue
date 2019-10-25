<i18n>
{
    "zh_CN": {},
    "en_US": {}
}
</i18n>
<template>
    <div class="pdf-page-image pdf-page-content"
         v-visible="renderCanvas"
         ondragstart='return false;'
         @drop="$listeners['on-drop'] && $listeners['on-drop']($event, pageNumber)"
         @dragover="$listeners['on-drag-over'] && $listeners['on-drag-over']($event, pageNumber)"
         @dragleave="$listeners['on-drag-leave'] && $listeners['on-drag-leave']($event, pageNumber)">
        <canvas ref="canvas"
                v-show="isLoaded"></canvas>
        <!-- 骨架屏 -->
        <pdf-skeleton v-if="visibleSkeleton"
                      :height="canvasAttrs.height"
                      :style="skeletonStyle"></pdf-skeleton>

        <!-- slot -->
        <slot v-bind="{ pageNumber, scale, optimalScale }"></slot>
    </div>
</template>

<script>
import PdfSkeleton from './pdf-skeleton';
import visible from '../directives/visible';

export default {
    name: 'ContractCanvas',
    components: { PdfSkeleton },
    props: {
        page: Object,
        scale: Number,
        maxWidth: Number,
        watermarkText: String,
        currentPage: Number,
        pageNumber: Number,
        viewport: Object,
        optimalScale: Number
    },
    directives: { visible },
    computed: {
        visibleSkeleton() {
            const gap = this.currentPage - this.pageNumber;
            return !this.isLoaded && gap >= -2 && gap <= 2
        },
        canvasAttrs () {
            let { width, height } = this.viewport;
            height = this.maxWidth / width * height;
            if (this.maxWidth > width) {
                width = this.maxWidth;
            }
            return { height, width };
        },
        skeletonStyle () {
            let { width, height } = this.viewport;
            height = this.maxWidth / width * height;
            if (this.maxWidth > width) {
                width = this.maxWidth;
            }
            return { height: `${height}px`, width: `${width}px` };
        }
    },
    watch: {
        currentPage: {
            handler(nv) {
                if(nv === this.pageNumber) {
                    this.renderCanvas();
                }
            },
            immediate: true
        },
        // canvas在宽高发生改变是会清空内容 所以此处使用drawImage重新渲染， 也可使用 getImageData putImageData配合使用
        canvasAttrs: {
            handler(nv) {
                if(this.img && this.canvas) {
                    const { width , height } = nv;
                    this.canvas.width = width;
                    this.canvas.height = height;
                    const cxt = this.canvas.getContext('2d');
                    cxt.drawImage(this.img, 0, 0, width, height);
                    this.paintWaterMark(cxt);
                }
            },
            deep: true
        }
    },
    data () {
        return {
            img: null,
            elementHeight: 0,
            widthChange: false,
            isLoaded: false,
            throttledScroll: null,
            scrollTop: 0,
            canvas: null
        }
    },
    methods: {
        /**
         * 绘制图片
         */
        renderCanvas () {
            this.$nextTick(() => {
                if (this.img && this.isLoaded) return;
                const { width, height } = this.canvasAttrs;
                let canvas = this.$refs['canvas'];
                if(!canvas) return;
                this.canvas = canvas;
                let ctx = canvas.getContext("2d");
                canvas.width = width;
                canvas.height = height;
                if (!this.img) {  
                    this.img = new Image();
                    this.img.src = this.page.url;
                    this.img.onload = () => {
                        ctx.save();
                        ctx.drawImage(this.img, 0, 0, width, height);
                        ctx.restore();
                        this.isLoaded = true;
                        this.paintWaterMark(ctx);
                    }
                    this.img.onerror = () => {
                        this.img = null;
                    }
                }
            })
        },

        clearCanvas() {
            let { width, height } = this.canvasAttrs;
            let ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, width, height);
        },

        /**
        * 绘制水印
        */
        paintWaterMark (ctx) {
            if(!this.watermarkText) return;
            ctx.font = '18px Microsoft YaHei';
            ctx.fillStyle = 'rgba(211, 210, 211, 0.3';
            for (let i = 0; i < 100; i++) {
                ctx.save();
                ctx.translate(400 * (i % 5), 373 * parseInt((i / 5).toString()));
                ctx.rotate(-(Math.PI * (1 / 4)));
                ctx.fillText(this.watermarkText, 0, 0);
                ctx.restore();
            }
        },
    }
}
</script>

<style lang="less" scoped>
canvas {
    display: block;
}

.pdf-page-image {
    position: relative;
}
</style>

