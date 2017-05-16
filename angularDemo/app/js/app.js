var app = angular.module('app', []).directive('draggable', function ($document) {
    var startX = 0, startY = 0, x = 0, y = 0;
    return function (scope, element, attr) {
        element.css({
            position: 'relative',
            border: '1px solid red',
            backgroundColor: 'lightgrey',
            cursor: 'pointer'
        });
        element.bind('mousedown', function (event) {
            startX = event.screenX - x;
            startY = event.screenY - y;
            $document.bind('mousemove', mousemove);
            $document.bind('mouseup', mouseup);
        });

        function mousemove(event) {
            y = event.screenY - startY;
            x = event.screenX - startX;
            element.css({
                top: y + 'px',
                left: x + 'px'
            });
        }

        function mouseup() {
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
        }
    }
});

var opts = {
    grentCtrl: function ($scope) {
        $scope.name = 'World';
    },
    listCtrl: function ($scope) {
        $scope.names = ['Igor', 'Misko', 'Vojta'];
    },
    myCtrl: function ($scope) {
        $scope.action = function () {
            $scope.name = 'OK';
        };

        $scope.name = 'World';
    }
};

// register funtion
register(app, opts);


function register(module, opts) {
    var keyArr = Object.keys(opts);
    var len = keyArr.length;
    var i = 0;
    var key;

    for (; i < len; i++) {
        key = keyArr[i];
        module.controller(key, opts[key]);
    }
}
