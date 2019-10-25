<script>
import * as pdfjsLib from 'qys-pdf/webpack';
import 'qys-pdf/web/pdf_viewer.css';

/** 快速生成数组 */
const pageRange = (start, end) => {
    let last = end;
    last += 1;
    return Array(last - start).fill(0).map((v, i) => i + start);
};

// const PAGE_SIZE = 10;

export default {
    name: 'PdfData',
    props: {
        url: String, // pdf文档流请求地址
        cMapUrl: { // 字体解析包请求地址
            type: String,
            default: '/js/cmaps/'
        },
        options: { // pdf基础配置
            type: Object,
            default: null
        },
        onlyCanvas: { // 仅渲染canvas
            type: Boolean,
            default: true
        },
        watermarkText: String, // 水印文字
        dimensions: { // 渲染图片时的页面信息
            type: Array,
            default: () => { return [] }
        },
        defaultMaxWidth: {
            type: Number,
            default: 800
        },
        documentDimension: { // 文档的基本信息
            type: Object,
            default: () => { return {"type":{"width":210,"height":297,"type":"A4"},"width":210,"height":297,"pixelWidth":595,"pixelHeight":842} }
        },
        imageBaseUrl: String, // 图片基本请求地址
        isImage: Boolean, // 是否启用图片渲染模式
        visibleToolbar: Boolean, // 显示工具栏
    },
    data () {
        return {
            loadingTask: null,
            pageCount: 0,
            pdfDocument: null,
            pages: [],
        };
    },
    watch: {
        pageCount: {
            handler (nv) {
                if (nv && !this.isImage) {
                    this.fetchPages();
                }
            },
        },
        url: {
            handler (nv) {
                if (nv && !this.isImage) {
                    let params = {
                        url: this.url,
                        cMapUrl: this.cMapUrl,
                        cMapPacked: true,
                    }
                    if (this.options) {
                        params = Object.assign(params, this.options)
                    }
                    this.pages = [];
                    this.currentPage = 1;
                    this.pageCount = 0;
                    this.loadingTask = null;
                    this.loadingTask = pdfjsLib.getDocument(params);
                    this.getDocuments();
                }
            },
            immediate: true
        },
        'isImage': {
            handler (nv) {
               if(nv) this.getImageSet()
            },
            immediate: true
        }
    },
    beforeDestroy () {
        this.pages = [];
    },
    methods: {
        /** 获取pdf文档 */
        async getDocuments () {
            try {
                this.loadingTask.promise.then(async (pdfDocument) => {
                    this.pdfDocument = pdfDocument;
                    this.pageCount = pdfDocument.numPages;
                    this.$emit('document-rendered');
                });
            } catch (error) {
                this.$emit('document-render-error', error);
            }
        },

        /** 获取pdf页面数据 */
        async getPages (pdf, start, end) {
            try {
                const requestSet = pageRange(start, end).map(pageNo => pdf.getPage(pageNo));
                return Promise.all(requestSet);
            } catch (error) {
                throw new Error(error);
            }
        },

        /** 加载pdf数据 每次加载10页 PAGE_SIZE */
        async fetchPages () {
            try {
                if (!this.pageCount) return;
                if (this.pageCount && this.pageCount === this.pages.length) return;
                // const start = this.pages.length + 1;
                // const endNo = Math.min(Math.max(pageNo, (pageNo + PAGE_SIZE)), this.pageCount);
                const partsOfPages = await this.getPages(this.pdfDocument, 1, this.pageCount);
                // this.pages.splice(0, 0, ...partsOfPages);
                this.pages = partsOfPages;
            } catch (error) {
                console.log(error);
            }
        },

        getImageSet () {
            try {
                if(!this.dimensions.length) throw new Error('未设置文档信息： dimensions');
                if(!this.imageBaseUrl) throw new Error('未设置图片合同请求地址：imageBaseUrl')

                class ContractImage {
                    constructor(width, height, type, pageNumber, url) {
                        this.width = width;
                        this.height = height;
                        this.type = type;
                        this.pageNumber = pageNumber;
                        this.url = url;
                    }
                }
                this.dimensions.forEach((demension, index) => {
                    const pageNumber = index + 1;
                    const url = `${this.imageBaseUrl}&pageNo=${pageNumber}`
                    const img = new ContractImage(demension.width, demension.height, demension.type, pageNumber, url);
                    this.pages.push(img)
                });
                this.pageCount = this.dimensions.length;
                 this.$emit('document-rendered');
            } catch (error) {
                  console.log('%c⧭', 'color: #607339', error)
                  this.$emit('document-render-error', error);
            }
        },
    },
};
</script>
