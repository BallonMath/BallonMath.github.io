<! DOCTYPE html>
<html>
<body>


<h1> Ballon Math</h1>

<p><button onclick="myMove()">Click!</button></p>

<div id="container">
    <div id ="animate"></div>
</div>


<scipt>
function myMove(){
let id = null;
const elem = document.getElementById("animate")
let pos = 0;
clearInterval(id);
id = setInterval(frame, 5)
function frame() {
    if (pos == 350) {
        clearInterval(id);
    } else {
        pos++;
        elem.style.top = pos + "px";
        elem.style left = pos + "px";
    }
}
}
</scipt>
</body>
</html>