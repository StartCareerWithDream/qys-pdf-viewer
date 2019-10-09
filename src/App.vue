<template>
    <div id="app">
        <input type="text"
               v-model="id">
        <pdf url="/js/2018-ebook-engineer.pdf"
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
            id: '2619128405097267756'
        }
    },
    components: {
        Pdf
    },
  
    methods: {

        onPageRendered(pageNo) {
            console.log(pageNo)
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
