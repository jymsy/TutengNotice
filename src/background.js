console.log(1);

var url = 'http://aptface.tutengdai.com/borrow/relievedDetail';


function sendNotice(str) {
	var opt = {
		type: "basic",
		title: '来了来了！',
		message: str,
		iconUrl: "48.png"
	};
	chrome.notifications.create((new Date()).valueOf() + '', opt, function(notificationId) {
		console.log('show notification');
	});
}

function parseData(list) {
	var noticeStr = '';
	list.forEach(function(value, index) {
		if (value.edu_format.edu_view_status !== '已售罄') {
			noticeStr += value.title + ' 来镖了！|';
		}
	});
	if (noticeStr !== '') {
		sendNotice(noticeStr);
	}
}

function getList() {
	var xmlhttp = new XMLHttpRequest();
	var result;
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			result = JSON.parse(xmlhttp.responseText);
			parseData(result.data.relieved);
		}
	}
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
	xmlhttp.setRequestHeader("Accept", "*/*");
	xmlhttp.send('noParam=');
}

getList();
setInterval(function() {
	getList();

}, 60000);