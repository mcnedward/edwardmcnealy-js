function random(min, max) {
  return Math.random() * (max - min) + min;
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomColor(alpha) {
  var r = parseInt(randomInt(0, 99), 16);
  var g = parseInt(randomInt(0, 99), 16);
  var b = parseInt(randomInt(0, 99), 16);
  var a = alpha ? parseInt(alpha, 16) / 255 : 100;
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}