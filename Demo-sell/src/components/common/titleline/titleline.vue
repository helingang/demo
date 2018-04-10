<template>
    <div id="title-line">
        <div class="line"></div>
        <div class="text">{{ name }}</div>
        <div class="line"></div>
    </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            require: true
        }
    }
};
</script>

<style lang="less">
@rem: 36rem;
#title-line{
    display: flex;
    align-items: center;
    width: 100%;
    margin: 28/@rem auto 24/@rem;
    font-weight: 700;
}
#title-line .line{
    flex: 1;
    height: 2/@rem;
    background-color: rgba(255, 255, 255, .2);
}
#title-line .text{
    padding: 0 12px;
    font-size: 14px;
}
</style>
