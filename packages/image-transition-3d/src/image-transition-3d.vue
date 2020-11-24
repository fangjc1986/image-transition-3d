<template>
    <div class="image-transition-3d" ref="container">
        <template v-for="row in rows">
            <div class="tile" v-for="col in cols"
                 :key="row * cols + col"
                 :style="borderStyle(row,col)"
            >
                <div class="tile-image"
                     :style="tileStyles[(row-1) * cols + (col-1)]"
                ></div>
            </div>
        </template>
    </div>
</template>

<script>


    export default {
        name: 'image-transition-3d',
        mixins: [],
        components: {},
        props: {
            images: {
                default: () => ([])
            },
            cols: {
                default: 10,
            },
            rows: {
                default: 6,
            },
            value: {
                default: 0,
            },
            customTransitions: {
                default: () => ([])
            },
            duration: {
                default: 5000,
            },
            useTransitionNames: {
                default: null,
            }
        },
        data() {
            return {
                tileStyles: new Array(this.rows * this.cols).fill(null).map(v => ({})),
                transitionConfig: [
                    {
                        name: 'default',
                        leaveStyle: this.defaultLeave,
                        enterStyle: this.getDefaultEnterStyle,
                        leaveDistributionTime: 1000,
                        leaveDuration: 1000,
                        enterDuration: 1000,
                    }
                ].concat(this.customTransitions),
                activatedTransitionConfig: null,
                durationTimeout: null,
            }
        },
        computed: {
            imagesComp() {
                return this.images.map(img => {
                    let image = new Image();
                    image.src = img;
                    return image;
                });
            },
            imgUrl() {
                return this.images[this.value];
            },
            tileBgSize() {
                if (!this.$refs.container) return {};
                return {
                    "background-size": `${this.$refs.container.offsetWidth * (this.cols + 1) / this.cols}px ${this.$refs.container.offsetHeight * (this.rows + 1) / this.rows}px `,
                }
            },
        },
        watch: {
            value(v) {
                clearTimeout(this.durationTimeout);
                this.startLeave();
                this.slideStart();
            }
        },
        created() {
        },
        mounted() {
            this.resetTransitionConfig();
            this.tileStyles.forEach((v, i) => {
                this.delayRun(() => {
                    this.toEnter(i, false);
                });
            });
            this.$forceUpdate();
            this.slideStart();
        },
        beforeDestroy() {
            clearTimeout(this.durationTimeout);
        },
        activated() {
        },
        deactivated() {
        },
        methods: {

            slideStart() {
                clearTimeout(this.durationTimeout);
                this.durationTimeout = setTimeout(() => {
                    this.$emit("input", (this.value + 1) % this.images.length);
                    this.slideStart();
                }, this.duration);
            },

            getTileBgPosition(i) {
                return {
                    "background-position": `left ${((i % this.cols)) * 100 / this.cols}% top ${(Math.floor(i / this.cols) * 100 / this.rows)}%  `
                }
            },

            tileBgImage(isEnter = false) {
                return {
                    "background-image": `url("${this.images[!isEnter ? ((this.images.length + this.value - 1) % this.images.length) : this.value]}")`,
                }
            },

            test() {
                this.startLeave();
            },

            delayRun(callBack = null, i) {
                let a = this.activatedTransitionConfig;
                setTimeout(callBack, Math.random() * (a === null ? 1000 : (typeof a.leaveDistributionTime === 'function') ? a.leaveDistributionTime(i) : (a.leaveDistributionTime || 1000)));
            },

            resetTransitionConfig() {
                let transitions = this.transitionConfig.reduce((t, x) => {
                    if (this.useTransitionNames === null) t.push(x);
                    else if (this.useTransitionNames.includes(x.name)) {
                        t.push(x);
                    }
                    return t;
                }, []);
                this.activatedTransitionConfig = transitions[Math.floor(Math.random() * transitions.length)];
                return this.activatedTransitionConfig;
            },

            startLeave() {
                let n = this.rows * this.cols;
                let transitionConfig = this.resetTransitionConfig();
                let ld = transitionConfig.leaveDuration;
                for (let i = 0; i < n; i++) {
                    let style = {};
                    style = Object.assign(
                        style,
                        this.tileBgImage(),
                        transitionConfig.leaveStyle ? transitionConfig.leaveStyle(i) : this.defaultLeave(i),
                        this.tileBgSize,
                        this.getTileBgPosition(i),
                        this.getTransitionStyle((typeof ld === 'function') ? ld(i) : (ld || 1000)),
                    );
                    this.delayRun(() => {
                            this.$set(this.tileStyles, i, style);
                            setTimeout(() => this.toEnter(i), 400);
                        }, i
                    )
                }
            },

            toEnter(i, isEnter = true) {
                this.$set(this.tileStyles, i, {
                    ...this.getTileBgPosition(i), ...this.tileBgImage(true), ...this.getEnterStartStyle(i),
                });
                let a = this.activatedTransitionConfig;
                let t = 1000;
                if (a) {
                    let e = a.enterDuration || 1000;
                    t = (typeof e === 'function') ? e(i) : (e || 1000);
                }
                setTimeout(() => {
                    this.$set(this.tileStyles, i, {
                        ...this.getTileBgPosition(i), ...this.tileBgImage(true), ...this.getTransitionStyle(t),
                        ...this.tileBgSize
                    });
                }, 100);
            },


            getEnterStartStyle(i) {
                let a = this.activatedTransitionConfig;
                if (a !== null && a.enterStyle) return a.enterStyle(i);
                return this.getDefaultEnterStyle(i);

            },

            getDefaultEnterStyle(i) {
                let th = this.$refs.container.offsetHeight / this.rows;
                let tw = this.$refs.container.offsetWidth / this.cols;
                let [tx, ty] = [
                    (Math.random() - .5) * th * .2,
                    (Math.random() - .5) * tw * .2,
                ];
                return {
                    "opacity": 0,
                    'transform': `translateX(${tx}px) translateY(${ty}px) scale(1.2)`
                }
            },


            borderStyle(row, col) {

                return {
                    'width': 100 / this.cols + '%',
                    'height': 100 / this.rows + '%',
                    'top': (row - 1) * 100 / this.rows + '%',
                    'left': (col - 1) * 100 / this.cols + '%',
                };
            },


            defaultLeave(index) {
                let b = Math.random() > .5 ? 1 : 0;
                let [x, y, z, deg] = [
                    b === 0 ? 0 : (Math.random() > .5 ? -1 : 0),
                    b === 1 ? 0 : (Math.random() > .5 ? -1 : 0),
                    0,
                    "90deg"
                ];
                let [tx, ty] = [
                    Math.random() * 100 - 50,
                    Math.random() * 100 - 50,
                ];
                return {
                    "transform": `translateX(${tx}px) translateY(${ty}px) scale(1.2)`,
                    'opacity': 0,
                }
            },

            getTransitionStyle(time, index) {
                return {
                    "transition": `${time}ms all ease`,
                }
            },


        }
    };
</script>

<style scoped lang="less">

    .image-transition-3d, .image-transition-3d * {
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box;
    }

    .image-transition-3d {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .tile {
        position: absolute;
        perspective: 150px;
    }

    .tile-image {
        width: 100%;
        height: 100%;
    }
</style>