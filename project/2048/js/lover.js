// paper.install(window);
// $(document).ready(function(){


//     paper.setup("love-heart");

//     var offsetX = $("#love-heart").width()/2;
//     var offsetY = $("#love-heart").height()/2 - 50;

//     var heartPath = new Path();
//     var sHeartPath = new Path();
//     heartPath.strokeColor = 'red';
//     // sHeartPath.strokeColor = "black";
//     sHeartPath.fillColor = "#D52C53";


//     function onFrame(event) {
//     // Each frame, rotate the path by 3 degrees:
//     // path.rotate(3);
// }

// function getHeartPoint(angle) {
//     var t = angle / Math.PI;
//     var x = 18* (16 * Math.pow(Math.sin(t), 3));
//     var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
//     return new Array(offsetX+x, offsetY+y);
// }
// function creatHeart(){
//     for (var angle = 10; angle < 30; angle+=0.1) {
//         var t = angle / Math.PI;
//         var x = 2* (16 * Math.pow(Math.sin(t), 3));
//         var y = - 2 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
//         sHeartPath.add(new Point(100+x, 100+y));
//     };
//     sHeartPath.closed = true;
// }

// function startHeartPoint(){
//     creatHeart();
//     var symbol = new Symbol(sHeartPath);
//     var interval = 50;
//     var angle = 10;
//     for (var i = 0; i < 3; i++) {
//        var animationTimer = setInterval(function () {

//         var point = getHeartPoint(angle);
//         var draw = true;
//         if (draw) {
//             var placedSymbol = symbol.place(new Point(point));
//             var size = Math.random();
//             placedSymbol.scale(size+0.2);
//             // heartPath.add(new Point(point));
//         }
//         if (angle >= 30) {
//             clearInterval(animationTimer);
//         } else {
//             angle += 0.8;
//         }
//     }, interval);

//    };



// }
// var heartSize = 1;
// function onFrame(event){
//     console.log(event.count);
//     if (heartSize <1.5){
//         heartSize += 0.1;
//         symbol.definition.scale(heartSize );
//     }

// }



// startHeartPoint();


// sHeartPath.smooth();







// });
