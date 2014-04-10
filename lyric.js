function DoubanFM() {
	this.name = '豆瓣FM';
	this.tmp_song_id = '';
	this.flag = 1;
	this.lyrics = this.draw_lyrics();
}

//创建新节点
DoubanFM.prototype.draw_lyrics = function() {
	var lyrics_div = document.createElement('div');//用document.createElement()
	document.body.appendChild(lyrics_div);//用document.body.appendChild()
	// lyrics_div.style.width = '900px';//下面几行是设置css
	// lyrics_div.style.backgroundColor = '#F00';
	// lyrics_div.style.zIndex = '42';
	// lyrics_div.style.position = 'relative';
	// lyrics_div.style.margin = '200px auto 0';
	lyrics_div.style.overflowY = 'scroll';
	lyrics_div.id = 'mylrc';
	lyrics_div.className = 'mv_div';
	 
	return lyrics_div;
}

//获取歌词
DoubanFM.prototype.geci_entry_url = function(song, artist) {
	if (song == undefined || song == null || song == '') return '';
	var url = 'http://geci.me/api/lyric/' + song;
	if (!(artist == undefined || artist == null || artist == '')) {
		url += '/' + artist;
	}
	// console.log(url);
	return url;
}

//ajax
DoubanFM.prototype.request_geci = function() {
	eval('var stored_song = ' + localStorage['bubbler_song_info']);//
	if (this.tmp_song_id != stored_song.id) {
		var url = this.geci_entry_url(stored_song.song_name, stored_song.artist);
		this.tmp_song_id = stored_song.id;
		this.ajax_get(url);
		this.flag = 1;
	}
}

DoubanFM.prototype.ajax_get = function(url) {
	var XHR = new XMLHttpRequest();
	var obj = this;
	//一次典型的原生js发起的AJAX请求
	XHR.onreadystatechange = function() {
		if (XHR.readyState == 4) {
			if (XHR.status == 200) {
				obj.deal_response(XHR.responseText);
			} else {
				obj.print_lyrics('获取歌词失败');
				this.flag = -1;
			}
		} else {
			obj.print_lyrics('歌词搜索中');
		}
	}
	 
		XHR.open('GET', url, true);
		XHR.send();
}

//处理返回的歌词	 
DoubanFM.prototype.deal_response = function(data) {
	if (this.flag == 1) {
		eval('var resp = ' + data);
		console.log(resp);
		if (resp.count > 0) {
			this.ajax_get(resp.result[0].lrc);
			this.flag++;
		} else {
			this.print_lyrics('没有找到歌词');
		}
	} else if(this.flag == -1) {
		this.print_lyrics('error : ' + resp);
	} else {
		this.print_lyrics(this.format(data));
		this.ajax_flag = 1;
	}	
}

DoubanFM.prototype.format = function(text) {
	var s = text.replace(/\[(.*)\]/g, '').trim();//去除返回数据的[]两端的内容，只保留歌词部分
	return s.replace(/\n/g, '\n<br />');//换行
}

//显示歌词
DoubanFM.prototype.print_lyrics = function(text) {
	// this.lyrics.innerHTML =  '<div id="mylrc" style="width: 490px; max-height: 280px; '
	// 						+'padding:10px; background-color: #9dd6c5; z-index: 42;'
	// 						+'position: absolute; right: 0; '
	// 						+'overflow-x: hidden; overflow-y: scroll; display: block;">'+ text +'</div>';
	this.lyrics.innerHTML = '<div class="lyrics_div">'+ 
								text +
							'</div>';
}


var fm = new DoubanFM();
window.setInterval(function() {
	fm.request_geci(); 
}, 5000);