!(function(window) {
    var element = document.getElementById('content');
    var myChart = echarts.init(element);


    // var base = +new Date(2014, 9, 3);
    var url = 'https://www.g-banker.com/price/query';
    var oneDay = 24 * 3600 * 1000;
    var date = [];

    var data = [Math.random() * 150];
    var now = new Date();

    var option = {
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                params = params[0];
                return params.name + '     ' + params.value;
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
        },
        yAxis: {
            boundaryGap: [283, '50%'],
            type: 'value',
            min: 'dataMin'
        },
        series: [{
            name: '成交',
            type: 'line',
            smooth: true,
            symbol: 'none',
            stack: 'a',
            areaStyle: {
                normal: {}
            },
            data: data
        }]
    };
    myChart.setOption(option);

    chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
            if (details.type === 'xmlhttprequest') {
                details.requestHeaders.push({
                    name: 'Referer',
                    value: 'https://www.g-banker.com/goldprice/'
                }, {
                    name: 'Origin',
                    value: 'https://www.g-banker.com'
                }, {
                    name: 'X-Requested-With',
                    value: 'XMLHttpRequest'
                });
                return {
                    requestHeaders: details.requestHeaders
                };
            }
        }, {
            urls: ['https://www.g-banker.com/*']
        }, ["blocking", "requestHeaders"]
    );

    function addData(data) {
        if (data.code === '0000') {
            var time = [],
                price = [];
            var date;
            for (var value of data.data.priceArray) {
                date = new Date(value.date);

                time.push(date.getHours() + ':' + date.getMinutes());
                price.push(value.price);
            }
            myChart.setOption({
                xAxis: {
                    data: time
                },
                series: [{
                    name: '成交',
                    data: price
                }]
            });
        }
        // now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/');
        // date.push(now);
        // data.push((Math.random() - 0.4) * 10 + data[data.length - 1]);

        // if (shift) {
        //     date.shift();
        //     data.shift();
        // }

        // now = new Date(+new Date(now) + oneDay);
    }

    function getGoldPrice() {
        var xmlhttp = new XMLHttpRequest();
        var result;
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                result = JSON.parse(xmlhttp.responseText);
                addData(result);
            }
        }
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        xmlhttp.setRequestHeader("Accept", "*/*");
        xmlhttp.send('queryFlag=2');
    }
    getGoldPrice();
    setInterval(function() {
        getGoldPrice();

    }, 60000);
})(window);