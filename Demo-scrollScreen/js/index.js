
$(function(){
    // 顶部滑动滑动
    (function(){
        var $nav = $('#nav'),
            $li = $nav.find('ul li'),
            $border = $nav.find('.border'),
            x = $($border).width() - $($li).eq(0).width();
        $li.mouseenter(function(){
            var width = $(this).width() + x;
            var left = $(this).offset().left - $($nav).offset().left - x/2 - 1;
            $border.animate({
                left: left,
                width: width
            })
        })
        $nav.mouseleave(function(){
            var width = $($li).width() + x;
            var left = $($li).offset().left - $($nav).offset().left - x/2 - 1;
            $border.stop().animate({
                left: left,
                width: width
            })
        })
    }())

    // 全屏滚动
    (function(){
        var $content = $('#content'),
            $li = $('#sideNav li')
            index = 0,
            length = $content.children().length,
            wh = $(window).height();
            lastTime = 0;
        $(window).resize(function(){
            wh = $(window).height();
            $content.css({
                top: -index * wh
            })
        })
        $(document).mousewheel(function(e, d){
            
            if(new Date() - lastTime > 1000){
                if(d < 0){
                    index++;
                    if(index > length - 1){index = length - 1};
                }else{
                    index--;
                    if(index < 0){index = 0}
                }
                change();
                lastTime = new Date();
            }
            
            
        });

        $($li).click(function(){
            var x = $(this).index();
            x !== index && (index = x, change());
        })


        function change(){
            $($li).eq(index).addClass('on').siblings().removeClass('on')
            $($content).stop().animate({
                top: -index * wh
            }, 1000)
        }

    }())
})


