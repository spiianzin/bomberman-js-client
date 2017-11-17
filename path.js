
var BOUND = 20;

var f = function(point) {

};

var g = function(point) {

};

// оценка пути из node до global. 
var h = function(node, goal) {
    var ev = Math.sqrt(Math.pow((node.x - goal.x), 2) + Math.pow((node.y - goal.y), 2))) / 2;
    return ev;
};

var search = function(point, total, bound) {
    var res = total + h(point);
    if (res > BOUND) {
        return
    }
};
