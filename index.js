$(function () {
    var oText = $(".comment");
    var oBtn = $(".send");
    var oMsgList = $(".messageList");
    var oPage = $(".page");
    var url = "weibo.php"
    $("body").delegate(".comment", "proertychange input", function () {
        if ($(this).val().length > 0) {
            oBtn.prop("disabled", false);
        } else {
            oBtn.prop("disabled", true);
        }
    })
  
    var page = $.getCookie("pageNumber") || 1;
    // console.log(page);
    getMsgPage();

    function getMsgPage() {
        $(".footer").html("");
        $.ajax({
            type: "get",
            url: "weibo.php",
            data: "act=get_page_count",
            success: function (msg) {
                // console.log(msg);
                var obj = eval("(" + msg + ")");
                // console.log(obj);
                for (var i = 0; i < obj.count; i++) {
                    // var $a = $("<a href=\"javascript:;\">" + (i + 1) + "</a>");
                    var $a = $("<a>" + (i + 1) + "</a>");
                    $a.attr({
                        src: "javascript:;",
                        class: "page_number"
                    })
                    // console.log($a.get(0));
                    // $a.attr({
                    //     src:"javascript:;",
                    //     class:"page_number"
                    // });
                    if (i === (page - 1)) {
                        $a.addClass("cur")
                    }
                    $(".footer").append($a);
                }
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        })
    }

    getMsgList();

    function getMsgList(number) {
        oMsgList.html("");
        $.ajax({
            type: "GET",
            url: "weibo.php",
            data: "act=get&page=" + number,
            // 连接服务器成功获取数据
            success: function (msg) {
                // 打印数据，看是否获取到数据
                // console.log(msg);
                // 转换非标json为对象
                var obj = eval("(" + msg + ")");
                // 检查是否获取成功
                //  console.log(obj);
                $.each(obj, function (key, value) {
                    // 创建$weibo的jquery对象
                    var $weibo = createEle(value);
                    // jquery对象的get(0)方法获取源生dom元素，
                    // 并动态添加obj属性，绑定value
                    $weibo.get(0).obj = value;
                    oMsgList.prepend($weibo);
                })
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        })
    }
    // 监听发布按钮
    oBtn.click(function () {
        var $text = oText.val();
        // var $weibo = createELe($text);
        $.ajax({
            type: "GET",
            url: "weibo.php",
            data: "act=add&content=" + $text,
            success: function (msg) {
                // {error: 0, id: 1, time: 1579485076, acc: 0, ref: 0}
                // console.log(msg);
                var obj = eval("(" + msg + ")");
                obj.content = $text;
                // console.log(obj);
                var $weibo = createEle(obj);
                $weibo.get(0).obj=obj;
                // console.log($weibo);
                oMsgList.prepend($weibo);
                // $(".messageList").prepend($weibo);
                // 发送信息后清空信息
                // oText.val('');
                //页码大于6，进行删除第一条
                if ($(".info").length > 6) {
                    // getMsgList(1);
                    getMsgPage();
                    $(".info:last-child").remove();
                }
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        })
        // $(".messageList").prepend($weibo);
        // console.log($(".infoTop")[0]);
    });
    // 创建节点
    function createEle(obj) {
        /*  转义需要注意格式，逗号转+号，去除别的格式
         转义网站为https://www.html.cn/tool/html2js/
         选择html代码转为javascript字符串，转为双引号 */
        var $weibo = $("<div class=\"info\">" +
            "                <p class=\"infoText\">" + obj.content + "</p>" +
            "                <p class=\"infoOperation\">" +
            "                    <span class=\"infoTime\">" + formarDate(obj.time) + "</span>" +
            "                    <span class=\"infoHandle\">" +
            "                        <a href=\"javascript:;\" class=\"infoTop\">" + obj.acc + "</a>" +
            "                        <a href=\"javascript:;\" class=\"infoDown\">" + obj.ref + "</a>" +
            "                        <a href=\"javascript:;\" class=\"infoDel\">删除</a>" +
            "                    </span>" +
            "                </p>" +
            "            </div>");
        return $weibo;
    }
    //监听顶点击
    $("body").delegate(".infoTop", "click", function () {
        // console.log($(this).text());
        //需要修改，第一次为1第二次为0
        $(this).text(parseInt($(this).text()) + 1);
        // 创建weibo当前所指微博,并取出当前微博的obj
        var weiboId = $(this).parents(".info").get(0).obj.id;
        console.log(weiboId); //{id: 28, content: "", time: 1579507701, acc: 0, ref: 0}
        // this指向当前顶的标签，$(this)包装成jquery对象的顶标签
        // console.log(this);
        // console.log($(this));
        $.ajax({
            type: "get",
            url: "weibo.php",
            data: "act=acc&id=" + weiboId,
            success: function (msg) {
                console.log(msg);
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        })
        // console.log(parseInt($(this).text())+1);
        // alert("tingdaole ");
    })
    //监听踩点击
    $("body").delegate(".infoDown", "click", function () {
        var weiboId = $(this).parents(".info").get(0).obj.id;
        $(this).text(parseInt($(this).text()) + 1);
        $.ajax({
            type: "get",
            url: "weibo.php",
            data: "act=ref&id=" + weiboId,
            success: function (msg) {
                console.log(msg);
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        })
    })
    //监听删除按钮
    $("body").delegate(".infoDel", "click", function () {
        $(this).parents(".info").remove();
        var weiboId = $(this).parents(".info").get(0).obj.id;
        $.ajax({
            type: "get",
            url: "weibo.php",
            data: "act=del&id=" + weiboId,
            success: function (msg) {
                // console.log(msg);
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        })
        // console.log($(".cur").html());
        getMsgList($(".cur").html());



    })
    //监听页码点击
    $("body").delegate(".footer>a", "click", function () {
        // alert("123")
        // 当前页码标记变红
        $(this).addClass("cur");
        // 清除其余页码变红,移除标签类cur
        $(this).siblings().removeClass("cur");
        // console.log($(this).html());
        oMsgList.html("");

        getMsgList($(this).html());
        $.addCookie("pageNumber", $(this).html());

    })

    function formarDate(time) {

        // 服务器返回的是秒，而new Date()需要的是毫秒
        var date = new Date(time * 1000);
        // console.log(date);
        // // 获取时间，但是时间的格式不对，需要做更改
        // console.log(date.getFullYear());
        // //月份需要加一
        // // 2018-4-3 21:30:23
        // console.log(date.getMonth());
        // console.log(date.getDate());
        // console.log(date.getMinutes());
        // console.log(date.getSeconds());

        var arr = [
            date.getFullYear() + "-",
            date.getMonth() + 1 + "-",
            date.getDate() + " ",
            date.getHours() + ":",
            date.getMinutes() + ":",
            date.getSeconds(), ":",
        ];
        // console.log(arr.join(""));
        //需要将个位数转为两位数格式
        return arr.join("");

    }
    // 需要调用才能使用
    formarDate();

});