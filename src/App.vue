<template>
    <div id="app">
        <input type="text"
               v-model="id">
        <div draggable> 1234</div>
        <pdf v-if="id"
             :url="`/document/download/${id}?QID=5264b718-764e-45cf-8c5a-940b3aefc991`"
             watermark
             visible-header
             @on-drop="onDrop"
             @on-drag-over="onDrop"
             @on-drag-leave="onDrop">
            <template slot-scope="scope">
                <div class="aaa"
                     draggable>
                    {{scope.pageNumber}}
                </div>
            </template>
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
            id: '2611511610992362204'
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
.aaa {
    position: absolute;
}
</style>
