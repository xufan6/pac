function FindProxyForURL(url, host) {
  var PROXY = "SOCKS5 127.0.0.1:8989; SOCKS 127.0.0.1:8989";
  var DEFAULT = "DIRECT";

  if (isInNet(host, "192.168.0.0", "255.255.0.0")) {return DEFAULT ;}
  if (isInNet(host, "10.0.0.0", "255.0.0.0")) {return DEFAULT ;}
  if (isInNet(host, "11.0.0.0", "255.0.0.0")) {return DEFAULT ;}
  if (isInNet(host, "30.0.0.0", "255.0.0.0")) {return DEFAULT ;}
  if (isInNet(host, "172.16.0.0", "255.240.0.0")) {return DEFAULT ;}
  if (isInNet(host, "100.64.0.0", "255.192.0.0")) {return DEFAULT ;}
  if (isPlainHostName(host) || (host == "localhost") || (host == "127.0.0.1") ) {return DEFAULT ;}
  if (isInNet(host, "210.32.200.0", "255.255.240.0")) {return DEFAULT ;}

  if (isInNet(host, "42.120.0.0", "255.254.0.0")) {return DEFAULT ;}
  if (isInNet(host, "42.156.0.0", "255.255.0.0")) {return DEFAULT ;}
  if (isInNet(host, "42.96.253.0", "255.255.255.0")) {return DEFAULT ;}
  if (isInNet(host, "61.164.145.55", "255.255.255.255")) {return DEFAULT ;}
  if (isInNet(host, "69.147.91.177", "255.255.255.255")) {return DEFAULT ;}
  if (isInNet(host, "110.75.0.0", "255.255.0.0")) {return DEFAULT ;}
  if (isInNet(host, "110.76.0.0", "255.255.224.0")) {return DEFAULT ;}
  if (isInNet(host, "110.76.49.0", "255.255.255.0")) {return DEFAULT ;}
  if (isInNet(host, "112.124.132.0", "255.255.252.0")) {return DEFAULT ;}
  if (isInNet(host, "112.124.136.0", "255.255.248.0")) {return DEFAULT ;}
  if (isInNet(host, "112.125.127.59", "255.255.255.255")) {return DEFAULT ;}
  if (isInNet(host, "112.125.31.0", "255.255.255.0")) {return DEFAULT ;}
  if (isInNet(host, "112.126.126.0", "255.255.254.0")) {return DEFAULT ;}
  if (isInNet(host, "114.80.184.0", "255.255.255.0")) {return DEFAULT ;}
  if (isInNet(host, "115.28.122.0", "255.255.255.0")) {return DEFAULT ;}
  if (isInNet(host, "115.28.126.0", "255.255.255.240")) {return DEFAULT ;}
  if (isInNet(host, "115.29.1.0", "255.255.255.0")) {return DEFAULT ;}
  if (isInNet(host, "115.29.255.1", "255.255.255.255")) {return DEFAULT ;}
  if (isInNet(host, "115.124.16.0", "255.255.252.0")) {return DEFAULT ;}
  if (isInNet(host, "115.236.172.20", "255.255.255.255")) {return DEFAULT ;}
  if (isInNet(host, "115.236.69.91", "255.255.255.255")) {return DEFAULT ;}
  if (isInNet(host, "119.30.208.0", "255.255.240.0")) {return DEFAULT ;}
  if (isInNet(host, "119.38.208.0", "255.255.240.0")) {return DEFAULT ;}
  if (isInNet(host, "119.42.224.0", "255.255.240.0")) {return DEFAULT ;}
  if (isInNet(host, "119.145.148.0", "255.255.255.0")) {return DEFAULT ;}
  if (isInNet(host, "120.25.111.0", "255.255.255.0")) {return DEFAULT ;}
  if (isInNet(host, "121.0.16.0", "255.255.240.0")) {return DEFAULT ;}
  if (isInNet(host, "121.15.208.130", "255.255.255.255")) {return DEFAULT ;}
  if (isInNet(host, "121.40.1.0", "255.255.255.0")) {return DEFAULT ;}
  if (isInNet(host, "121.196.131.0", "255.255.255.0")) {return DEFAULT ;}
  if (isInNet(host, "121.199.125.2", "255.255.255.255")) {return DEFAULT ;}
  if (isInNet(host, "121.199.125.4", "255.255.255.255")) {return DEFAULT ;}
  if (isInNet(host, "122.224.0.0", "255.240.0.0")) {return DEFAULT ;}
  if (isInNet(host, "122.240.0.0", "255.248.0.0")) {return DEFAULT ;}
  if (isInNet(host, "122.70.187.0", "255.255.255.0")) {return DEFAULT ;}
  if (isInNet(host, "140.205.0.0", "255.255.0.0")) {return DEFAULT ;}
  if (isInNet(host, "182.92.17.0", "255.255.255.224")) {return DEFAULT ;}
  if (isInNet(host, "182.92.246.0", "255.255.255.0")) {return DEFAULT ;}
  if (isInNet(host, "198.11.140.0", "255.255.255.0")) {return DEFAULT ;}
  if (isInNet(host, "202.102.0.0", "255.255.128.0")) {return DEFAULT ;}
  if (isInNet(host, "205.204.0.0", "255.255.0.0")) {return DEFAULT ;}
  if (isInNet(host, "210.5.9.213", "255.255.255.255")) {return DEFAULT ;}
  if (isInNet(host, "210.13.83.253", "255.255.255.255")) {return DEFAULT ;}
  if (isInNet(host, "210.83.232.130", "255.255.255.255")) {return DEFAULT ;}
  if (isInNet(host, "210.83.232.132", "255.255.255.255")) {return DEFAULT ;}
  if (isInNet(host, "223.4.0.0", "255.254.0.0")) {return DEFAULT ;}

  var safeDomains = [
"zjut.com",
"zjut.edu.cn",
"myzjut.org",
"zjut.in",
"ali.com",
"alibaba-inc.com",
"alibaba.com",
"alibaba.net",
"alibabacorp.com",
"alicdn.com",
"aliexpress.com",
"aliimg.com",
"alikunlun.com",
"alimama.com",
"alipay-corp.com",
"alipay-inc.com",
"alipay.com",
"alipay.net",
"alipayobjects.com",
"alisoft.com",
"alitrip.com",
"aliway.com",
"aliyun-inc.com",
"aliyuncs.com",
"aliyun.com",
"alizoo.com",
"amap.com",
"antfinancial-corp.com",
"antsdaq-corp.com",
"atatech.org",
"atpanel.com",
"cainiao-inc.com",
"dingtalk.com",
"fliggy.com",
"gaode.com",
"juhuasuan.com",
"kbcdn.com",
"koubei-corp.com",
"koubei.com",
"mayibank.net",
"mybank-corp.cn",
"tanx.com",
"taobao.com",
"taobao.net",
"taobao.org",
"taobaocdn.com",
"tbcdn.cn",
"tbsite.net",
"tmall.com",
"tmall.net",
"yunos-inc.com",
"zmxy-corp.com.cn",
"ssssp.net",
"xufan6.com",
"crhan.com",
"minyo.us",

"10010.com",
"115.com",
"115cdn.com",
"115img.com",
"123u.com",
"126.com",
"126.net",
"163.com",
"17173.com",
"178.com",
"17cdn.com",
"21cn.com",
"360buy.com",
"360buyimg.com",
"360doc.com",
"360safe.com",
"36kr.com",
"3798.com",
"4006024680.com",
"4006695539.com",
"400gb.com",
"4399.com",
"51.la",
"51buy.com",
"51cto.com",
"51job.com",
"51jobcdn.com",
"51yes.com",
"52blackberry.com",
"56.com",
"58.68.130.147",
"5any.com",
"5d6d.com",
"5d6d.net",
"61.com",
"6rooms.com",
"7k7k.com",
"8264.com",
"91.com",
"acfun.tv",
"aixifan.com",
"ali213.net",
"alibaba.com",
"alicdn.com",
"aliexpress.com",
"aliimg.com",
"alikunlun.com",
"alimama.com",
"alipay.com",
"alipayobjects.com",
"alisoft.com",
"aliyun.com",
"aliyuncdn.com",
"aliyuncs.com",
"alphatown.com",
"anzhi.com",
"appinn.com",
"apple.com",
"appsina.com",
"archlinuxcn.org",
"atpanel.com",
"baidu.com",
"baidupcs.com",
"baidustatic.com",
"baihe.com",
"baixing.com",
"bdimg.com",
"bdstatic.com",
"bilibili.com",
"bilibili.tv",
"blogbus.com",
"blueidea.com",
"bonree.com",
"bootcss.com",
"ccb.com",
"cctv.com",
"cctvpic.com",
"cdn20.com",
"ceair.com",
"china.com",
"chinabyte.com",
"chinacache.com",
"chinacache.net",
"chinamobile.com",
"chinanews.com",
"chinapay.com",
"chinaren.com",
"chinaunionpay.com",
"chinaunix.com",
"chinaunix.net",
"chinaz.com",
"cmbchina.com",
"cn",
"cn.bing.com",
"cn.debian.org",
"cn99.com",
"cnbeta.com",
"cnbetacdn.com",
"cnblogs.com",
"cnepub.com",
"cnki.net",
"cnzz.com",
"comsenz.com",
"cqvip.com",
"csair.com",
"csairholiday.com",
"csdn.net",
"ct10000.com",
"ctdisk.com",
"ctrip.com",
"c-ctrip.com",
"dangdang.com",
"dbank.com",
"dedecms.com",
"diandian.com",
"dianping.com",
"discuz.com",
"discuz.net",
"dl.google.com",
"docin.com",
"donews.com",
"dospy.com",
"dou.bz",
"douban.com",
"douban.fm",
"dpfile.com",
"duapp.com",
"duba.net",
"duomi.com",
"duote.com",
"duowan.com",
"duxiu.com",
"ecitic.com",
"egou.com",
"elong.com",
"et8.org",
"etao.com",
"fantong.com",
"fenzhi.com",
"flyert.com",
"flyertea.com",
"foodmate.net",
"ganji.com",
"gaopeng.com",
"gfan.com",
"google-analytics.com",
"google.cn",
"gtimg.com",
"guao.cc",
"guao.hk",
"hao123.com",
"hc360.com",
"hdslb.com",
"hiapk.com",
"hichina.com",
"hiwifi.com",
"histatic.com",
"homeinns.com",
"hoopchina.com",
"huaban.com",
"huanqiu.com",
"huawei.com",
"hudong.com",
"huochepiao.com",
"hupu.com",
"hzbys.com",
"hzqx.com",
"hzrc.com",
"hzti.com",
"iask.com",
"iciba.com",
"icson.com",
"idqqimg.com",
"ifeng.com",
"ifengimg.com",
"ijinshan.com",
"images-amazon.com",
"img.hb.aicdn.com",
"ip138.com",
"iqiyi.com",
"it168.com",
"iteye.com",
"jandan.net",
"jd.com",
"jiankongbao.com",
"jiathis.com",
"jiayuan.com",
"jiepang.com",
"jing.fm",
"jstv.com",
"jumei.com",
"kaixin001.com",
"kandian.com",
"kandian.net",
"kanimg.com",
"kankan.com",
"kdnet.net",
"koolearn.com",
"koudai8.com",
"ku6.com",
"ku6cdn.com",
"ku6img.com",
"kuaidi100.com",
"kugou.com",
"kuukie.com",
"lashou.com",
"letao.com",
"le.com",
"lemall.com",
"letv.com",
"lietou.com",
"linezing.com",
"loli.mg",
"loli.vg",
"lvmama.com",
"lvping.com",
"lxdns.com",
"mangocity.com",
"mafengwo.net",
"mapbar.com",
"maxpda.com",
"mayi.com",
"mediav.com",
"meilishuo.com",
"meituan.com",
"meituan.net",
"meizu.com",
"mi.com",
"miaopai.com",
"microsoft.com",
"miui.com",
"mop.com",
"mtime.com",
"mydrivers.com",
"mzstatic.com",
"netease.com",
"networkbench.com",
"newsmth.net",
"ngacn.cc",
"nuomi.com",
"okbuy.com",
"optaim.com",
"oschina.com",
"oschina.net",
"paipai.com",
"pcbeta.com",
"pchome.net",
"pcpop.com",
"pengyou.com",
"phpwind.net",
"pingan.com",
"pool.ntp.org",
"pplive.com",
"ppstream.com",
"pptv.com",
"putclub.com",
"qhimg.com",
"qianlong.com",
"qidian.com",
"qingdaonews.com",
"qiushibaike.com",
"qiyi.com",
"qiyipic.com",
"qq.com",
"qqmail.com",
"qstatic.com",
"qunar.com",
"qunarzz.com",
"quwan.com",
"qvbuy.com",
"qyer.com",
"qyerstatic.com",
"renren.com",
"rrfmn.com",
"rrimg.com",
"sanguosha.com",
"sdo.com",
"shanbay.com",
"shuiku.net",
"sina.com",
"sina.com.cn",
"sinaapp.com",
"sinacloud.com",
"sinaedge.com",
"sinaimg.cn",
"sinaimg.com",
"sinajs.com",
"skycn.com",
"smzdm.com",
"sogou.com",
"sohu.com",
"soku.com",
"soso.com",
"soufun.com",
"soufunimg.com",
"staticsdo.com",
"steamcn.com",
"suning.com",
"swhz6.com",
"szzfgjj.com",
"tanx.com",
"taobao.com",
"taobaocdn.com",
"tbcache.com",
"tdimg.com",
"tencent.com",
"tenpay.com",
"tgbus.com",
"thawte.com",
"tiancity.com",
"tianyaui.com",
"tiexue.net",
"tingyun.com",
"tmall.com",
"tmcdn.net",
"tom.com",
"tomonline-inc.com",
"tuan800.com",
"tuan800.net",
"tuanimg.com",
"tudou.com",
"tudouui.com",
"tuitui.info",
"tuniu.com",
"u148.net",
"u17.com",
"ubuntu.com",
"ucjoy.com",
"uni-marketers.com",
"unionpay.com",
"unionpaysecure.com",
"unixbeta.com",
"useso.com",
"uusee.com",
"uuu9.com",
"vancl.com",
"vanclimg.com",
"vcimg.com",
"verycd.com",
"veryzhun.com",
"wandoujia.com",
"wdjimg.com",
"wechat.com",
"weibo.com",
"weiphone.com",
"weiyun.com",
"west263.com",
"wrating.com",
"wumii.com",
"xdcdn.net",
"xiachufang.com",
"xiami.com",
"xiami.net",
"xiaomi.com",
"xiaonei.com",
"xiazaiba.com",
"xici.net",
"xilu.com",
"xinhuanet.com",
"xinnet.com",
"xlpan.com",
"xn--fiqs8s",
"xnimg.cn",
"xnpic.com",
"xungou.com",
"xunlei.com",
"ydstatic.com",
"yesky.com",
"yeyou.com",
"yhachina.com",
"yhd.com",
"yihaodian.com",
"yihaodianimg.com",
"yingjiesheng.com",
"yintai.com",
"yinyuetai.com",
"yiqifa.com",
"yinxiang.com",
"yixun.com",
"ykimg.com",
"ynet.com",
"yongche.com",
"youdao.com",
"yougou.com",
"youku.com",
"yupoo.com",
"yy.com",
"yyets.com",
"yyets.net",
"zdmimg.com",
"zbjimg.com",
"zhaopin.com",
"zhi.hu",
"zhihu.com",
"zhimg.com",
"zhubajie.com",
"zj165.com",
"zjks.com",
"zjyha.com",
"zongheng.com"
  ];

  function dnsDomainIs(host, pattern) {
    return host.length >= pattern.length && (host === pattern || host.substring(host.length - pattern.length - 1) === '.' + pattern);
  }
  for (var i in safeDomains) {
    if ( dnsDomainIs( host, safeDomains[i] ) ){
      return DEFAULT;
    }
  }

  return PROXY ;
}
