<script>
import * as pdfjsLib from 'qys-pdf/webpack';
import 'qys-pdf/web/pdf_viewer.css';

/** 快速生成数组 */
const pageRange = (start, end) => {
    let last = end;
    last += 1;
    return Array(last - start).fill(0).map((v, i) => i + start);
};

const PAGE_SIZE = 10;

export default {
    name: 'PdfData',
    props: {
        url: String,
        cMapUrl: {
            type: String,
            default: '/js/cmaps/'
        },
        options: {
            type: Object,
            default:  null
        },
        onlyCanvas: Boolean,
        watermarkText: String
    },
    data () {
        return {
            loadingTask: null,
            pageCount: 0,
            pdfDocument: null,
            pages: [],
        };
    },
    provide () {
        return {
            'pages-fetch': this.fetchPages,
        };
    },
    watch: {
        pageCount: {
            handler (nv) {
                if (nv) {
                    this.fetchPages();
                }
            },
        },
        url: {
            handler(nv) {
                if(nv) {
                    let params = {
                        url: this.url,
                        cMapUrl: this.cMapUrl,
                        cMapPacked: true,
                    }
                    if(this.options) {
                        params = Object.assign(params, this.options)
                    }
                    this.pages = [];
                    this.currentPage = 0;
                    this.pageCount = 0;
                    this.loadingTask = null;
                    this.loadingTask = pdfjsLib.getDocument(params);
                    this.getDocuments();
                }
            },
            immediate: true
        }
    },
    beforeDestroy() {
        this.pages = [];
    },
    methods: {
        /** 获取pdf文档 */
        async getDocuments () {
            console.log(this.loadingTask.promise)
            try {
                this.loadingTask.promise.then(async (pdfDocument) => {
                    this.pdfDocument = pdfDocument;
                    this.pageCount = pdfDocument.numPages;
                    this.$emit('document-rendered');
                });
            } catch (error) {
                console.log('%c⧭', 'color: #aa00ff', error)
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
        async fetchPages (pageNo = 1) {
            try {
                if (!this.pageCount) return;
                if (this.pageCount && this.pageCount === this.pages.length) return;
                const endNo = Math.min(Math.max(pageNo, (pageNo + PAGE_SIZE)), this.pageCount);
                const partsOfPages = await this.getPages(this.pdfDocument, pageNo, endNo);
                this.pages.splice(pageNo - 1, 0, ...partsOfPages);
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>
