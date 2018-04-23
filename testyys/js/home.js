// 滑动
(function(){
    var $embed = $('#bg').find('embed');
    var $swp1 = $('#wrap').find('.swp1');
    var $swp2 = $('#wrap').find('.swp2');
    // 为首页flash做延时防止闪烁
    setTimeout(function(){
        $embed.css({
            opacity: 1
        })
    }, 1000)
    $swp1.animate({
        left: '0px',
        opacity: '1'
    }, 1000);
    $swp2.animate({
        right: '60px',
        opacity: '1'
    }, 1000)
}())