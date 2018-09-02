
// 判断是否数字(包括小数)
function isNumeric(s)
{
    var reg = new RegExp(/\d+(\.\d+)?/);
    return reg.test(s);
}

// 阿拉伯数字转成读音对应的中文数字
function number2voice(money) 
{/*{{{*/
    if (!isNumeric(money)) return money;
  //汉字的数字
  var cnNums = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
  //基本单位
  var cnIntRadice = new Array('', '十', '百', '千');
  //对应整数部分扩展单位
  var cnIntUnits = new Array('', '万', '亿', '兆');
  //对应小数部分单位
  //var cnDecUnits = new Array('角', '分', '毫', '厘');
  var cnDecUnits = new Array('', '', '', '');
  //整数金额时后面跟的字符
  //var cnInteger = '整';
  var cnInteger = '';
  //整型完以后的单位
  //var cnIntLast = '元';
  var cnIntLast = '';
  //最大处理的数字
  var maxNum = 999999999999999.9999;
  //金额整数部分
  var integerNum;
  //金额小数部分
  var decimalNum;
  //输出的中文金额字符串
  var chineseStr = '';
  //分离金额后用的数组，预定义
  var parts;
  if (money === '') { return ''; }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return '';
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf('.') == -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1];//.substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0;
    var IntLen = integerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != '') {
    chineseStr += '点';
    var decLen = decimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = decimalNum.substr(i, 1);
      if (n != '0') {
        chineseStr += cnNums[Number(n)];// + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == '') {
    chineseStr += cnInteger;
  }

  if (chineseStr[0]=='一' && chineseStr[1]=='十') {
      chineseStr = chineseStr.substr(1);
  }

  return chineseStr;
}/*}}}*/

// 计算表达式数组转成可读块
function express2voice(express)
{/*{{{*/
    var res = [];
    // 数组
    if (Array.isArray(express)) {
        for (var i=0;i<express.length;++i) {
            res.push(number2voice(express[i]));
        }
    }
    // 其他
    else {
        res.push(number2voice(express));
    }
    var voices = [];
    for (var i=0;i<res.length;++i) {
        var word = res[i];
        for (var k=0;k<word.length;++k) {
            voices.push(word[k]);
        }
        voices.push(''); //停顿
    }
    return voices;
}/*}}}*/


// 声音组件
function Voice(opt)
{
    this.debug=0;
    this.speed=500;   //!< 停顿间隔(语速)
    this.isStop=false;  //!< 停止
    if(opt){ 
        if(opt.speed)this.speed=opt.speed;
        if(opt.debug)this.debug=opt.debug;
    }
    var thiso=this;

    // 设置语速
    this.setSpeed=function(speed) 
    {/*{{{*/
        this.speed = speed;
    };/*}}}*/

    // 读单词
    this.speekWord=function(word) 
    {/*{{{*/
        switch (word) {
            case '+': word="加"; break;
            case '-': word="减"; break;
            case '*': word="乘"; break;
            case '/': word="除"; break;
            case '=': word="等于"; break;
        }
        var audio = document.getElementById('voice_'+word);
        if (audio) audio.play();       
    };/*}}}*/

    // 读单词数组
    this.speek=function(words,i)
    {/*{{{*/
        if (this.isStop) return;
        if (i>=words.length) return;
        this.speekWord(words[i]);
        setTimeout(function(){
            thiso.speek(words,++i);
        },this.speed);
    };/*}}}*/

    // 读算术题
    this.speekArithmetic=function(arithmetics)
    {
        this.isStop = false;
        var words = express2voice(arithmetics);
        if (this.debug) console.log(words);
        this.speek(words,0);
    }

    // 停止
    this.stop=function() {
        this.isStop=true;
    };
}
