var mShareName = "";
var mShareURL = "";
var mSharePic = "";
var mShareContent = "";
//访问URL包含的查询字符串的属性
function getQueryStringArgus(){
	var qs = location.search?location.search.substring(1):"";
	var args = {};
	var items = qs.length?qs.split("&"):[];
	for(var i = 0;i < items.length;i++){
		var item = items[i].split("=");
		var name = decodeURIComponent(item[0]);
		var value = decodeURIComponent(item[1]);
		if(name.length){
			args[name] = value;
		}
	}
	return args;
}
//获取元素的最终样式
function getStyle(ele,name){
	if(ele.currentStyle){
		return ele.currentStyle[name];
	}else{
		return getComputedStyle(ele,null)[name]
	}
}
//网页加载时可以加载多个函数  比如addLoadEvent(func1);addLoadEvent(func2);在网页加载时可以同时加载这两个函数
function addLoadEvent(func){
	var oldOnload = window.onload;
	if(typeof window.onload != 'function'){
		window.onload = func
	}else{
		window.onload = function(){
			oldOnload();
			func();
		}
	}
}

function getQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var arr = window.location.search.substr(1).match(reg);
	if(arr!=null){
		return arr[2];
	}else{
	    return "";
	}
}
//格式化时间戳
function formatDate(now) {
　　var year = now.getFullYear(),
　　month = now.getMonth() + 1,
　　date = now.getDate(),
　　hour = now.getHours(),
　　minute = now.getMinutes(),
　　second = now.getSeconds();
 
　　return year + "/" + month + "/" + date;
}
     

function addCookie(name,value,expireHours){
	var cookieString=name+"="+escape(value)+"; path=/";
	//判断是否设置过期时间
	if(expireHours>0){
		var date=new Date();
		date.setTime(date.getTime+expireHours*3600*1000);
		cookieString=cookieString+";expires="+date.toGMTString();
	}
	document.cookie=cookieString;
}

function getCookie(name){
	var strcookie=document.cookie;
	var arrcookie=strcookie.split("; ");
	for(var i=0;i<arrcookie.length;i++){
	    var arr=arrcookie[i].split("=");
	    if(arr[0]==name){
			return unescape(arr[1]);
		}
	}
	return null;
}

function delCookie(name){//删除cookie
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null) document.cookie= name + "="+cval+"; path=/;expires="+exp.toGMTString();
}

//检查数据获取是否正确
function CheckDataSucceed(result,url){
	if(result.status.succeed==1){
		return true;
	}else{
		//登录过期，请重新登录
		if (result.status.error_code && result.status.error_code == 100){
			delCookie("username");
			delCookie("seller_name");
            delCookie("key");
            delCookie("iMall_extension");
		}
		ShowErrorMessages(result.status.error_desc,url);
		return false;
	}
}

//检查是否登录
function checkLogin(state){
	if(state == 0){
		location.href = WapSiteUrl+'/tmpl/member/login.html';
		return false;
	}else {
		return true;
	}
}

//显示数据获取失败错误信息
function ShowGetDataError(){
	//alert('获取信息失败');
}

//显示错误信息
function ShowErrorMessages(msg,url){
	$.sDialog({
        skin:"red",
        content:msg,
        okBtn:true,
        cancelBtn:false,
		okFn: function() {
			if (url && url!=''){
				location.href = WapSiteUrl+url;//'/tmpl/member/member.html'
			}else{
				location.href = "javascript:history.back(-3);";
			}
		}
	});
}

function contains(arr, str) {
    var i = arr.length;
    while (i--) {
           if (arr[i] === str) {
           return true;
           }
    }
    return false;
}

function buildUrl(type, data, extension) {
	var extension_str = '';
	if (typeof extension === 'undefined'){
		
	}else{
		extension_str = "&extension="+extension;
	}
    switch (type) {
        case 'keyword':
            return WapSiteUrl + '/tmpl/product_list.html?keyword=' + encodeURIComponent(data)+extension_str;
        case 'special':
            return WapSiteUrl + '/special.html?special_id=' + data+extension_str;
        case 'goods':
            return WapSiteUrl + '/tmpl/product_detail.html?goods_id=' + data +extension_str;
		case 'class':
            return WapSiteUrl + '/tmpl/product_list.html?gc_id=' + data+extension_str;
		case 'promotion':
		    if (data){
                return WapSiteUrl + '/tmpl/promotion_list.html?id=' + data+extension_str;
			}else{
				return WapSiteUrl + '/tmpl/promotion_list.html';
			}
        case 'url':
            return data;
    }
    return WapSiteUrl;
}

function errorTipsShow(msg) {
    $(".error-tips").html(msg).show();
    setTimeout(function() {
        errorTipsHide()
    },
    1000)
}
function errorTipsHide() {
    $(".error-tips").html("").hide()
}

function writeClear(ipt) {
    if (ipt.val().length > 0) {
        ipt.parent().addClass("write")
    } else {
        ipt.parent().removeClass("write")
    }
    btnCheck(ipt.parents("form"))
}

function btnCheck(t_form) {
    var status = true;
    t_form.find("input").each(function() {
        if ($(this).hasClass("no-follow")) {
            return
        }
        if ($(this).val().length == 0) {
            status = false
        }
    });
    if (status) {
        t_form.find(".btn").parent().addClass("ok")
    } else {
        t_form.find(".btn").parent().removeClass("ok")
    }
}
//获取默认搜索关键字
function getSearchName() {
    var keyword = decodeURIComponent(getQueryString("keyword"));	
    if (keyword == "") {	
        if (getCookie("deft_key_value") == null) {
            $.getJSON(ApiUrl + "/index.php?act=index&op=search_hot_info", function(result) {				
                var hot_info = result.datas.hot_info;
                if (typeof hot_info.name != "undefined") {
                    $("#keyword").attr("placeholder", hot_info.name);
                    $("#keyword").html(hot_info.name);
                    addCookie("deft_key_name", hot_info.name, 1);
                    addCookie("deft_key_value", hot_info.value, 1)
                } else {
                    addCookie("deft_key_name", "", 1);
                    addCookie("deft_key_value", "", 1)
                }
            })
        } else {
            $("#keyword").attr("placeholder", getCookie("deft_key_name"));
            $("#keyword").html(getCookie("deft_key_name"));
        }
    }
}
//免费领取代金劵
function getFreeVoucher(tid) {
    var key = getCookie("key");
    if (!key) {
        checkLogin(0);
        return
    }
    $.ajax({
        type: "post",
        url: ApiUrl + "/index.php?act=member_voucher&op=voucher_freeex",
        data: {
            tid: tid,
            key: key
        },
        dataType: "json",
        success: function(result) {
            checkLogin(result.login);
            var title = "领取成功";
            var skin = "green";
            if (result.error) {
                title = "领取失败：" + result.error;
                skin = "red"
            }
            $.sDialog({
                skin: skin,
                content: title,
                okBtn: false,
                cancelBtn: false
            })
        }
    })
}
//更新数据库及缓存购物车
function updateCookieCart(key) {
    var cartlist = decodeURIComponent(getCookie("goods_cart"));
    if (cartlist) {
        $.ajax({
            type: "post",
            url: ApiUrl + "/index.php?act=member_cart&op=cart_batchadd",
            data: {
                key: key,
                cartlist: cartlist
            },
            dataType: "json",
            async: false
        });
        delCookie("goods_cart")
    }
}
//获取购物车数量
function getCartCount(key, expireHours) {
    var count = 0;
    if (getCookie("key") !== null && getCookie("cart_count") === null) {
        var key = getCookie("key");
        $.ajax({
            type: "post",
            url: ApiUrl + "/index.php?act=member_cart&op=cart_count",
            data: {
                key: key
            },
            dataType: "json",
            async: false,
            success: function(result) {
                if (typeof result.datas.cart_count != "undefined") {
                    addCookie("cart_count", result.datas.cart_count, expireHours);
                    count = result.datas.cart_count
                }
            }
        })
    } else {
        count = getCookie("cart_count")
    }
    if (count > 0 && $(".qm-nav-menu").has(".cart").length > 0) {
        $(".qm-nav-menu").has(".cart").find(".cart").parents("li").find("sup").show();
        $("#header-nav").find("sup").show()
    }
}
//获取消息数量
function getChatCount() {
    if ($("#header").find(".message").length > 0) {
        var key = getCookie("key");
        if (key !== null) {
            $.getJSON(ApiUrl + "/index.php?act=member_chat&op=get_msg_count", {
                key: key
            },
            function(result) {
                if (result.datas > 0) {
                    $("#header").find(".message").parent().find("sup").show();
                    $("#header-nav").find("sup").show()
                }
            })
        }
        $("#header").find(".message").parent().click(function() {
            window.location.href = WapSiteUrl + "/tmpl/member/chat_list.html"
        })
    }
}

$(function() {
    $(".input-del").click(function() {
        $(this).parent().removeClass("write").find("input").val("");
        btnCheck($(this).parents("form"))
    });
    $("body").on("click", "label", function() {
        if ($(this).has('input[type="radio"]').length > 0) {
            $(this).addClass("checked").siblings().removeAttr("class").find('input[type="radio"]').removeAttr("checked")
        } else if ($(this).has('[type="checkbox"]')) {
            if ($(this).find('input[type="checkbox"]').prop("checked")) {
                $(this).addClass("checked")
            } else {
                $(this).removeClass("checked")
            }
        }
    });
    if ($("body").hasClass("scroller-body")) {
        new IScroll(".scroller-body", {
            mouseWheel: true,
            click: true
        })
    }
    $("#header").on("click", "#header-nav", function() {
        if ($(".qm-nav-layout").hasClass("show")) {
            $(".qm-nav-layout").removeClass("show")
        } else {
            $(".qm-nav-layout").addClass("show")
        }
    });
    $("#header").on("click", ".qm-nav-layout", function() {
        $(".qm-nav-layout").removeClass("show")
    });
    $(document).scroll(function() {
        $(".qm-nav-layout").removeClass("show")
    });
    getSearchName();
    getCartCount();
    getChatCount();
    $(document).scroll(function() {
        setGoTopBtnStatus()
    });
	
    $(".fix-block-r,footer").on("click", ".gotop", function() {
        btn = $(this)[0];
        this.timer = setInterval(function() {
            $(window).scrollTop(Math.floor($(window).scrollTop() * .8));
            if ($(window).scrollTop() == 0) clearInterval(btn.timer, setGoTopBtnStatus)
        },
        10)
    });
    function setGoTopBtnStatus() {
        $(window).scrollTop() == 0 ? $("#goTopBtn").addClass("hide") : $("#goTopBtn").removeClass("hide")
    }
}); 

(function($) {
    $.extend($, {
        scrollTransparent: function(e) {
            var t = {
                valve: "#header",
                scrollHeight: 10
            };
            var e = $.extend({}, t, e);
            function a() {
                $(window).scroll(function() {
                    if ($(window).scrollTop() <= e.scrollHeight) {
                        $(e.valve).addClass("transparent").removeClass("posf")
                    } else {
                        $(e.valve).addClass("posf").removeClass("transparent")
                    }
                })
            }
            return this.each(function() {
                a()
            })()
        },
        areaSelected: function(options) {
            var defaults = {
                success: function(e) {}
            };
            var options = $.extend({},
            defaults, options);
            var ASID = 0;
            var ASID_1 = 0;
            var ASID_2 = 0;
            var ASID_3 = 0;
            var ASNAME = "";
            var ASINFO = "";
            var ASDEEP = 1;
            var ASINIT = true;
            function _init() {
                if ($("#areaSelected").length > 0) {
                    $("#areaSelected").remove()
                }
                var html  = '<div id="areaSelected">';
				    html += '<div class="qm-full-mask left">';
					html += '<div class="qm-full-mask-bg"></div>';
					html += '<div class="qm-full-mask-block">'
					html += '<div class="header">';
					html += '<div class="header-wrap">';
					html += '<div class="header-l"><a href="javascript:void(0);"><i class="back"></i></a></div>';
					html += '<div class="header-title">';
					html += "<h1>选择地区</h1>";
					html += "</div>";
					html += '<div class="header-r"><a href="javascript:void(0);"><i class="close"></i></a></div>';
					html += "</div>";
					html += "</div>";
					html += '<div class="qm-main-layout">';
					html += '<div class="qm-single-nav">';
					html += '<ul id="filtrate_ul" class="area">';
					html += '<li class="selected"><a href="javascript:void(0);">一级地区</a></li>';
					html += '<li><a href="javascript:void(0);" >二级地区</a></li>';
					html += '<li><a href="javascript:void(0);" >三级地区</a></li>';
					html += "</ul>";
					html += "</div>";
					html += '<div class="qm-main-layout-a"><ul class="qm-default-list"></ul></div>';
					html += "</div>";
					html += "</div>";
					html += "</div>";
					html += "</div>";
                $("body").append(html);
                _getAreaList();
                _bindEvent();
                _close()
            }
            function _getAreaList() {
                $.ajax({
                    type: "get",
                    url: ApiUrl + "/index.php?act=area&op=area_list",
                    data: {
                        area_id: ASID
                    },
                    dataType: "json",
                    async: false,
                    success: function(e) {
                        if (e.datas.area_list.length == 0) {
                            _finish();
                            return false
                        }
                        if (ASINIT) {
                            ASINIT = false
                        } else {
                            ASDEEP++
                        }
                        $("#areaSelected").find("#filtrate_ul").find("li").eq(ASDEEP - 1).addClass("selected").siblings().removeClass("selected");
                        checkLogin(e.login);
                        var t = e.datas;
                        var a = "";
                        for (var n = 0; n < t.area_list.length; n++) {
                            a += '<li><a href="javascript:void(0);" data-id="' + t.area_list[n].area_id + '" data-name="' + t.area_list[n].area_name + '"><h4>' + t.area_list[n].area_name + '</h4><span class="arrow-r"></span> </a></li>'
                        }
                        $("#areaSelected").find(".qm-default-list").html(a);
                        if (typeof myScrollArea == "undefined") {
                            if (typeof IScroll == "undefined") {
                                $.ajax({
                                    url: WapSiteUrl + "/js/core/iscroll.js",
                                    dataType: "script",
                                    async: false
                                })
                            }
                            myScrollArea = new IScroll("#areaSelected .qm-main-layout-a", {
                                mouseWheel: true,
                                click: true
                            })
                        } else {
                            myScrollArea.refresh()
                        }
                    }
                });
                return false
            }
            function _bindEvent() {
                $("#areaSelected").find(".qm-default-list").off("click", "li > a");
                $("#areaSelected").find(".qm-default-list").on("click", "li > a", 
                function() {
                    ASID = $(this).attr("data-id");
                    eval("ASID_" + ASDEEP + "=$(this).attr('data-id')");
                    ASNAME = $(this).attr("data-name");
                    ASINFO += ASNAME + " ";
                    var _li = $("#areaSelected").find("#filtrate_ul").find("li").eq(ASDEEP);
                    _li.prev().find("a").attr({
                        "data-id": ASID,
                        "data-name": ASNAME
                    }).html(ASNAME);
                    if (ASDEEP == 3) {
                        _finish();
                        return false
                    }
                    _getAreaList()
                });
                $("#areaSelected").find("#filtrate_ul").off("click", "li > a");
                $("#areaSelected").find("#filtrate_ul").on("click", "li > a", 
                function() {
                    if ($(this).parent().index() >= $("#areaSelected").find("#filtrate_ul").find(".selected").index()) {
                        return false
                    }
                    ASID = $(this).parent().prev().find("a").attr("data-id");
                    ASNAME = $(this).parent().prev().find("a").attr("data-name");
                    ASDEEP = $(this).parent().index();
                    ASINFO = "";
                    for (var e = 0; e < $("#areaSelected").find("#filtrate_ul").find("a").length; e++) {
                        if (e < ASDEEP) {
                            ASINFO += $("#areaSelected").find("#filtrate_ul").find("a").eq(e).attr("data-name") + " "
                        } else {
                            var t = "";
                            switch (e) {
                            case 0:
                                t = "一级地区";
                                break;
                            case 1:
                                t = "二级地区";
                                break;
                            case 2:
                                t = "三级地区";
                                break
                            }
                            $("#areaSelected").find("#filtrate_ul").find("a").eq(e).html(t)
                        }
                    }
                    _getAreaList()
                })
            }
            function _finish() {
                var e = {
                    area_id: ASID,
                    area_id_1: ASID_1,
                    area_id_2: ASID_2,
                    area_id_3: ASID_3,
                    area_name: ASNAME,
                    area_info: ASINFO
                };
                options.success.call("success", e);
                if (!ASINIT) {
                    $("#areaSelected").find(".qm-full-mask").addClass("right").removeClass("left")
                }
                return false
            }
            function _close() {
                $("#areaSelected").find(".header-l").off("click", "a");
                $("#areaSelected").find(".header-l").on("click", "a", 
                function() {
                    $("#areaSelected").find(".qm-full-mask").addClass("right").removeClass("left")
                });
                return false
            }
            return this.each(function() {
                return _init()
            })()
        },
        cateSelected: function(options) {
            var defaults = {
                success: function(e) {}
            };
            var options = $.extend({},defaults, options);
            var ASID = 0;
            var ASID_1 = 0;
            var ASID_2 = 0;
            var ASID_3 = 0;
            var ASNAME = "";
            var ASINFO = "";
            var ASDEEP = 1;
            var ASINIT = true;
            function _init() {
                if ($("#cateSelected").length > 0) {
                    $("#cateSelected").remove()
                }
                var html  = '<div id="cateSelected">';
    			    html += '<div class="qm-full-mask left">';
    				html += '<div class="qm-full-mask-bg"></div>';
    				html += '<div class="qm-full-mask-block">'
    				html += '<div class="header">';
    				html += '<div class="header-wrap">';
    				html += '<div class="header-l"><a href="javascript:void(0);"><i class="back"></i></a></div>';
    				html += '<div class="header-title">';
    				html += "<h1>选择分类</h1>";
    				html += "</div>";
    				html += '<div class="header-r"><a href="javascript:void(0);"><i class="close"></i></a></div>';
    				html += "</div>";
    				html += "</div>";
    				html += '<div class="qm-main-layout">';
    				html += '<div class="qm-single-nav">';
    				html += '<ul id="filtrate_ul" class="area">';
    				html += '<li class="selected"><a href="javascript:void(0);">一级分类</a></li>';
    				html += '<li><a href="javascript:void(0);" >二级分类</a></li>';
    				html += '<li><a href="javascript:void(0);" >三级分类</a></li>';
    				html += "</ul>";
    				html += "</div>";
    				html += '<div class="qm-main-layout-a"><ul class="qm-default-list"></ul></div>';
    				html += "</div>";
    				html += "</div>";
    				html += "</div>";
    				html += "</div>";
                $("body").append(html);
                _getCateList();
                _bindEvent();
                _close()
            }
            function _getCateList() {
            	var key = getCookie('key');
            	
                $.ajax({
                    type: "post",
                    url: ApiUrl + "/index.php?act=seller_goods_class&op=index",
                    data: {
                    	key:key,
                    	gc_id: ASID,
                    	deep: ASDEEP
                    },
                    dataType: "json",
                    async: false,
                    success: function(e) {
                    	//console.log(e.datas.class_list);
                        if (e.datas.class_list.length == 0) {
                            _finish();
                            return false
                        }
                        if (ASINIT) {
                            ASINIT = false
                        } else {
                            ASDEEP++
                        }
                        $("#cateSelected").find("#filtrate_ul").find("li").eq(ASDEEP - 1).addClass("selected").siblings().removeClass("selected");
                        
                        var t = e.datas;
                        var a = "";
                        for (var n = 0; n < t.class_list.length; n++) {
                            a += '<li><a href="javascript:void(0);" data-id="' + t.class_list[n].gc_id + '" data-name="' + t.class_list[n].gc_name + '"><h4>' + t.class_list[n].gc_name + '</h4><span class="arrow-r"></span> </a></li>'
                        }
                        $("#cateSelected").find(".qm-default-list").html(a);
                        if (typeof myScrollCate == "undefined") {
                            if (typeof IScroll == "undefined") {
                                $.ajax({
                                    url: WapSiteUrl + "/js/core/iscroll.js",
                                    dataType: "script",
                                    async: false
                                })
                            }
                            myScrollCate = new IScroll("#cateSelected .qm-main-layout-a", {
                                mouseWheel: true,
                                click: true
                            })
                        } else {
                            myScrollCate.refresh()
                        }
                    }
                });
                return false
            }
            function _bindEvent() {
                $("#cateSelected").find(".qm-default-list").off("click", "li > a");
                $("#cateSelected").find(".qm-default-list").on("click", "li > a", 
                function() {
                    ASID = $(this).attr("data-id");
                    eval("ASID_" + ASDEEP + "=$(this).attr('data-id')");
                    ASNAME = $(this).attr("data-name");
                    ASINFO += ASNAME + " ";
                    var _li = $("#cateSelected").find("#filtrate_ul").find("li").eq(ASDEEP);
                    _li.prev().find("a").attr({
                        "data-id": ASID,
                        "data-name": ASNAME
                    }).html(ASNAME);
                    ASDEEP = ASDEEP+1
                    if (ASDEEP == 4) {
                        _finish();
                        return false
                    }else{
                    	ASINIT = true;
                    }
                    _getCateList()
                });
                $("#cateSelected").find("#filtrate_ul").off("click", "li > a");
                $("#cateSelected").find("#filtrate_ul").on("click", "li > a", 
                function() {
                    if ($(this).parent().index() >= $("#cateSelected").find("#filtrate_ul").find(".selected").index()) {
                        return false
                    }
                    ASID = $(this).parent().prev().find("a").attr("data-id");
                    ASNAME = $(this).parent().prev().find("a").attr("data-name");
                    ASDEEP = $(this).parent().index();
                    ASINFO = "";
                    for (var e = 0; e < $("#cateSelected").find("#filtrate_ul").find("a").length; e++) {
                        if (e < ASDEEP) {
                            ASINFO += $("#cateSelected").find("#filtrate_ul").find("a").eq(e).attr("data-name") + " "
                        } else {
                            var t = "";
                            switch (e) {
                            case 0:
                                t = "一级分类";
                                break;
                            case 1:
                                t = "二级分类";
                                break;
                            case 2:
                                t = "三级分类";
                                break
                            }
                            $("#cateSelected").find("#filtrate_ul").find("a").eq(e).html(t)
                        }
                    }
                    _getCateList()
                })
            }
            function _finish() {
                var e = {
                	gc_id: ASID,
                	gc_id_1: ASID_1,
                	gc_id_2: ASID_2,
                	gc_id_3: ASID_3,
                    gc_name: ASNAME,
                    gc_info: ASINFO
                };
                //console.log(e);
                options.success.call("success", e);
                if (!ASINIT) {
                    $("#cateSelected").find(".qm-full-mask").addClass("right").removeClass("left")
                }
                return false
            }
            function _close() {
                $("#cateSelected").find(".header-l").off("click", "a");
                $("#cateSelected").find(".header-l").on("click", "a", 
                function() {
                    $("#cateSelected").find(".qm-full-mask").addClass("right").removeClass("left")
                });
                return false
            }
            return this.each(function() {
                return _init()
            })()
        },
        animationLeft: function(e) {
            var t = {
                valve: ".animation-left",
                wrapper: ".qm-full-mask",
                scroll: ""
            };
            var e = $.extend({},
            t, e);
            function a() {
                $(e.valve).click(function() {
                    $(e.wrapper).removeClass("hide").removeClass("right").addClass("left");
                    if (e.scroll != "") {
                        if (typeof myScrollAnimationLeft == "undefined") {
                            if (typeof IScroll == "undefined") {
                                $.ajax({
                                    url: WapSiteUrl + "/js/core/iscroll.js",
                                    dataType: "script",
                                    async: false
                                })
                            }
                            myScrollAnimationLeft = new IScroll(e.scroll, {
                                mouseWheel: true,
                                click: true
                            })
                        } else {
                            myScrollAnimationLeft.refresh()
                        }
                    }
                });
                $(e.wrapper).on("click", ".header-l > a", 
                function() {
                    $(e.wrapper).addClass("right").removeClass("left")
                })
            }
            return this.each(function() {
                a()
            })()
        },
        animationUp: function(e) {
            var t = {
                valve: ".animation-up",
                wrapper: ".qm-bottom-mask",
                scroll: ".qm-bottom-mask-rolling",
                start: function() {},
                close: function() {}
            };
            var e = $.extend({},t, e);
            function a() {
                e.start.call("start");
                $(e.wrapper).removeClass("down").addClass("up");
                if (e.scroll != "") {
                    if (typeof myScrollAnimationUp == "undefined") {
                        if (typeof IScroll == "undefined") {
                            $.ajax({
                                url: WapSiteUrl + "/js/core/iscroll.js",
                                dataType: "script",
                                async: false
                            })
                        }
                        myScrollAnimationUp = new IScroll(e.scroll, {
                            mouseWheel: true,
                            click: true
                        })
                    } else {
                        myScrollAnimationUp.refresh()
                    }
                }
            }
            return this.each(function() {
                if (e.valve != "") {
                    $(e.valve).on("click", 
                    function() {
                        a()
                    })
                } else {
                    a()
                }
                $(e.wrapper).on("click", ".qm-bottom-mask-tip,.qm-bottom-mask-bg,.qm-bottom-mask-close", function() {
                    $(e.wrapper).addClass("down").removeClass("up");
                    e.close.call("close");                    
                })
            })()
        }
    })
})(Zepto);
//上传图片
$.fn.ajaxUploadImage = function(e) {
    var t = {
        url: "",
        data: {},
        start: function() {},
        success: function() {}
    };
    var e = $.extend({}, t, e);
    var a;
    function n() {
        if (a === null || a === undefined) {
            alert("请选择您要上传的文件！");
            return false
        }
        return true
    }
    return this.each(function() {
        $(this).on("change", 
        function() {
            var t = $(this);
            e.start.call("start", t);
            a = t.prop("files")[0];
            if (!n) return false;
            try {
                var r = new XMLHttpRequest;
                r.open("post", e.url, true);
                r.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                r.onreadystatechange = function() {
                    if (r.readyState == 4) {
                        returnDate = $.parseJSON(r.responseText);
                        e.success.call("success", t, returnDate)
                    }
                };
                var i = new FormData;
                for (k in e.data) {
                    i.append(k, e.data[k])
                }
                i.append(t.attr("name"), a);
                result = r.send(i)
            } catch(o) {
                console.log(o);
                alert(o)
            }
        })
    })
};
//载入验证码
function loadSeccode() {
    $("#codekey").val("");
    $.ajax({
        type: "get",
        url: ApiUrl + "/index.php?act=seccode&op=makecodekey",
        async: false,
        dataType: "json",
        success: function(result) {
            $("#codekey").val(result.datas.codekey)
        }
    });
    $("#codeimage").attr("src", ApiUrl + "/index.php?act=seccode&op=makecode&imhash=" + $("#codekey").val() + "&t=" + Math.random())
}
//收藏店铺
function favoriteStore(store_id) {	
    var key = getCookie("key");
    if (!key) {
        checkLogin(0);
        return
    }
    if (store_id <= 0) {
        $.sDialog({
            skin: "green",
            content: "参数错误",
            okBtn: false,
            cancelBtn: false
        });
        return false
    }
    var op_ok = false;
    $.ajax({
        type: "post",
        url: ApiUrl + "/index.php?act=member_favorites_store&op=favorites_add",
        data: {
            key: key,
            store_id: store_id
        },
        dataType: "json",
        async: false,
        success: function(result) {
            if (result.code == 200) {
                op_ok = true
            } else {
                $.sDialog({
                    skin: "red",
                    content: result.error,
                    okBtn: false,
                    cancelBtn: false
                })
            }
        }
    });
    return op_ok
}
//删除收藏的店铺
function dropFavoriteStore(store_id) {
    var key = getCookie("key");
    if (!key) {
        checkLogin(0);
        return
    }
    if (store_id <= 0) {
        $.sDialog({
            skin: "green",
            content: "参数错误",
            okBtn: false,
            cancelBtn: false
        });
        return false
    }
    var op_ok = false;
    $.ajax({
        type: "post",
        url: ApiUrl + "/index.php?act=member_favorites_store&op=favorites_del",
        data: {
            key: key,
            store_id: store_id
        },
        dataType: "json",
        async: false,
        success: function(result) {
            if (result.code == 200) {
                op_ok = true
            } else {
                $.sDialog({
                    skin: "red",
                    content: result.error,
                    okBtn: false,
                    cancelBtn: false
                })
            }
        }
    });
    return op_ok
}
//收藏商品
function favoriteGoods(goods_id) {	
    var key = getCookie("key");	
    if (!key) {
        checkLogin(0);
        return
    }
    if (goods_id <= 0) {
        $.sDialog({
            skin: "green",
            content: "参数错误",
            okBtn: false,
            cancelBtn: false
        });
        return false
    }
    var op_ok = false;
    $.ajax({
        type: "post",
        url: ApiUrl + "/index.php?act=member_favorites&op=favorites_add",
        data: {
            key: key,
            goods_id: goods_id
        },
        dataType: "json",
        async: false,
        success: function(result) {
            if (result.code == 200) {
                op_ok = true
            } else {
                $.sDialog({
                    skin: "red",
                    content: result.error,
                    okBtn: false,
                    cancelBtn: false
                })
            }
        }
    });	
    return op_ok
}
//删除收藏的商品
function dropFavoriteGoods(fav_id) {
    var key = getCookie("key");
    if (!key) {
        checkLogin(0);
        return
    }
    if (fav_id <= 0) {
        $.sDialog({
            skin: "green",
            content: "参数错误",
            okBtn: false,
            cancelBtn: false
        });
        return false
    }
    var op_ok = false;
    $.ajax({
        type: "post",
        url: ApiUrl + "/index.php?act=member_favorites&op=favorites_del",
        data: {
            key: key,
            fav_id: fav_id
        },
        dataType: "json",
        async: false,
        success: function(result) {
            if (result.code == 200) {
                op_ok = true
            } else {
                $.sDialog({
                    skin: "red",
                    content: result.error,
                    okBtn: false,
                    cancelBtn: false
                })
            }
        }
    });
    return op_ok
}

//添加分销商品
function distributeGoods(goods_id) {	
    var key = getCookie("key");	
    if (!key) {
        checkLogin(0);
        return
    }
    if (goods_id <= 0) {
        $.sDialog({
            skin: "green",
            content: "参数错误",
            okBtn: false,
            cancelBtn: false
        });
        return false
    }
    var op_ok = false;
    $.ajax({
        type: "post",
        url: ApiUrl + "/index.php?act=member_distribute&op=distribute_add",
        data: {
            key: key,
            goods_id: goods_id
        },
        dataType: "json",
        async: false,
        success: function(result) {
            if (result.code == 200) {
                op_ok = true
            } else {
                $.sDialog({
                    skin: "red",
                    content: result.error,
                    okBtn: false,
                    cancelBtn: false
                })
            }
        }
    });	
    return op_ok
}
//删除分销的商品
function dropDistributeGoods(goods_id) {
    var key = getCookie("key");
    if (!key) {
        checkLogin(0);
        return
    }
    if (goods_id <= 0) {
        $.sDialog({
            skin: "green",
            content: "参数错误",
            okBtn: false,
            cancelBtn: false
        });
        return false
    }
    var op_ok = false;
    $.ajax({
        type: "post",
        url: ApiUrl + "/index.php?act=member_distribute&op=distribute_del",
        data: {
            key: key,
            goods_id: goods_id
        },
        dataType: "json",
        async: false,
        success: function(result) {
            if (result.code == 200) {
                op_ok = true
            } else {
                $.sDialog({
                    skin: "red",
                    content: result.error,
                    okBtn: false,
                    cancelBtn: false
                })
            }
        }
    });
    return op_ok
}

//装载css样式文件
function loadCss(css_file) {
    var tag = document.createElement("link");
    tag.setAttribute("type", "text/css");
    tag.setAttribute("href", css_file);
    tag.setAttribute("href", css_file);
    tag.setAttribute("rel", "stylesheet");
    css_id = document.getElementById("auto_css_id");
    if (css_id) {
        document.getElementsByTagName("head")[0].removeChild(css_id)
    }
    document.getElementsByTagName("head")[0].appendChild(tag)
}
//载入js代码文件
function loadJs(js_file) {
    var tag = document.createElement("script");
    tag.setAttribute("type", "text/javascript");
    tag.setAttribute("src", js_file);
    tag.setAttribute("id", "auto_script_id");
    script_id = document.getElementById("auto_script_id");
    if (script_id) {
        document.getElementsByTagName("head")[0].removeChild(script_id)
    }
    document.getElementsByTagName("head")[0].appendChild(tag)
}
//app获取分享数据
function GetShareDataFromJS(){
	window.myObj.SetCurrentShareData(mShareName,mShareURL,mSharePic,mShareContent);   
}
//通知APP更新登录信息
function SendLoginInfoToApp(mkey){
	if (window.myObj){
	    window.myObj.SendWebLoginData(mkey); 
	}
}

//通知APP退出登录
function SendLogOutMsgToApp(){
	if (window.myObj){		
	    window.myObj.SendWebLogoutMsg(); 
	}
}
//APP通知退出登录
function SendLogOutFromAPP(){
	var a = getCookie("username");
    var e = getCookie("key");
    var i = "wap";
    $.ajax({
        type: "get",
        url: ApiUrl + "/index.php?act=logout",
        data: {
            username: a,
            key: e,
            client: i
        },
        success: function(a) {
            if (a) {
                delCookie("username");
                delCookie("key");
                delCookie("iMall_extension");
                location.href = WapSiteUrl + '/index.html'
            }
        }
    })
}
function isCardNo(card)  
{  
   // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
   var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
   if(reg.test(card) === false)  
   {  
       alert("请输入正确的身份证号");  
       return false;  
   }else{
	   return true;
   }
}
function formatDate(date, format) {
    var days = [
        '周日',
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
        '周六'
    ];
    if (typeof date == 'number' || typeof date == 'string') {
        if (date.length < 13) {
            var j = 13 - date.length;
            for (var i = 0; i < j; i++) {
                date = date + '0';
            }
        }
        date = new Date(Number(date));
    } else if (typeof date === 'undefined') {
        return '';
    }
    if (!format) {
        format = 'Y-m-d';
    }
 if (Number(date.getHours()) < 10) {
        var hour = '0' + String(date.getHours());
    }
    else {
        var hour = date.getHours();
    }
    if (Number(date.getMinutes()) < 10) {
        var Minute = '0' + String(date.getMinutes());
    }
    else {
        var Minute = date.getMinutes();
    }
    if (Number(date.getSeconds()) < 10) {
        var Seconds = '0' + String(date.getSeconds());
    }
    else {
        var Seconds = date.getSeconds();
    }
    if (Number((date.getMonth()) + 1) < 10) {
        var month = '0' + String(date.getMonth() + 1);
    } else {
        var month = date.getMonth() + 1;
    }
    if (Number(date.getDate()) < 10) {
        var day = '0' + String(date.getDate());
    } else {
        var day = date.getDate();
    }

    format = format.replace('Y', date.getFullYear())
        .replace('m', month)
        .replace('d', day)
        .replace('h', hour)
        .replace('M', Minute)
        .replace('D', days[date.getDay()])
        .replace('s', Seconds);
    return format;

}
function formatDate2(date) {
    if (typeof date == 'number' || typeof date == 'string') {
        if (date.length < 13) {
            var j = 13 - date.length;
            for (var i = 0; i < j; i++) {
                date = date + '0';
            }
        }
        date = new Date(Number(date));
    }
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}
function formatDate3(date) {
    if (typeof date == 'number' || typeof date == 'string') {
        if (date.length < 13) {
            var j = 13 - date.length;
            for (var i = 0; i < j; i++) {
                date = date + '0';
            }
        }
        date = new Date(Number(date));
    }
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
}

var is_weixin = navigator.userAgent.match(/MicroMessenger/i);

function init_tab_host(index) {


    /*   if (!is_weixin && !dev) {
     return;
     }*/
    if (!index) {
        index = 0;
    }
    $.ajax({
        url: ApiUrl + '/index.php?act=member_chat&op=get_msg_count',
        type: 'get',
        data: {key: getCookie('key')},
        dataType: 'json',
        success: function (rs) {
            var count = rs.datas;
            var tab = $('<div id="tab-host"> ' +
                '<div class="tab home"><a href="' + WapSiteUrl + '/index.html"><i></i>首页</a></div> ' +
                '<div class="tab shop"><a href="' + WapSiteUrl + '/tmpl/seller/seller.html"><i></i>开店</a></div> ' +
                '<div class="tab msg">' + (count > 0 ? ('<i class="msg-count">' + count + '</i>') : '') + '<a href="' + WapSiteUrl + '/tmpl/member/chat_listone.html"><i></i>消息</a></div> ' +
                '<div class="tab user"><a href="' + WapSiteUrl + '/tmpl/member/member.html"><i></i>我的</a></div>' +
                '</div>');
            tab.find('.tab').eq(index).addClass('active');
            $('body').append(tab);
        }
    })

    // <div class="tab member"><a href="' + WapSiteUrl + '/tmpl/membership/memberlist.html"><i></i>会员中心</a></div>
}


function intit_notice() {

    $('body').append('<div style="display: none;" id="order_notice"><a href="" ><img class="avatar" /><span class="goods"></span></a></div>');


    /* if(typeof(EventSource)!=="undefined")
     {
     var source=new EventSource(ApiUrl+"/index.php?act=index&op=notice_order");
     source.onmessage=function(event)
     {
     change_notice(event.data);
     };
     }
     else
     {

     }*/


    var _notice_order_time = '';

    function random_change() {


        $.ajax({
            url: ApiUrl + '/index.php?act=index&op=notice_order',
            type: 'get',
            data: {'created': _notice_order_time},
            dataType: 'json',
            success: function (rs) {

                change_notice(rs.datas);

                setTimeout(random_change, 20000);
            }
        })
    }


    setTimeout(random_change, 8000);

    function change_notice(msg) {
        _notice_order_time = msg.created
        if (msg.is_real == 0) {
            //return;
        }
        var n = $('#order_notice');
        n.find('.avatar').attr('src', msg.avatar);
        n.find('.goods').text('刚买了 ' + msg.goods_name);
        n.find('a').attr('href', WapSiteUrl + '/tmpl/product_detail.html?goods_id=' + msg.goods_id);
        n.show();
        setTimeout(function () {
            n.hide()
        }, 10000);
    }

}

function getWxConfig(option) {
    if (!WeiXinOauth) {
        return false;
    }
    var param = {};
    param.key = getCookie('key');
    param.url = location.href.split('#')[0];
    if (option.tmpl) {
        param.tmpl = option.tmpl;
    }
    if (option.ref) {
        param.ref = option.ref;
    }
    $.ajax({
        url: ApiUrl + "/index.php?act=member_index&op=wx_config",
        type: 'post',
        dataType: 'json',
        data: param,
        success: function (rs) {
            if (!rs.datas.error && rs.datas.wx_config) {
                window._wx_config = rs.datas.wx_config;
                if (option.cb) {

                    option.cb(rs.datas);
                }
            }
        }
    });
}
function getWxgoing(option) {

    getWxConfig({
        ref: option.ref,
        cb: function (data) {
            config = data.wx_config;
            wx.config({
                debug: false,
                appId: config.appId,
                timestamp: config.timestamp,
                nonceStr: config.nonceStr,
                signature: config.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage'
                ]
            });
            wx.ready(function () {
                wx.onMenuShareAppMessage({
                    title: option.title,
                    desc: option.desc,
                    link: config.fx_url,
                    imgUrl: option.imgUrl,
                    trigger: function (res) {
                    },
                    success: function (res) {

                    },
                    cancel: function (res) {
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
                wx.onMenuShareTimeline({
                    title: option.title,
                    link: config.fx_url,
                    imgUrl: option.imgUrl,
                    trigger: function (res) {


                        alert('恭喜！分享可以获取提成哦！');

                    },
                    success: function (res) {
                        /*if(url!=""){
                         window.location.href=url;
                         }*/
                    },
                    cancel: function (res) {
                        alert('很遗憾，您已取消分享');
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            })
        }
    })
}


function check_gz() {
    if (is_weixin || dev) {
        $.ajax({
            url: ApiUrl + '/index.php?act=member_index&op=check_gz',
            data: {key: getCookie('key')},
            type: 'get',
            dataType: 'json',
            success: function (rs) {
                if (rs.datas.error) {
                    return;
                }

                if (rs.datas.subscribe == 0 || dev) {
                    var _bd = $('<div class="gz_fixed">' +
                        '<span class="close"></span>' +
                        '<img src="' + rs.datas.avator + '" />' +
                        '<span>开启你的创富之路</span>' +
                        '<button class="gz" type="button">点击关注</button>' +
                        '</div>');

                    _bd.find('.close').click(function () {
                        _bd.hide();
                    })
                    _bd.find('.gz').click(function () {
                        location.href = GZH_URL;
                    })
                    $('body').append(_bd);
                }
                if (rs.datas.subscribe == '1') {
                    $('.gz_fixed').remove();
                }

            }
        })
    }
}

$(document).ready(function () {


    if (!location.href.match(/((withdrawal.+|open.+)\.html)/)) {
        check_gz();
    }


    /*if (location.href.match(/(product_list\.html|product_detail\.html)/)) {
     intit_notice();
     }*/

})
//剪裁图片JS
function clicpshow() {
    var clicpshow = '<div class="clicp-box"><div>' +
        '<div id="clipArea"></div></div>' +
        '<img id="preview_size_fake"/><span id="swh"></span>' +
        '<div class="clipbtn-box"><button type="button" id="clipBtn">完成</button>' +
        '<b class="clear"></b></div></div>';
    $('body').append(clicpshow);
}
//剪裁select：上传FILE控件选择器，prew：显示的img选择器，fn：完成后执行的AJAX上传方法（new_img为图片回调参数），truewidth：剪裁后的宽度，trueheight剪裁后的高度
function clicpfn(select, prew, fn, truewidth, trueheight) {
    var _width = $(window).width();
    var _height = $(window).height();
    $("#clipArea").width(_width).height(_height);
    $("#clipArea").photoClip({
        width: truewidth, // 截取区域的宽度
        height: trueheight, // 截取区域的高度
        file: "#" + select, // 上传图片的<input type="file">控件的选择器或者DOM对象
        //view: "#preview", // 显示截取后图像的容器的选择器或者DOM对象
        ok: "#clipBtn", // 确认截图按钮的选择器或者DOM对象
        //outputType: "jpg", // 指定输出图片的类型，可选 "jpg" 和 "png" 两种种类型，默认为 "jpg"
        strictSize: true, // 是否严格按照截取区域宽高裁剪。默认为false，表示截取区域宽高仅用于约束宽高比例。如果设置为true，则表示截取出的图像宽高严格按照截取区域宽高输出
        loadStart: function (file) {

        }, // 开始加载的回调函数。this指向 fileReader 对象，并将正在加载的 file 对象作为参数传入
        loadComplete: function (src) {
            $('html,body').css({'height': '100%', 'overflow': 'hidden'});
            $('.clicp-box').show();
        }, // 加载完成的回调函数。this指向图片对象，并将图片地址作为参数传入
        loadError: function (event) {
        }, // 加载失败的回调函数。this指向 fileReader 对象，并将错误事件的 event 对象作为参数传入
        clipFinish: function (dataURL) {
            var pre = document.getElementById(prew);
            pre.src = dataURL;
            // new_img=dataURL;
            new_img = jic.compress(pre, 80);
            pre.src = new_img;
            fn(new_img, pre);
        }, // 裁剪完成的回调函数。this指向图片对象，会将裁 剪出的图像数据DataURL作为参数传入
        // imgchange:function (dataURL) {
        //     var pre=document.getElementById(prew);
        //     pre.src=dataURL.base64;
        //     new_img=jic.compress(pre,80);
        //     pre.src=new_img;
        //     fn(new_img,pre);
        // }
        //不剪裁压缩
    });


    /**
     * Detecting vertical squash in loaded image.
     * Fixes a bug which squash image vertically while drawing into canvas for some images.
     * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
     *
     */
    function detectVerticalSquash(img) {
        var iw = img.naturalWidth, ih = img.naturalHeight;
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var data = ctx.getImageData(0, 0, 1, ih).data;
        // search image edge pixel position in case it is squashed vertically.
        var sy = 0;
        var ey = ih;
        var py = ih;
        while (py > sy) {
            var alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
                ey = py;
            } else {
                sy = py;
            }
            py = (ey + sy) >> 1;
        }
        var ratio = (py / ih);
        return (ratio === 0) ? 1 : ratio;
    }

    /**
     * A replacement for context.drawImage
     * (args are for source and destination).
     */
    function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
        var vertSquashRatio = detectVerticalSquash(img);
        // Works only if whole image is displayed:
        // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
        // The following works correct also when only a part of the image is displayed:
        ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
            sw * vertSquashRatio, sh * vertSquashRatio,
            dx, dy, dw, dh);
    }


    $("#clipArea").parents('.collex').removeAttr('style');
    $('#clipBtn').click(function () {
        $('html,body').css({'height': 'auto', 'overflow': 'visible'});
        $('.clicp-box').hide();

    })
    var jic = {
        /**
         * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
         * @param {Image} source_img_obj The source Image Object
         * @param {Integer} quality The output quality of Image Object
         * @return {Image} result_image_obj The compressed Image Object
         */

        compress: function (source_img_obj, quality, output_format) {
            var result_image_obj = '';
            var mime_type = "image/jpeg";
            if (output_format != undefined && output_format == "png") {
                mime_type = "image/png";
            }
            var cvs = document.createElement('canvas');
            var _width = source_img_obj.naturalWidth;
            var _height = source_img_obj.naturalHeight;
            cvs.width = truewidth;
            cvs.height = trueheight;
            // var abs=Math.abs(_width-_height)/2;
            // var w=300;
            // var x=0;
            // var y=0;
            // if(abs>1){
            // if(_width>_height){
            //     w=_height;
            //      x=abs;
            //     y=0;
            // }else if(_width<_height){
            //     w=_width;
            //     x=0;
            //    y=abs;
            // }
            // }else{
            //   x=0;
            //     y=0;
            //    w=_width;
            // }

            drawImageIOSFix(cvs.getContext("2d"), source_img_obj, 0, 0, _width, _height, 0, 0, truewidth, trueheight);
            var newImageData = cvs.toDataURL(mime_type, quality / 100);
            return newImageData;
            result_image_obj = new Image();
            result_image_obj.src = newImageData;
            return result_image_obj;
        }

    }

    function onPreviewLoad(sender) {
        autoSizePreview(sender, sender.offsetWidth, sender.offsetHeight);
    }

    function autoSizePreview(objPre, originalWidth, originalHeight) {
        var zoomParam = clacImgZoomParam(200, 200, originalWidth, originalHeight);
        objPre.style.width = zoomParam.width + 'px';
        objPre.style.height = zoomParam.height + 'px';
        objPre.style.marginTop = zoomParam.top + 'px';
        objPre.style.marginLeft = zoomParam.left + 'px';
    }

    function clacImgZoomParam(maxWidth, maxHeight, width, height) {
        var param = {width: width, height: height, top: 0, left: 0};
        if (width > maxWidth || height > maxHeight) {
            rateWidth = width / maxWidth;
            rateHeight = height / maxHeight;
            if (rateWidth > rateHeight) {
                param.width = maxWidth;
                param.height = height / rateWidth;
            } else {
                param.width = width / rateHeight;
                param.height = maxHeight;
            }
        }
        param.left = (maxWidth - param.width) / 2;
        param.top = (maxHeight - param.height) / 2;
        return param;
    }


}

function imgupload(a, fn) {
    var t = $(a).files[0];
    var o = new FileReader;
    var prew = $(a).data('prew');
    $('#' + imghiddle).val(t.base64);
    var pre = document.getElementById(prew);
    pre.src = t.base64;
    new_img = jic.compress(pre, 80);
    pre.src = new_img;
    fn(new_img);
    function detectVerticalSquash(img) {
        var iw = img.naturalWidth, ih = img.naturalHeight;
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var data = ctx.getImageData(0, 0, 1, ih).data;
        // search image edge pixel position in case it is squashed vertically.
        var sy = 0;
        var ey = ih;
        var py = ih;
        while (py > sy) {
            var alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
                ey = py;
            } else {
                sy = py;
            }
            py = (ey + sy) >> 1;
        }
        var ratio = (py / ih);
        return (ratio === 0) ? 1 : ratio;
    }

    /**
     * A replacement for context.drawImage
     * (args are for source and destination).
     */

    var jic = {
        /**
         * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
         * @param {Image} source_img_obj The source Image Object
         * @param {Integer} quality The output quality of Image Object
         * @return {Image} result_image_obj The compressed Image Object
         */
        drawImageIOSFix: function (ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
            var vertSquashRatio = detectVerticalSquash(img);
            // Works only if whole image is displayed:
            // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
            // The following works correct also when only a part of the image is displayed:
            ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
                sw * vertSquashRatio, sh * vertSquashRatio,
                dx, dy, dw, dh);
        },

        compress: function (source_img_obj, quality, output_format) {
            var result_image_obj = '';
            var mime_type = "image/jpeg";
            if (output_format != undefined && output_format == "png") {
                mime_type = "image/png";
            }
            var cvs = document.createElement('canvas');
            var _width = source_img_obj.naturalWidth;
            cvs.width = 300;
            cvs.height = 300;
            this.drawImageIOSFix(cvs.getContext("2d"), source_img_obj, 0, 0, _width, _width, 0, 0, 300, 300);
            var newImageData = cvs.toDataURL(mime_type, quality / 100);
            return newImageData;
            result_image_obj = new Image();
            result_image_obj.src = newImageData;
            return result_image_obj;
        }
    }
}


//自动居中剪裁

//图片自动压缩的调用
function imgconfig(elem,prewimgid,truewidth,trueheight,ajaxurl,ajaxdata,type,formdata,succfn){
    var imgfn=new imgcanvas(ajaxurl,ajaxdata,type,succfn,formdata);
    imgfn.initialize(elem,prewimgid,truewidth,trueheight);
}
//图片自动压缩的方法
function imgcanvas(url,data,type,succfn,formdata){

    this.url=url;
    this.data=data;
    this.type=type;
    this.succfn=succfn;
    this.imgtype='';
    this.formdata=formdata;
    this.initialize=function(elem,prewimgid,truewidth,trueheight){//压缩上传总控制器
        var imgbox=document.getElementById(prewimgid);
        if (elem.files.length) {
            var oFile = elem.files[0];
            var oFReader = new FileReader(),
                rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
            if (!rFilter.test(oFile.type)) { alert('您上传的不是图片');return;};
            this.imgtype=oFile.type;
            oFReader.readAsDataURL(oFile);
            //进度条，上传完成隐藏
            oFReader.onprogress = function (oFREvent) {
                imgbox.parentNode.style.position="relative";
                var span=document.createElement("span");
                span.style.display='block';
                span.style.position='absolute';
                span.style.background="#00DCFF";
                span.style.height="2px";
                span.style.bottom="0";
                span.style.webkitTransition="all 0.6s"
                span.style.mozTransition="all 0.6s";
                span.style.oTransition="all 0.6s";
                span.style.msTransition="all 0.6s";
                imgbox.parentNode.appendChild(span);
                if(oFREvent.loaded==oFREvent.total){
                    imgbox.parentNode.removeChild(span);
                }else{
                    var progresswidth=(oFREvent.loaded / oFREvent.total * 100).toFixed() + "%" ;
                    span.style.width=progresswidth;
                }
            },oFReader.onload = function (oFREvent) {
                var imgsrc=oFREvent.target.result||oFREvent.srcElement.result||oFREvent.currentTarget.result||oFREvent.base64||oFReader.result;;
                var newsrc=this.dwimg(imgsrc,truewidth,trueheight,this.imgtype);//调用生成画布，truewidth为画布生成后的宽度，trueheight画布生成后的高度
                imgbox.src=newsrc;
                this.ajaxfn(newsrc);
            }.bind(this);

        }
    };
    //将图片压缩成画布，居中压缩图片
    this.dwimg=function(imgsrc,turewidth,trueheight,imgtype){
        var canvas = document.createElement("canvas");
        canvas.width=turewidth;
        canvas.height=trueheight;
        var ctx=canvas.getContext("2d");
        var img=new Image();
        img.src=imgsrc;
        var w=img.naturalWidth;
        var h=img.naturalHeight;
        if(h>w){
            var y=(h-w)/2;
            var x=0;
            var nw=w;
        }else if(w>h){
            var x=(w-h)/2;
            var y=0;
            var nw=h;
        }else{
            x=0;y=0;
            var nw=w;
        }
        ctx.drawImage(img, 0, 0,nw,nw,0,0,turewidth,trueheight);
        var newImageData = canvas.toDataURL(imgtype);
        return newImageData;
    }
    this.ajaxfn=function(newsrc){
        var stringlegth=JSON.stringify(this.data).length-2;
        var stringjson=JSON.stringify(this.data).substr(1,stringlegth);
        var datastring='{'+stringjson+',"'+this.formdata+'":"'+newsrc+'"}';
        var objdata = eval('('+datastring+')');
        this.data.avatar=newsrc;
        $.ajax({
            url:this.url,
            type:this.type,
            data:objdata,
            success:function(e){
                this.succfn(e,newsrc);
            }.bind(this)
        });

    }
}

function qrcanvas(size,data,imgsrc){
	var q=document.getElementById('qrcanvas');
    var canvas;
     var s = 50 / 100;
     var colorIn ='#000';
     var colorOut = '#333';
     var colorFore = '#000';
     var colorBack ='#fff';
     var options = {
         cellSize: Number(size),
         foreground: [
             // foreground color
             {style: colorFore},
             // outer squares of the positioner
             {row: 0, rows: 7, col: 0, cols: 7, style: colorOut},
             {row: -7, rows: 7, col: 0, cols: 7, style: colorOut},
             {row: 0, rows: 7, col: -7, cols: 7, style: colorOut},
             // inner squares of the positioner
             {row: 2, rows: 3, col: 2, cols: 3, style: colorIn},
             {row: -5, rows: 3, col: 2, cols: 3, style: colorIn},
             {row: 2, rows: 3, col: -5, cols: 3, style: colorIn},
         ],
         background: colorBack,
         data:data,
         typeNumber: Number(5),
     };
     options.logo = {
	    clearEdges: Number(2),
	    size:5/ 100,
	    margin: Number(2),
     };
     if(imgsrc){
        if (/^.*\.(jpg|png|gif)$/.test(imgsrc)){
            console.log(imgsrc)
            var imgs=new Image();
            imgs.src=imgsrc;
            imgs.onload=function(){
                options.logo.image = imgs;
            }.bind(this)

        }else {
            options.logo.text = imgsrc;
            options.logo.fontFace = '32';
            options.logo.color = '#ff0000';
            var style = 'bold ';
             style += 'italic ';
             style += 'bold ';
            options.logo.fontStyle = style;
        }
     }
     if (s >= 0)
         options.effect = {key: 'round', value: s};
     else
         options.effect = {key: 'liquid', value: -s};
     options.reuseCanvas = canvas;
     canvas = qrgen.canvas(options);
     q.appendChild(canvas);
}

function barcode(str){
	var barcode = document.getElementById('barcode'),
     str = str,
     options = {
         width: 2,//较细处条形码的宽度
         height:80, //条形码的宽度，无高度直接设置项，由位数决定，可以通过CSS去调整，见下
         quite: 10,
         format: "CODE128",
         displayValue: true,//是否在条形码下方显示文字
         font:"monospace",
         textAlign:"center",
         fontSize: 12,
         backgroundColor:"",
         lineColor:"#000"//条形码颜色
	}
	JsBarcode(barcode, str, options);
}