import QysPdfViewer from './components/pdf-container.vue';

QysPdfViewer.install = function (Vue) {
    Vue.component(QysPdfViewer.name, QysPdfViewer);
};

export default QysPdfViewer;