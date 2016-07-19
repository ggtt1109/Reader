(function(){
	var Util =(function(){
	    var prefix = 'ficiton_reader_';
	    var StorageGetter = function(key){
	        return localStorage.getItem(prefix + key);
	    }
	    var StorageSetter = function(key,val){
	        return localStorage.setItem(prefix + key,val);
	    }
        var getBSONP = function(url,callback){
        	return $.jsop({
        		url:url,
        		cache:true,
        		callback:'doukan_fiction_chapter',
        		success:function(result){
        			var data = $.base64.decode(result);
        			var json = decodeURIComponent(escape(data));
        			callback(data);
        		}
        	})
        }
	    return{
	     	getBSONP : getBSONP,
	        StorageGetter:StorageGetter,
	        StorageSetter:StorageSetter
	    }
	})();

	//储存变量
	var Dom ={
		bottom_tool_bar : $('#bottom_tool_bar'),
		nav_title : $('#nav_title'),
		bk_container : $('#bk-container'),
		night_button : $('#night-button'),
		next_button : $('#next_button'),
		prev_button : $('#prev_button'),
		back_button : $('#back_button'),
	    top_nav : $('#top-nav'),
	    bottom_nav : $('.bottom_nav'),
	    font_container : $('.font-container'),
	    font_button : $('#font-button')
	};

	var Win =$(window);
	var Dov = $(document);
	
	//是否是夜间模式
	var NightMode = false;
	var color;

	//夜间模式

	if (fontColor == '#4e534f') {
		NightMode = true;
		$('#day_icon').show();
		$('#night_icon').hide();
		$('#bottom_tool_bar_ul').css('opacity', '0.6');
	}

    //初始化字体
	var RootContainer = $('#fiction_container');
	// var initFontSize = 16;
	var initFontSize=Util.StorageGetter('font_size');
	initFontSize = parseInt(initFontSize);
	if(!initFontSize){
	    initFontSize=16;
	}
	RootContainer.css('font-size',initFontSize);

	function main(){
	    //todo 整个项目的入口函数
	    var ReaderModel = ReaderModel();
	    ReaderModel.init;
	    EventHanlder();

	    var ModuleFontSwitch = (function() {
			//字体和背景的颜色表
			var colorArr = [{
				    value : '#f7eee5',
			        name : '米白',
				    font : ''
				}, {
					value : '#e9dfc7',
					name : '纸张',
					font : '',
					id : "font_normal"
				}, {
					value : '#a4a4a4',
					name : '浅灰',
					font : ''
				}, {
					value : '#cdefce',
					name : '护眼',
					font : ''
				}, {
					value : '#283548',
					name : '灰蓝',
					font : '#7685a2',
					bottomcolor : '#fff'
				}, {
					value : '#0f1410',
					name : '夜间',
					font : '#4e534f',
					bottomcolor : 'rgba(255,255,255,0.7)',
							id : "font_night"
						}];
	}

	function ReaderModel(){
	    //todo 实现和阅读器相关的数据交互的方法
	    var chapter_id;
	    var init = function(){
	    	getFictionInfo(function(){
	    		getCurChapterContent(chapter_id,function(){

	    		});
	    	})
	    }
	    var getFictionInfo = function(callback){
	    	$.get('data/chapter.json',function(data){
                 //todo 获得章节信息之后的回调
                 chapter_id = data.chapter[0].chapter_id;
                 callback && callback();
	    	},'json');
	    };

	    var getCurChapterContent = function(){
	    	$.get('data/data' + chapter_id + '.json',function(data){
	    		if(data.result==0){
	    			var url = data.jsonp;
	    			Util.getBSONP(url,function(data){
	    				callback && callback(data);
	    			});
	    		}
	    	},'json')
	    }
	    return{
	    	init : init
	    }
	}

	function ReaderBaseFrame(){
	    //todo 渲染基本的UI结构
	}

	function EventHanlder(){
	    //todo 交互的事件绑定

	    //屏幕中央点击事件
	    $('#action_mid').click(function(){
	        if(Dom.top_nav.css('display')=='none'){
	            Dom.bottom_nav.show();
	            Dom.top_nav.show();
	        } else {
	            Dom.bottom_nav.hide();
	            Dom.top_nav.hide();
	            Dom.font_container.hide();
	            Dom.font_button.removeClass('current');
	        }
	    });

        //字体栏
	    Dom.font_button.click(function() {
		    if (Dom.font_container.css('display') == 'none') {
                Dom.font_container.show();
                Dom.font_button.addClass('current');
		    } else {
                Dom.font_container.hide();
                Dom.font_button.removeClass('current');
            }
	    });

	   
	    //夜间和白天模式的转化
		Dom.night_button.click(function() {
			 //todo 触发背景切换的事件
			if (NightMode) {
				$('#day_icon').hide();
				$('#night_icon').show();
				$('#font_normal').trigger('click');
				NightMode = false;
			} else {
				$('#day_icon').show();
				$('#night_icon').hide();
				$('#font_night').trigger('click');
				NightMode = true;
			}
		});

	    //字体+
	    $('#large-font').click(function(){
	        if(initFontSize > 20){
	            return;
	        }
	        initFontSize +=1;
	        // Util.StorageSetter('font_size',initFontSize);
	        RootContainer.css('font-size',initFontSize);

	    });

	    //字体-
	    $('#small-font').click(function(){
	        if(initFontSize < 12){
	            return;
	        }
	        initFontSize -=1;
	        // Util.StorageSetter('font_size',initFontSize);
	        RootContainer.css('font-size',initFontSize);
	    });

	    //取消滚动事件
	    Win.scroll(function(){
	        Dom.bottom_nav.hide();
	        Dom.top_nav.hide();
	        Dom.font_container.hide();
	        Dom.font_button.removeClass('current');
	    });
    }

	main();

})();