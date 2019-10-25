<template>
    <div id="app">
        <pdf url="/js/ES6.pdf"
             watermark-text="杨旺旺 2019-07-02 08:08:00 9015"
             visible-header
             ref="rerer"
             image-base-url="/document/image"
             v-bind="{ dimensions }"
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
    components: {
        Pdf
    },

    data() {
        return {
           dimensions: [{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842},{"type":{"width":210,"height":297,"type":"A4"},"dimensionStr":"595.0#842.0","width":210,"height":297,"pixelWidth":595,"pixelHeight":842}]
        }
    },
  
    methods: {
        
        updateScrollTop() {
            this.$refs['rerer'].updateScrollTop(100)
        },

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
