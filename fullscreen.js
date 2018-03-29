define(["jquery"], function ($) {


    $.prototype.initFullScreen = function (options) {
        return new FullScreenManager(this, options);
    };


    function FullScreenManager(jqObj, options) {
        var thisobj = this;
        this.jqObj = jqObj;
        this.originalParent = jqObj.parent();
        this.options = $.extend({}, thisobj.defaultOptions, options);
        var fullScreenOptions = this.options;
        this.title = fullScreenOptions.title;
        this.identifier = this.getDefaultFullScreenIdentifier(fullScreenOptions.identifier || "");
        this.screen = $(this.getScreenHtml());
        this.init();
    }

    FullScreenManager.prototype = {
        defaultOptions: {
            title: "全屏显示框"
        },
        getDefaultFullScreenIdentifier: function (name) {
            var identifier = "99_fullscreen_";
            if (name) {
                return identifier + name;
            } else {
                var index = 0;
                while ($("body").find("#" + identifier + "identifer_" + index).length > 0) {
                    index++;
                }
                return this.getDefaultFullScreenIdentifier("identifer_" + index);
            }
        },
        init: function () {
            this.initScreen();
            this.initEvent();
        },

        initEvent: function () {
            var thisobj = this;
            thisobj.screen.find(".sys-screen-title .close").click(function () {
                thisobj.hide();
            });
            //页面大小变化事件
            $(window).on("resize", function () {
                thisobj.screen.css({
                    "width": document.body.scrollWidth,
                    "height": Math.max(document.body.scrollHeight || 0, document.documentElement.scrollHeight || 0)
                });

                //浏览器退出全屏会触发resize 如果不是全屏就关掉  （IE无法判断，resize的时候判断 窗口是否有全屏的，）
                if (!thisobj.checkFull() && !window.isFullScreen && thisobj.screen.is(":visible")) {
                    //要执行的动作
                    thisobj.hide();
                }

            });

            $(document).on("keydown", function (e) {
                //F11 或者 Esc
                if ((e.keyCode === 122 || e.keyCode === 27) && thisobj.screen.is(":visible")) {
                    thisobj.hide();
                }
            });
        },

        show: function () {
            this.screen.find(".screen_content").append(this.jqObj);
            this.screen.show();
            this.screen.css({
                "width": document.body.scrollWidth,
                "height": Math.max(document.body.scrollHeight || 0, document.documentElement.scrollHeight || 0)
            });
            this.requestFullScreen();
        },

        hide: function () {
            var thisobj = this;
            thisobj.screen.hide();
            this.originalParent.append(this.jqObj);
            if (thisobj.options.hideCallback) {
                thisobj.options.hideCallback(thisobj);
            }
            this.existFullScreen();
        },

        getScreenHtml: function () {
            return '<div class="sys-screen" name="' + this.identifier + '" id="' + this.identifier + '">' +
                '<div class="sys-screen-title">' +
                '<span name="title">' + this.title + '</span>' +
                '<span class="close"></span>' +
                '</div>' +
                '<div class="screen_content">' +
                '</div>' +
                '</div>';
        },
        initScreen: function () {
            var thisobj = this;
            var screen_jqobj = thisobj.screen;
            $("body").append(screen_jqobj);
        },

        requestFullScreen: function () {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            } else {
                window.isFullScreen = true;
            }
        },

        existFullScreen: function () {
            if(document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msCancelFullscreen) {
                document.msCancelFullscreen();
            }
        },

        //判断浏览器当前是否是全屏 无法判断IE
        checkFull: function () {
            var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
            if (isFull === undefined) {
                isFull = false;
            }
            return isFull;
        }
    };


});
