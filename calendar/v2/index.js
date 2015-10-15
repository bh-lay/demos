
var private_Day_title=['日','一','二','三','四','五','六'];

/**
 * 获取某一月有多少天
 * month为实际月份，一月即为1
 **/
function getDateLengthInMonth(year,month){
	return new Date(year,month,0).getDate();
}
/**
 * 获取某一月第一天是周几
 * month为实际月份，一月即为1
 * 返回0即为周日
 **/
function getFirstDayInMonth(year,month){
	return new Date(year,month-1,1).getDay();
}

/**
 * 绘制单月表格
 **/
function PaintMonthTable(year,month){

	var firstDay = getFirstDayInMonth(year,month),
		length = getDateLengthInMonth(year,month),
		lastMonthLength = getDateLengthInMonth(year,month-1),
		i,
		html = '<div class="calender-month">';

	//构建星期
	html += '<div class="calender-caption">';
	for(i=0;i<7;i++){
		html += '<div class="calender-cell">' + private_Day_title[i] + '</div>';
	}
	html += '</div>';

	//构建日期列表
	html += '<div class="calender-content">';
	//循环输出月前空格
	for(i=1;i<firstDay+1;i++){
		html += '<div class="calender-cell calender-cell-dark">' + (lastMonthLength - firstDay + i) + '</div>';
	}
	//循环输出当前月所有天
	for(i=1;i<length+1;i++){
		html += '<div class="calender-cell">' + i + '</div>';
	}
	//循环输出下个月初日期
	for(i=1;i<8-(length+firstDay)%7;i++){
		html += '<div class="calender-cell calender-cell-dark">' + i + '</div>';
	}
	return html;
}

function buildCalender(){
	var year = document.getElementById('year').value,
		month = document.getElementById('month').value,
		calender_html = PaintMonthTable(year,month);

	document.getElementById('calender').innerHTML = calender_html;
}
buildCalender();


















