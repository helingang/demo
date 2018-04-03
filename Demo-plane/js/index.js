//动画兼容
window.requestAnimationFrame = window.requestAnimationFrame || function(fn){ return setTimeout(fn,1000/60) };
window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

//全局变量
var oGame = document.getElementById('Game'),
    oLevelBox = document.getElementById('level'),
    oMap = document.getElementById('map'),
    oBiuAll = document.getElementById('BiuAll'),
    aBiu = oBiuAll.children,
    oScore = document.getElementById('score'),
    num = 0; 

chooseLevel()
//选择难度
function chooseLevel(){
    var aLevel = oLevelBox.getElementsByTagName('p');
    var aLevelLength = aLevel.length;
    for(var i=0;i<aLevelLength;i++){
        (function(i){
            //难度i(0-4)
            aLevel[i].onclick = function(ev){
                reset();
                ev = ev || window.event;
                var pos = {
                    x : ev.clientX - oGame.offsetLeft,
                    y : ev.clientY - oGame.offsetTop
                }
                startGame(i,pos);
            }
        }(i))
    }
}


//开始游戏
function startGame(i,pos){
    hideLevel();//隐藏难度选择界面
    var I = createPlane(i,pos);//创建我军,创建我军子弹
    createEnemy(i,I);//创建敌军
    
}

//隐藏难度选择界面
function hideLevel(){
    oLevelBox.className = 'hide';
}
function showLevel(){
    oLevelBox.className = '';
}
function bingo(){
    num++;
    oScore.innerHTML = num;
}
function reset(){
    num = 0;
    oScore.innerHTML = num;
}
//创建我军
function createPlane(i,pos){
    var oPlane = new Image();//document.createElement('map')
    oPlane.src = 'images/plane_0.png'
    oPlane.width = 60;
    oPlane.height = 60;
    oPlane.className = 'plane';
    oPlane.style.left = pos.x + 'px';
    oPlane.style.top = pos.y + 'px';
    oPlane.onmousedown = function(){return false};
    oMap.appendChild(oPlane);
    
    //在事件外获取飞机位置的一些参数
    var mapPosX = oGame.offsetLeft;
    var mapPosY = oGame.offsetTop;
    var xMin = -oPlane.offsetWidth/2;
    var xMax = oMap.offsetWidth - oPlane.offsetWidth/2;
    var yMin = 0;
    var yMax = oMap.offsetHeight - oPlane.offsetHeight/2;

    //规定飞机飞行的区域
    document.onmousemove = function(ev){
        ev = ev || window.event;
        //获取飞机坐标并限制边界值
        var x = ev.clientX - mapPosX - oPlane.offsetWidth/2;
        var y = ev.clientY - mapPosY - oPlane.offsetHeight/2;
        x = Math.max(xMin,x);
        x = Math.min(xMax,x);
        y = Math.max(yMin,y);
        y = Math.min(yMax,y);
        oPlane.style.left = x + 'px';
        oPlane.style.top = y + 'px';
        
    }

    //创建我军子弹
    createFire(oPlane,i);
    return oPlane;//返回我军
}
//创建我军子弹
function createFire(oPlane,i){
    oMap.biuInterval = setInterval(function(){
        var oBiu = document.createElement('img');
        oBiu.src = 'images/fire.png';
        oBiu.className = 'biu';
        oBiu.width = 30;
        oBiu.height = 40;
        oBiu.style.left = oPlane.offsetLeft + oPlane.width/2 - oBiu.width/2 + 'px';
        oBiu.style.top = oPlane.offsetTop + 'px';
        oBiuAll.appendChild(oBiu);
        //子弹运动
        requestAnimationFrame(function(){
            m(i);
        })
        
        function m(level){
            //如果子弹没有父级(已经被移除)的话就return
            //因为在敌军的函数中移除子弹,这里并不知道自己是否已经被移除,所以需要判断
            if(!oBiu.parentNode){
                return;
            }
            var top = oBiu.offsetTop;
            //子弹边界 
            if(top>-oBiu.offsetHeight){
                top -= (5-level)*5;
                oBiu.style.top = top + 'px';

                // //在子弹运动的时候检测子弹与敌军是否碰撞,如果碰撞则清除子弹和敌军
                // //oBiu就代表每一个子弹了,因为是在定时器中
                // for(var i=0,length = aEnemy.length;i<length;i++){
                //     var e = aEnemy[i];
                //     //如果碰撞时
                //     if(collision(oBiu,e)){
                //         boom(e.offsetLeft,e.offsetTop);
                //         oMap.removeChild(oBiu);//移除子弹
                //         oEnemyAll.removeChild(e);//移除敌军
                //         return;
                //     } 
                // }
                requestAnimationFrame(function(){
                    m(level);
                });
            }else{
                oBiuAll.removeChild(oBiu);
            }
        }
    },[100,300,500,700][i])
}
//创建敌军
function createEnemy(i,obj){
    var mapW = oMap.offsetWidth;
    var mapH = oMap.offsetHeight;
    //根据难度创建敌军
    oMap.enemyInterval = setInterval(function(){
        var oEnemy = document.createElement('img');
        oEnemy.src = 'images/enemy_small.png';
        oEnemy.className = 'enemy';
        oEnemy.width = 54;
        oEnemy.height = 40;
        oEnemy.style.top = -oEnemy.height + 'px';
        oEnemy.style.left = Math.random()*mapW - oEnemy.width/2 + 'px';
        oMap.appendChild(oEnemy);
        //每个敌军的left速度
        var xleft = Math.random()*4 - 2;
        //敌军运动
        requestAnimationFrame(function(){
            m(i);
        })
        function m(level){
            
            var top = oEnemy.offsetTop;
            var left = oEnemy.offsetLeft;
            top += (level+1)*3;
            left += xleft;
            if(top>=mapH || left<-oEnemy.width || left>mapW){
                oMap.removeChild(oEnemy);
            }else{
                oEnemy.style.top  = top + 'px';
                oEnemy.style.left = left + 'px';

                //判断敌军与子弹,i倒序是因为敌军可以碰撞多次再移除
                for(var i=aBiu.length-1;i>=0;i--){
                    var e = aBiu[i];
                    //如果碰撞时
                    if(collision(oEnemy,e)){
                        boom(oEnemy.offsetLeft,oEnemy.offsetTop,'boom');//敌军爆炸
                        oBiuAll.removeChild(e);//移除子弹
                        oMap.removeChild(oEnemy);//移除敌军
                        bingo();
                        return;
                    }
                }
                //判断敌军和自己
                if(obj.parentNode && collision(oEnemy,obj)){
                    boom(obj.offsetLeft,obj.offsetTop,'boom1');//我军爆炸
                    oMap.removeChild(obj);//移除我军
                    oMap.removeChild(oEnemy);
                    GG();
                    return
                }
                requestAnimationFrame(function(){
                    m(level);
                })
            }
            
        }
    },[400,300,200,80][i])
}

//检测子弹与敌军是否碰撞(遍历)
function collision(obj1,obj2){
    var T1 = obj1.offsetTop,
        B1 = T1 + obj1.offsetHeight,
        L1 = obj1.offsetLeft,
        R1 = L1 + obj1.offsetWidth;
    var T2 = obj2.offsetTop;
        B2 = T2 + obj2.offsetHeight,
        L2 = obj2.offsetLeft,
        R2 = L2 + obj2.offsetWidth;
    if( B1<T2 || R1<L2 || T1>B2 || L1>R2 ){
        //未碰撞
        return false;
    }else{
        //碰撞
        return true;
    }
}
//爆炸函数
function boom(l,t,c){
    var oBoom = new Image();
    oBoom.src = 'images/boom_small.png';
    oBoom.width = 54;
    oBoom.height = 40;
    oBoom.className = c;
    oBoom.style.left = l + 'px';
    oBoom.style.top = t + 'px';
    oMap.appendChild(oBoom);
    setTimeout(function(){
        oMap.removeChild(oBoom);
    },1000)
}
//游戏结束
function GG(){
    document.onmousemove = null;
    clearInterval(oMap.biuInterval);
    clearInterval(oMap.enemyInterval);
    // setTimeout(function(){
    //     showLevel();
    // },1000)
    showLevel();
}
//阻止默认事件,选中文字
document.onmousedown = function(){
    return false;
}

