require.config({
    packages: [{
        name: 'zrender',
        location: './zrender',
        main: 'zrender'
    }]
});


// require(
//     ['zrender'],
//     function(zrender, $) {
//         console.log($);

//     }
// );



$(document).ready(function() {
    // just init to get a zrender Instance



    //二维数组存储方块数字
    var blockData = new Array();
    // var colorMap = {
    //     "2": "#eee4da",
    //     "4": "#ede0c8",
    //     "8": "#f2b179",
    //     "16": "#f59563",
    //     "32": "#f67c5f",
    //     "64": "#f65e3b",
    //     "128": "#edcf72",
    //     "256": "#edcc61",
    //     "512": "#edc850",
    //     "1024": "#edc53f",
    //     "2048": "#edc22e"
    // }
    var gameScore = 0;

    for (var i = 0; i < 4; i++) {
        blockData[i] = new Array(4);
    };

    //初始化游戏
    init();

    //绑定开始游戏按钮
    $(".start-btn").on("touchend", function() {
        $(".block").remove();
        $(".main-body .mask").css("display", "none");
        init();
    });
    $(".main-body .mask").on("touchend", function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    $(".love-block").on("touchend", function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    $(".continue-btn").on("touchend", function() {
        $(".love-block").css("display", "none");
    })


    function init() {
        for (var i = 0, l1 = blockData.length; i < l1; i++) {
            for (var j = 0, l2 = blockData[0].length; j < l2; j++) {
                blockData[i][j] = 0;
            };
        }
        gameScore = 0
        $(".score-num").text(0);
        generateOneBlock();
        generateOneBlock();
    }
    $(document).on("keydown", function(event) {
        switch (event.which) {
            case 37:
                {
                    moveLeft();
                    if (isGameOver()) {
                        $(".main-body .mask").css("display", "block");
                    }
                    break;
                }
            case 38:
                {
                    moveUp();
                    if (isGameOver()) {
                        $(".main-body .mask").css("display", "block");
                    }
                    break;
                }
            case 39:
                {
                    moveRight();
                    if (isGameOver()) {
                        $(".main-body .mask").css("display", "block");
                    }
                    break;
                }

            case 40:
                {
                    moveDown();
                    if (isGameOver()) {
                        $(".main-body .mask").css("display", "block");
                    }
                    break;
                }
            default:
                break;
        }
    })

    function generateOneBlock(time) {
        var randomNum = Math.random() < 0.5 ? 2 : 4;
        var blockOneWay = [];
        var randomPosX = 0;
        var randomPosY = 0;
        var count = 0;
        var zeroCount = 0;
        for (var i = 0, l1 = blockData.length; i < l1; i++) {
            for (var j = 0, l2 = blockData[0].length; j < l2; j++) {
                blockOneWay.push(blockData[i][j]);
                if (!blockData[i][j]) {
                    count++;
                };
            };
        }
        if (!count) {
            return;
        };
        var randomCount = Math.floor(Math.random() * count);
        for (var k = 0, l = blockOneWay.length; k < l; k++) {
            if (!blockOneWay[k]) {
                if (zeroCount === randomCount) {
                    randomPosX = Math.floor(k / 4);
                    randomPosY = k % 4;
                    break;
                }
                zeroCount++;
            }
        }
        blockData[randomPosX][randomPosY] = randomNum;
        createBlock(randomPosX, randomPosY, randomNum, time);
    }

    function moveLeft() {
        var canMove = false;
        var timer;
        for (var i = 0, l1 = blockData.length; i < l1; i++) {
            var posOrigin = -1;
            for (var j = 1, l2 = blockData[0].length; j < l2; j++) {
                if (!blockData[i][j]) {
                    continue;
                }
                var pos = new Array(i, j);
                var toPos = canMoveLeft(pos, posOrigin);
                if (toPos) {
                    //添加移动效果
                    canMove = true;
                    if (blockData[pos[0]][pos[1]] == blockData[toPos[0]][toPos[1]]) {
                        blockData[toPos[0]][toPos[1]] += blockData[pos[0]][pos[1]];
                        blockData[pos[0]][pos[1]] = 0;
                        posOrigin = toPos[1];
                        gameScore += blockData[toPos[0]][toPos[1]];
                        $(".score-num").text(gameScore);
                        moveWithAnimation(pos, toPos, blockData[toPos[0]][toPos[1]]);
                        if (blockData[toPos[0]][toPos[1]] == 8) {
                            var timer;
                            clearTimeout(timer);
                            timer= setTimeout(function(){
                                $(".love-block").css("display", "block");
                                 showLoveBlock();

                            }, 500);
                        }
                    } else {
                        blockData[toPos[0]][toPos[1]] = blockData[pos[0]][pos[1]];
                        blockData[pos[0]][pos[1]] = 0;
                        moveWithAnimation(pos, toPos);
                    }
                };
            };
        }
        if (canMove) {
            generateOneBlock(350);
        };
    }

    function canMoveLeft(pos, posOrigin) {
        var toPos = 0;
        for (var j = pos[1] - 1; j > posOrigin; j--) {
            if (!blockData[pos[0]][j]) {
                toPos = [pos[0], j];
                continue;
            } else if (blockData[pos[0]][j] == blockData[pos[0]][pos[1]]) {
                toPos = [pos[0], j];
                break;
            } else {
                break;
            }
        };
        return toPos;

    }

    function moveUp() {
        var canMove = false;
        var timer;
        for (var j = 0, l1 = blockData[0].length; j < l1; j++) {
            var posOrigin = -1;
            for (var i = 1, l2 = blockData.length; i < l2; i++) {
                if (!blockData[i][j]) {
                    continue;
                }
                var pos = new Array(i, j);
                var toPos = canMoveUp(pos, posOrigin);
                if (toPos) {
                    canMove = true;
                    //添加移动效果
                    if (blockData[pos[0]][pos[1]] == blockData[toPos[0]][toPos[1]]) {
                        blockData[toPos[0]][toPos[1]] += blockData[pos[0]][pos[1]];
                        blockData[pos[0]][pos[1]] = 0;
                        posOrigin = toPos[0];
                        gameScore += blockData[toPos[0]][toPos[1]];
                        $(".score-num").text(gameScore);
                        moveWithAnimation(pos, toPos, blockData[toPos[0]][toPos[1]]);
                        if (blockData[toPos[0]][toPos[1]] == 8) {
                            var timer;
                            clearTimeout(timer);
                            timer= setTimeout(function(){
                                $(".love-block").css("display", "block");
                                 showLoveBlock();

                            }, 500);
                        }
                    } else {
                        blockData[toPos[0]][toPos[1]] = blockData[pos[0]][pos[1]];
                        blockData[pos[0]][pos[1]] = 0;
                        moveWithAnimation(pos, toPos);
                    }
                };
            };
        }
        if (canMove) {
            generateOneBlock(350);
        };
    }

    function canMoveUp(pos, posOrigin) {
        var toPos = 0;
        for (var j = pos[0] - 1; j > posOrigin; j--) {
            if (!blockData[j][pos[1]]) {
                toPos = [j, pos[1]];
                continue;
            } else if (blockData[j][pos[1]] == blockData[pos[0]][pos[1]]) {
                toPos = [j, pos[1]];
                break;
            } else {
                break;
            }
        };
        return toPos;
    }


    //Move Right
    function moveRight() {
        var canMove = false;
        var timer;
        for (var i = 0, l1 = blockData.length; i < l1; i++) {
            var posOrigin = 4;
            for (var j = blockData[0].length - 1; j > -1; j--) {
                if (!blockData[i][j]) {
                    continue;
                }
                var pos = new Array(i, j);
                var toPos = canMoveRight(pos, posOrigin);
                if (toPos) {
                    canMove = true;
                    //添加移动效果
                    if (blockData[pos[0]][pos[1]] == blockData[toPos[0]][toPos[1]]) {
                        blockData[toPos[0]][toPos[1]] += blockData[pos[0]][pos[1]];
                        blockData[pos[0]][pos[1]] = 0;
                        posOrigin = toPos[1];
                        gameScore += blockData[toPos[0]][toPos[1]];
                        $(".score-num").text(gameScore);
                        moveWithAnimation(pos, toPos, blockData[toPos[0]][toPos[1]]);
                        if (blockData[toPos[0]][toPos[1]] == 8) {
                            var timer;
                            clearTimeout(timer);
                            timer= setTimeout(function(){
                                $(".love-block").css("display", "block");
                                 showLoveBlock();

                            }, 500);
                        }
                    } else {
                        blockData[toPos[0]][toPos[1]] = blockData[pos[0]][pos[1]];
                        blockData[pos[0]][pos[1]] = 0;
                        moveWithAnimation(pos, toPos);
                    }
                };
            };
        }
        if (canMove) {
            generateOneBlock(350);
        }
    }

    function canMoveRight(pos, posOrigin) {
        var toPos = 0;
        for (var j = pos[1] + 1; j < posOrigin; j++) {
            if (!blockData[pos[0]][j]) {
                toPos = [pos[0], j];
                continue;
            } else if (blockData[pos[0]][j] == blockData[pos[0]][pos[1]]) {
                toPos = [pos[0], j];
                break;
            } else {
                break;
            }
        };
        return toPos;
    }


    //Move Down
    function moveDown() {
        var canMove = false;
        for (var j = 0, l1 = blockData[0].length; j < l1; j++) {
            var posOrigin = 4;
            for (var i = blockData.length - 1; i > -1; i--) {
                if (!blockData[i][j]) {
                    continue;
                }
                var pos = new Array(i, j);
                var toPos = canMoveDown(pos, posOrigin);
                if (toPos) {
                    canMove = true;
                    //添加移动效果
                    if (blockData[pos[0]][pos[1]] == blockData[toPos[0]][toPos[1]]) {
                        blockData[toPos[0]][toPos[1]] += blockData[pos[0]][pos[1]];
                        blockData[pos[0]][pos[1]] = 0;
                        posOrigin = toPos[0];
                        gameScore += blockData[toPos[0]][toPos[1]];
                        $(".score-num").text(gameScore);
                        moveWithAnimation(pos, toPos, blockData[toPos[0]][toPos[1]]);
                        if (blockData[toPos[0]][toPos[1]] == 8) {
                            var timer;
                            clearTimeout(timer);
                            timer= setTimeout(function(){
                                $(".love-block").css("display", "block");
                                 showLoveBlock();

                            }, 500);
                        }
                    } else {
                        blockData[toPos[0]][toPos[1]] = blockData[pos[0]][pos[1]];
                        blockData[pos[0]][pos[1]] = 0;
                        moveWithAnimation(pos, toPos);
                    }
                };
            };
        }
        if (canMove) {
            generateOneBlock(350);
        };
    }

    function canMoveDown(pos, posOrigin) {
        var toPos = 0;
        for (var j = pos[0] + 1; j < posOrigin; j++) {
            if (!blockData[j][pos[1]]) {
                toPos = [j, pos[1]];
                continue;
            } else if (blockData[j][pos[1]] == blockData[pos[0]][pos[1]]) {
                toPos = [j, pos[1]];
                break;
            } else {
                break;
            }
        };
        return toPos;
    }



    function moveWithAnimation(fromPos, toPos, newNum) {
        $(".block").removeClass("animation-show animation-bump");
        var $fromEle = $("#block-" + fromPos[0] + "-" + fromPos[1]);
        var distanceY = (fromPos[0] - toPos[0]) * 152;
        var distanceX = (toPos[1] - fromPos[1]) * 152;
        $fromEle.animate({
            "top": "-=" + distanceY,
            "left": "+=" + distanceX
        }, 100, function() {
            if (newNum) {
                $fromEle
                    .addClass("animation-bump")
                    .removeClass("block-" + newNum / 2)
                    .addClass("block-" + newNum).text(getTextValue(newNum));
                $("#block-" + toPos[0] + "-" + toPos[1]).remove();
            };
            $fromEle.attr("id", "block" + "-" + toPos[0] + "-" + toPos[1]);
        })
    }

    function isGameOver() {
        if ($(".block").length === 16) {
            for (var i = 0; i < blockData.length; i++) {
                for (var j = 0; j < blockData[0].length; j++) {
                    var pos = [i, j];
                    if (canMoveLeft(pos, -1) || canMoveUp(pos, -1) || canMoveRight(pos, 4) || canMoveDown(pos, 4)) {
                        return false;
                    }
                };
            };
            return true;
        };
        return false;
    }

    function isShowLove() {
        for (var i = 0; i < blockData.length; i++) {
            for (var j = 0; j < blockData[0].length; j++) {
                if (blockData[i][j] == 8) {
                    return true;
                }
            };
        };
        return false;
    }

    function createBlock(i, j, num, time) {
        var $curBlock = $('<li class="block"></li>');
        var timer;
        $curBlock
            .text(getTextValue(num))
            .css({
                "top": 16 + i * 152,
                "left": 16 + j * 152
            })
            .attr("id", "block-" + i + "-" + j)
            .addClass("animation-show")
            .addClass("block-" + num)
        $(".main-body ul").append($curBlock);
        timer ? clearTimeout(timer) : timer = setTimeout(function() {
            $curBlock.show();
        }, time);
    }

    function getTextValue(number) {
        switch (number) {
            case 2:
                return "实习僧";
                break;
            case 4:
                return "页面仔";
                break;
            case 8:
                return "码农";
                break;
            case 16:
                return "程序猿";
                break;
            case 32:
                return "攻城狮";
                break;
            case 64:
                return "产品狗";
                break;
            case 128:
                return "产品经理";
                break;
            case 256:
                return "产品总监";
                break;
            case 512:
                return "总经理";
                break;
            case 1024:
                return "CEO";
                break;
            case 2048:
                return "白富美";
                break;
            default:
                break;
        }
    }

    adaptToMobile();

    function adaptToMobile() {
        var touchPos = new Array;
        $(".main-body").on("touchstart", function(evt) {
            evt.preventDefault();

            touchPos[0] = {
                "x": evt.originalEvent.touches[0].pageX,
                "y": evt.originalEvent.touches[0].pageY
            };
        });
        $(".main-body").on("touchend", function(evt) {
            evt.preventDefault();
            touchPos[1] = {
                "x": evt.originalEvent.changedTouches[0].pageX,
                "y": evt.originalEvent.changedTouches[0].pageY
            };
            var touchDirection;
            var touchH = touchPos[1].x - touchPos[0].x;
            var touchV = touchPos[1].y - touchPos[0].y;
            if (touchV > 0 && Math.abs(touchV / touchH) > 1) {
                touchDirection = 40;
            }
            if (touchV < 0 && Math.abs(touchV / touchH) > 1) {
                touchDirection = 38;
            };
            if (touchH > 0 && Math.abs(touchV / touchH) < 1) {
                touchDirection = 39;
            }
            if (touchH < 0 && Math.abs(touchV / touchH) < 1) {
                touchDirection = 37;
            };
            switch (touchDirection) {
                case 37:
                    {
                        moveLeft();
                        if (isGameOver()) {
                            $(".main-body .mask").css("display", "block");
                        }
                        break;
                    }
                case 38:
                    {
                        moveUp();
                        if (isGameOver()) {
                            $(".main-body .mask").css("display", "block");
                        }
                        break;
                    }
                case 39:
                    {
                        moveRight();
                        if (isGameOver()) {
                            $(".main-body .mask").css("display", "block");
                        }
                        break;
                    }

                case 40:
                    {
                        moveDown();
                        if (isGameOver()) {
                            $(".main-body .mask").css("display", "block");
                        }
                        break;
                    }
                default:
                    break;
            }

        });
    }

    function showLoveBlock() {

        $("#love-block").css("height", window.innerHeight-200);
        //打印字符函数
        function printWord(words) {
            if (words) {
                for (var i = 0; i < words.length; i++) {
                    words[i]
                };
            }
        }
        $.fn.autotype = function() {
            var _this = $(this);
            var str = _this.html();
            // 正则替换代码行之间添加的多个空格，不去除换行输出会有明显的停顿：实际是在输出多个空格
            str = str.replace(/(\s){2,}/g, "$1");
            var index = 0;
            $(this).html('');
            var timer = function() {
                var args = arguments;
                var current = str.slice(index, index + 1);
                // html标签完整输出,如：<p>
                if (current == '<') {
                    index = str.indexOf('>', index) + 1;
                } else {
                    index++;
                }
                //位运算符: 根据setInterval运行奇偶次来判断是否加入下划线字符“_”，使输入效果更逼真
                if (index < str.length - 1) { //打印字符倒数第2个字符开始，不加下划线字符，以防止结束符可能会多输出一下划线字符
                    _this.html(str.substring(0, index) + (index & 1 ? '_' : ''));
                } else {
                    _this.html(str.substring(0, index));
                    clearTimeout(timer);
                };
                setTimeout(args.callee, 150);
            };
            // 延迟1s开始
            // setTimeout(timer,1000);
            timer();
        };
        $(".love-block .text-block").autotype();

        // setTimeout(function(){
        //     $(".love-block .text-body").autotype();
        // }, 1000);
        // setTimeout(function(){
        //     $(".love-block .text-body").autotype("2222222222行");
        // }, 5000);



        require(
            ['zrender', 'zrender/shape/Circle', 'zrender/shape/Text', 'zrender/animation/Animation'],
            function(zrender, CircleShape, TextShape, Animation) {
                zr = zrender.init(document.getElementById('love-block'));
                var width = Math.ceil(zr.getWidth());
                var height = Math.ceil(zr.getHeight());
                var util = require('zrender/tool/util');
                var eventTool = require('zrender/tool/event');
                var guid = require('zrender/tool/guid');
                var gameRunning;
                var shapeList = [];
                var circleShapes = [];
                var pointText;
                var knife;
                var hasCatched = {};
                var gamTicket;
                var timeTicket;
                var timeInterval;
                var gameTime = 10;
                var timer;
                var clearCircle = false;

                function getRandomNum(from, to) {
                    return from + Math.floor(Math.random() * to);
                }

                clearInterval(timeInterval);
                timeInterval = setInterval(function() {
                    for (var i = 0; i < 3; i++) {
                        var circleShape = new CircleShape({
                            style: {
                                x: getRandomNum(0, 640),
                                y: getRandomNum(0, 800),
                                r: getRandomNum(8, 12),
                                brushType: 'fill',
                                color: Math.random() > 0.5 ? '#ee6d66' : '#E73225',
                                opacity: 0.5,
                                id: guid()
                            },
                            hoverable: false
                        });
                        circleShapes.push(circleShape);
                        zr.addShape(circleShape);
                        zr.animate(circleShape.id, 'style')
                            .delay(10000)
                            .when(1000, {
                                x: 320,
                                y: 400,
                                opacity: 0
                            })
                            .done(function() {
                                zr.delShape(circleShape.id);
                                setTimeout(function() {
                                    clearInterval(timeInterval);
                                }, 1000);
                            })
                            .start('easing');
                        zr.refresh();
                    };
                    if (circleShapes.length >= 50) {
                        clearCircle = true;
                    }
                    // console.log(circleShape.id);
                }, 500);

                // if (clearCircle) {
                //     moveCircleShape();
                //     setTimeout(function(){
                //         clearInterval(timeInterval);
                //     }, 1000);
                // }

                function moveCircleShape() {
                    var timeInterval;
                    clearInterval(timeInterval);
                    var count = 0;
                    timeInterval = setInterval(function() {
                        zr.animate(circleShapes[count].id, 'style')
                            .when(1000, {
                                x: 320,
                                y: 400
                            })
                            .done(function() {
                                zr.delShape(circleShapes[count].id);
                                zr.refresh();
                            })
                            .start('easing');
                        circleShapes.unshift();
                        count++;
                    }, 200);
                }

                var circleShape = new CircleShape({
                    style: {
                        x: 320,
                        y: 400,
                        r: 10,
                        brushType: 'fill',
                        color: '#E73225',
                        opacity: 1,
                        id: guid(),
                        z: 100
                    },
                    hoverable: false
                });
                zr.addShape(circleShape);
                // console.log(circleShape.id);
                zr.render();
                zr.animate(circleShape.id, 'style')
                    .delay(1000)
                    .when(1000, {
                        r: 80
                    })
                    .done(function() {
                        zr.animate(circleShape.id, 'style', true)
                            .when(400, {
                                r: 90
                            })
                            .when(500, {
                                r: 70
                            })
                            .start('easing');
                        $(".love-block .text-block2").show().autotype();
                    })
                    .start('easing');
                zr.refresh();


            });
    }

});
