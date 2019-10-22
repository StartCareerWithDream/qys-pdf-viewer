<template>
    <div class="pdf-toolbar__content"
         :style="{ width: visibleMore ? `800px` : '50px' }">
        <template v-if="visibleMore">
            <!-- 首页 -->
            <span class="toolbar__button"
                  :class="{'disabled': this.pageNumber === 1}"
                  @click="handleJumpPage('START', true)"
                  title="首页">
                <i class="iconfont icon-first-circle-o-"></i>
            </span>
            <!-- 上一页 -->
            <span class="toolbar__button"
                  :class="{'disabled': this.pageNumber === 1}"
                  @click="handleJumpPage('DELETE')"
                  title="上一页">
                <i class="iconfont icon-left"></i>
            </span>
            <!-- 页码 -->
            <span class="toolbar__button pagination-content">
                <input type="text"
                       v-model="pageNumber"
                       @change="handleJumpPage('APPOINT', true)"> <span class="small-font"> / {{pageCount}}</span>
            </span>
            <!-- 下一页 -->
            <span class="toolbar__button"
                  title="下一页"
                  :class="{'disabled': this.pageNumber === this.pageCount}"
                  @click="handleJumpPage('ADD')">
                <i class="iconfont icon-rignt"></i>
            </span>
            <!-- 末页 -->
            <span class="toolbar__button"
                  title="末页"
                  :class="{'disabled': this.pageNumber === 1}"
                  @click="handleJumpPage('END', true)">
                <i class="iconfont icon-last-circle-o-"></i>
            </span>

            <div class="divider"></div>

            <!-- 缩小 -->
            <span class="toolbar__button"
                  title="缩放"
                  @click="handleScale('DELETE')">
                <i class="iconfont icon-delete"></i>
            </span>
            <!-- 缩放比例 -->
            <span class="toolbar__button">{{parseInt(scale * 100)}}%</span>
            <!-- 放大 -->
            <span class="toolbar__button"
                  title="缩放"
                  @click="handleScale('ADD')">
                <i class="iconfont icon-add"></i>
            </span>

            <div class="divider"></div>

            <!-- 适应屏幕宽度 -->
            <span class="toolbar__button"
                  title="适应屏幕宽度"
                  @click="handleAutoScale('WIDTH')">
                <i class="iconfont icon-infeed-develop-o-"></i>
            </span>
            <!-- 适应高度 -->
            <span class="toolbar__button"
                  title="适应屏幕高度"
                  @click="handleAutoScale('HEIGHT')">
                <i class="iconfont icon-vertical-develop-o-"></i>
            </span>

            <div class="divider"></div>

            <span class="toolbar__button document-info">
                A4 {{PAPE_SPEC['A4']}}
            </span>
        </template>

        <span class="toolbar__button"
              @click="triggerVisible">
            {{visibleMore ? '隐藏 &gt;' : '&lt; 显示'}}
        </span>
    </div>
</template>

<script>
import { PAPE_SPEC } from '../utils/constants'

export default {
    data () {
        return {
            visibleMore: false,
            pageNumber: 1,
            timeout: null,
            PAPE_SPEC, // 纸张规格
        }
    },
    props: {
        currentPage: Number,
        scale: Number,
        pageCount: Number
    },
    watch: {
        currentPage: {
            handler (nv) {
                this.pageNumber = nv;
            },
        }
    },
    methods: {
        // 节流
        throttle (func, wait) {
            return () => {
                if (!this.timeout) {
                    this.timeout = setTimeout(() => {
                        this.timeout = null;
                        func()
                    }, wait)
                }
            }
        },

        triggerVisible () {
            this.visibleMore = !this.visibleMore;
        },

        handleAutoScale (type = 'WIDTH') {
            this.throttle(() => {
                const { clientWidth = 0, clientHeight = 0 } = document.querySelector('.pdf-viewer-container');
                const value = type === 'WIDTH' ? clientWidth / 800 : clientHeight / 1167;
                const scale = value === this.scale ? 1 : value;
                this.$emit('update:scale', scale)
            }, 200)()
        },

        /** 处理缩放 */
        handleScale (method) {
            this.throttle(() => {
                const steps = new Map([
                    ['ADD', 0.1],
                    ['DELETE', -0.1]
                ])
                if (method === 'DELETE' && this.scale === 0.5) {
                    console.log('最小只能支持0.5倍大小')
                    return;
                }
                const step = steps.get(method);
                const scale = this.scale + step;
                this.$emit('update:scale', scale)
            }, 300)()
        },

        /** 处理页码 */
        handleJumpPage (type, isValue) {
            this.throttle(() => {
                const steps = new Map([
                    ['START', 1],
                    ['END', this.pageCount],
                    ['ADD', 1],
                    ['DELETE', -1],
                    ['APPOINT', +this.pageNumber]
                ])
                const step = steps.get(type);
                let pageNo = this.currentPage;
                // 不能越界
                if (this.currentPage === 1 && type === 'DELETE' || this.currentPage === this.pageCount && type === 'ADD') return;
                pageNo = isValue ? step : step + pageNo;
                this.$emit('update:currentPage', pageNo);
            }, 300)()
        }
    }
};
</script>

<style lang="less" scoped>
@pdf-toolbar__background: #001330;
@pdf-toolbar__font: #fff;
@pdf-toolbar__divider: #4c596e;
@pdf-toolbar__info: #7f8997;

.pdf-toolbar__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    line-height: 50px;
    padding: 0 24px;
    font-size: 14px;
    border-radius: 4px 0px 0px 4px;
    transition: all 0.3s;
    background: @pdf-toolbar__background;
    color: @pdf-toolbar__font;
    text-align: right;
    overflow: hidden;

    position: fixed;
    bottom: 10%;
    right: calc((100% - 800px) / 2);
    z-index: 1000;

    .document-info {
        color: @pdf-toolbar__info;
    }

    .small-font {
        font-size: 12px;
        color: @pdf-toolbar__info;
        transform: scale(0.88);
    }

    .pagination-content {
        input {
            width: 32px;
            height: 24px;
            text-align: center;
            background: #000000;
            color: @pdf-toolbar__font;
            outline: none;
            border: none;
        }
    }

    .divider {
        display: inline-block;
        width: 1px;
        height: 18px;
        background: @pdf-toolbar__divider;
        margin: 0 24px;
    }

    .toolbar__button {
        cursor: pointer;
        user-select: none;

        & + .toolbar__button {
            margin-left: 16px;
        }
    }
}
</style>
