function FindProxyForURL(url, host) {
  var PROXY = "SOCKS5 127.0.0.1:7070";
  var DEFAULT = "DIRECT";
  var MYZJUT = "DIRECT";

  if (isInNet(host, "192.168.0.0", "255.255.0.0")) {return DEFAULT ;}
  if (isInNet(host, "10.0.0.0", "255.0.0.0")) {return DEFAULT ;}
  if (isInNet(host, "172.16.0.0", "255.240.0.0")) {return DEFAULT ;}
  if ( host == "localhost" || host == "127.0.0.1" ) {return DEFAULT ;}

  if (shExpMatch(host,"*.zjut.com")) {return MYZJUT ;}
  if (shExpMatch(host,"zjut.com")) {return MYZJUT ;}
  if (shExpMatch(host,"*.zjut.edu.cn")) {return MYZJUT ;}
  if (shExpMatch(host,"*.myzjut.org")) {return MYZJUT ;}
  if (shExpMatch(host,"myzjut.org")) {return MYZJUT ;}
  if (isInNet(host, "210.32.200.0", "255.255.240.0")) {return MYZJUT ;}
  if (shExpMatch(host,"*.zjut.in")) {return MYZJUT ;}

  if (shExpMatch(host,"*.tbcdn.cn")) {return DEFAULT ;}
  if (shExpMatch(host,"*.taobaocdn.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.taobao.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.*.taobao.com")) {return DEFAULT ;}
  if (shExpMatch(host,"taobao.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.atpanel.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.tmall.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.juhuasuan.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.alipay.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.alipayobjects.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.tanx.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.koubei.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.kbcdn.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.aliway.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.taobao.org")) {return DEFAULT ;}
  if (shExpMatch(host,"*.taobao.net")) {return DEFAULT ;}
  if (shExpMatch(host,"*.ali.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.alibaba.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.china.alibaba.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.aliimg.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.alimama.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.alibaba-inc.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.alipay-inc.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.aliyun-inc.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.aliyun.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.alibabacorp.com")) {return DEFAULT ;}
  if (isInNet(host, "121.0.16.0", "255.255.240.0")) {return DEFAULT ;}
  if (isInNet(host, "110.75.0.0", "255.255.0.0")) {return DEFAULT ;}
  if (isInNet(host, "110.76.0.0", "255.255.224.0")) {return DEFAULT ;}
  if (isInNet(host, "115.127.16.0", "255.255.240.0")) {return DEFAULT ;}

  if (shExpMatch(host,"*.ssssp.net")) {return DEFAULT ;}
  if (shExpMatch(host,"ssssp.net")) {return DEFAULT ;}
  if (shExpMatch(host,"*.xufan6.com")) {return DEFAULT ;}
  if (shExpMatch(host,"xufan6.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.crhan.com")) {return DEFAULT ;}
  if (shExpMatch(host,"crhan.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.cn")) {return DEFAULT ;}
  if (shExpMatch(host,"*.renren.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.xnimg.cn")) {return DEFAULT ;}
  if (shExpMatch(host,"*.xnpic.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.rrimg.com")) {return DEFAULT ;}
  if (shExpMatch(host,"renren.com")) {return DEFAULT ;}
  if (shExpMatch(host,"qq.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.qq.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.*.qq.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.qqmail.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.qstatic.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.gtimg.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.paipai.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.soso.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.sinaapp.com")) {return DEFAULT ;}
  if (shExpMatch(host,"sina.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.sina.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.sina.com.cn")) {return DEFAULT ;}
  if (shExpMatch(host,"*.sinaimg.cn")) {return DEFAULT ;}
  if (shExpMatch(host,"douban.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.douban.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.douban.fm")) {return DEFAULT ;}
  if (shExpMatch(host,"douban.fm")) {return DEFAULT ;}
  if (shExpMatch(host,"dou.bz")) {return DEFAULT ;}
  if (shExpMatch(host,"alphatown.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.dianping.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.chinaunix.net")) {return DEFAULT ;}
  if (shExpMatch(host,"*.youku.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.ykimg.com")) {return DEFAULT ;}
  if (isInNet(host, "114.80.184.0", "255.255.255.0")) {return DEFAULT ;}
  if (isInNet(host, "202.102.0.0", "255.255.128.0")) {return DEFAULT ;}
  if (shExpMatch(host,"*.ku6.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.ku6cdn.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.ku6img.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.tudou.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.tdimg.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.tudouui.com")) {return DEFAULT ;}
  if (shExpMatch(host,"guao.cc")) {return DEFAULT ;}
  if (shExpMatch(host,"*.guao.hk")) {return DEFAULT ;}
  if (shExpMatch(host,"*.google.cn")) {return DEFAULT ;}
  if (shExpMatch(host,"*.baidu.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.360buy.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.360buyimg.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.google-analytics.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.xunlei.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.jiankongbao.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.lvping.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.ctrip.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.hudong.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.cn99.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.52blackberry.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.chinamobile.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.zjyha.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.yhachina.com")) {return DEFAULT ;}
  if (shExpMatch(host,"weibo.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.weibo.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.56.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.xiami.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.maxpda.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.115.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.115cdn.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.115img.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.dospy.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.hzti.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.nuomi.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.163.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.126.net")) {return DEFAULT ;}
  if (shExpMatch(host,"*.netease.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.8264.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.cqvip.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.miui.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.tuitui.info")) {return DEFAULT ;}
  if (shExpMatch(host,"*.ip138.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.cnbeta.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.chinaunix.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.unixbeta.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.sogou.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.sohu.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.tanx.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.vancl.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.vanclimg.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.quwan.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.qiyi.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.qiyipic.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.verycd.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.pptv.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.icson.com")) {return DEFAULT ;}
  if (isInNet(host, "122.224.0.0", "255.240.0.0")) {return DEFAULT ;}
  if (isInNet(host, "122.240.0.0", "255.248.0.0")) {return DEFAULT ;}
  if (shExpMatch(host,"*.cmbchina.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.unionpay.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.chinapay.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.unionpaysecure.com")) {return DEFAULT ;}
  if (shExpMatch(host,"unionpaysecure.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.chinaunionpay.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.foodmate.net")) {return DEFAULT ;}
  if (shExpMatch(host,"*.ct10000.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.qunar.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.csair.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.putclub.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.cnki.net")) {return DEFAULT ;}
  if (shExpMatch(host,"*.images-amazon.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.zjks.com")) {return DEFAULT ;}
  if (shExpMatch(host,"huaban.com")) {return DEFAULT ;}
  if (shExpMatch(host,"img.hb.aicdn.com")) {return DEFAULT ;}
  if (shExpMatch(host,"yyets.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.hzqx.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.hzti.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.oschina.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.docin.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.dbank.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.koolearn.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.duxiu.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.cnzz.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.hzrc.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.hzbys.com")) {return DEFAULT ;}
  if (shExpMatch(host,"58.68.130.147")) {return DEFAULT ;}
  if (shExpMatch(host,"*.mayi.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.ganji.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.10010.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.kuukie.com")) {return DEFAULT ;}
  if (shExpMatch(host,"*.weiphone.com")) {return DEFAULT ;}

  return PROXY ;
}
