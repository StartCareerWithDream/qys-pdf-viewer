<template>
    <div id="app">
        <input type="text"
               v-model="id">
        <pdf v-if="id"
             :url="`/document/download/${id}?QID=844c644b-0f6d-4b37-bbb7-9835d129a8c6`"
             watermark-text="杨旺旺 2019-07-02 08:08:00 9015"
             visible-header
             @on-drop="onDrop"
             @on-drag-over="onDrop"
             @on-drag-leave="onDrop"
             @page-rendered="onPageRendered">
        </pdf>
    </div>
</template>

<script>
import Pdf from './components/pdf-container'

export default {
    name: 'app',
    data () {
        return {
            url: '',
            id: '2615137425385963557'
        }
    },
    components: {
        Pdf
    },
    mounted () {
        //   this.getPDFBlobUrl();
    },
    methods: {
        async getPDFBlobUrl () {
            const urlParams = {
                QID: '341d3741-4780-455d-ac97-4818b19bd879',
                SID: 'eb760722-0b35-41db-925e-92a9ad71c047'
            };
            let data;
            try {
                data = await this.axios({
                    url: '/document/download/2607441299849585121',
                    responseType: 'arraybuffer',
                    params: urlParams,
                    headers: {
                        'Accept': 'application/pdf'
                    }
                });
                data = data.data;
                await this.handlerBlobToUrl(data);
            } catch (e) {
                console.log(e);
            }
        },

        onPageRendered(pageNo) {
            console.log(pageNo)
        },

        handlerBlobToUrl (data) {
            let blob = null,
                binaryData = [];

            binaryData.push(data);
            try {
                blob = new File(binaryData, '合同文件.pdf', { type: "application/pdf" });
            } catch (e) {
                blob = new Blob(binaryData, { type: 'application/pdf' });
            }
            this.url = window.URL.createObjectURL(blob);
        },

        onDrop (e, pageNo) {
            console.log(e, pageNo)
        },
    }
}
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background: #f2f2f2;
}
</style>
