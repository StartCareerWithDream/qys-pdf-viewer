# qys-pdf-viewer

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

使用方式
```
props: {
  url: string // pdf地址 
  cMapUrl: string // 字体解析包的请求地址 
  visibleHeader: boolean // 是否渲染头部控制区域（缩放、翻页等 后期可提供插槽）
  watermarkText: string // 水印文字
  onlyCanvas: boolean // 只渲染 canvas
}

listeners: {
   // 拖动事件相关
   on-drop: (e, pageNo) => void
   on-drag-over: (e, pageNo) => void
   on-drag-leave: (e, pageNo) => void
   // 文档渲染事件
   document-rendered： （）=> void // 渲染成功
   document-render-error: () => void // 渲染失败
   // 单页渲染事件
   page-rendered: (pageNo) => void
   page-render-error: (pageNo) => void
}

$slot
slot-scope="{ pageNumber }"
提供插槽，插槽具有页码信息


 <pdf :url="`/document/download/${id}?QID=5264b718-764e-45cf-8c5a-940b3aefc991`"
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
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
