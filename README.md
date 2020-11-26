# image-transition-3d

## 介绍

主要用于将图片做瓦片处理， 并进行异步动画切换。

## 快速使用

安装依赖
```shell script
npm install image-transition-3d --save

# or

yarn add image-transition-3d
```

注册组件到 Vue
```js
import Vue from 'vue'
import ImageTransition3d from "image-transition-3d";

Vue.use(ImageTransition3d);
```

使用
```html
<template>
    <div id="app">
        <div style="width: 800px;height: 480px;position:relative;">
            <image-transition-3d
                    v-model="imageIndex"
                    :images="images"
            />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'App',
        components: {},
        data() {
            return {
                // 当前显示图片（数组下标）
                imageIndex: 0,
                // 图片 src 列表
                images: [
                    '/image/1.jpg',
                    '/image/2.jpg',
                    '/image/3.jpg',
                    '/image/4.jpg',
                ],
            };
        }
    }
</script>

```

### 参数列表

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| images | Array\<String\> | 图片 src 连接列表 |
| value | Integer | 当前显示的 src 列表下标 |
| cols | Integer | 列数 |
| rows | Integer | 行数 |
| customTransitions | Array\<CustomTransition\> | 自定义动画列表 |
| duration | Integer | 动画切换图片间隔 ( ms ) |
| useTransitionNames | Array\<Object\> | 切换随机使用的动画名称 |


### CustomTransition 

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| name | Object | 动画名称（全局唯一） |
| leaveStyle | Function(index) | 返回离开的样式的方法, index 为瓦片下标 |
| enterStyle | Function(index) | 返回进入样式的开始位置样式 |
| leaveDistributionTime | Integer , Function(index) | 瓦片动画开始随机延时范围 |
| leaveDuration | Integer, Function(index) | 单个瓦片离开动画过度时间 |
| enterDuration | Integer, Function(index) | 单个瓦片进入动画过度时间 |


### 使用指定动画配置
```html
<template>
    <div id="app">
        <div style="width: 800px;height: 480px;position:relative;">
            <image-transition-3d
                    v-model="imageIndex"
                    :images="images"
                    :custom-transitions="customTransitions"
                    :use-transition-names="useTransitionNames"
            />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'App',
        components: {},
        data() {
            return {
                imageIndex: 0,
                images: [
                    '/image/1.jpg',
                    '/image/2.jpg',
                    '/image/3.jpg',
                    '/image/4.jpg',
                ],
                // 自定义动画
                customTransitions: [
                    {
                        // 动画名称
                        name: "me",
                        // 离开动画 i : 第 i 个瓦片， 横着数
                        leaveStyle: function (i) {
                            return {
                                "opacity": 0,
                                "transform": "translateX(100px)"
                            }
                        },
                        // 入场动画
                        enterStyle: function (i) {
                            return {
                                "opacity": 0,
                                "transform": "translateX(-100px)"
                            }
                        },
                        // 异步离开的最大时间跨度 会随机一个时间开始单个瓦片动画
                        leaveDistributionTime: 1000,
                        // 离开动画过渡时间
                        leaveDuration: 1000,
                        // 入场动画过度时间
                        enterDuration: 1000,
                    }
                ],
                useTransitionNames: ['me']
            };
        }
    }
</script>

```
## 问题反馈

- 有任何问题可提出 `issue` 或邮件至 fangjc1986@qq.com

## 仓库

github: https://github.com/fangjc1986/image-transition-3d.git
