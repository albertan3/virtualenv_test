var cv = require('opencv');

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 5;
var camInterval = 1000 / camFps;
var numfaceString= "";

// face detection properties
var rectColor = [0, 250, 0];
var rectThickness = 1;

// initialize camera
var camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

module.exports = function (socket) {
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;

      im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_default.xml', {}, function(err, faces) {
        if (err) throw err;

        for (var i = 0; i < faces.length; i++) {
          face = faces[i];
          im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);

        }

        if(faces.length>0){

          numfaceString = faces.length+ ' face detected : pay with your face';
         // console.log(faces.length+ ' face detected : pay with your face');

        }

        socket.emit('frame', { buffer: im.toBuffer(),  'numfacesocket': numfaceString});

        //socket.emit('numface_socket', { numfaceString });

      });
    });
  }, camInterval);
};
