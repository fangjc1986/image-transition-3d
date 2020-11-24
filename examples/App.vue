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
