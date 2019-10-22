<i18n>
{
    "zh_CN": {},
    "en_US": {}
}
</i18n>
<template>
    <div v-visible="renderCanvas">
        <canvas ref="canvas"
                v-show="isLoaded"
                v-bind="{ ...canvasAttrs }"></canvas>
        <!-- 骨架屏 -->
        <pdf-skeleton v-if="!isLoaded"
                      :height="canvasAttrs.height"
                      :style="skeletonStyle"></pdf-skeleton>
    </div>
</template>

<script>
import PdfSkeleton from './pdf-skeleton';
import visible from '../directives/visible';
import { clone } from '../utils/base';

export default {
    name: 'ContractCanvas',
    components: { PdfSkeleton },
    props: {
        page: Object,
        scale: Number,
        maxWidth: Number,
        watermarkText: String
    },
    directives: { visible },
    computed: {
        pageNumber () {
            return this.page.pageNumber
        },
        viewport () {
            const getImageViewport = function (demension, scale) {
                let { width = 0, height = 0 } = demension;
                width = width * scale;
                height = height * scale;
                return Object.assign(demension, { width, height })
            };
            const page = clone(this.page)
            return getImageViewport(page, this.scale)
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
        },
    },
    data () {
        return {
            img: null,
            elementHeight: 0,
            widthChange: false,
            isLoaded: false,
            throttledScroll: null,
            scrollTop: 0
        }
    },
    methods: {
        /**
         * 绘制图片
         */
        renderCanvas () {
            this.$nextTick(() => {
                const { width, height } = this.canvasAttrs;
                let canvas = this.$refs['canvas'];
                if(!canvas) return;
                let ctx = canvas.getContext("2d");
                canvas.width = width;
                canvas.height = height;
                if (this.img && this.isLoaded) return;
                if (this.img) {
                    this.isLoaded = true;
                    this.paintWaterMark(ctx);
                } else {
                    this.img = new Image();
                    this.img.src = this.page.src;
                    this.img.onload = () => {
                        this.isLoaded = true;
                        this.paintWaterMark(ctx);
                    }
                    this.img.onerror = () => {
                        this.img = null;
                    }
                }
            });
        },

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
    }
}
</script>

<style lang="less" scoped>
canvas {
    display: block;
}
</style>

