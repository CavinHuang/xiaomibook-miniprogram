/**
 *  Index js
 */

 import data from '../../lib/data.js'

 Page({
   data: {
     slider: [
         'http://image.read.duokan.com/mfsv2/download/fdsc3/p01t3HFw4zGY/cRQkpvrTm5bJJB.jpg',
         'http://image.read.duokan.com/mfsv2/download/fdsc3/p01V1KHze11Q/lb3QSrqV6N2qpI.jpg',
       ],
    swiperCurrent: 0,
    homeBtns: [
      {
        title: '限免',
        url: '../booklists/free',
        img: 'http://image.read.duokan.com/mfsv2/download/s010/p015iBxwdkmU/5wc5uzYhLZ7iVa.png'
      }, {
        title: '女生',
        url: '/pages/list/index',
        img: 'http://image.read.duokan.com/mfsv2/download/s010/p01LWZmXGCpy/aSrSq6Llgt9PqE.png'
      }, {
        title: '男生',
        url: '/pages/list/index',
        img: 'http://image.read.duokan.com/mfsv2/download/fdsc3/p01NVfuCskSL/W9VPXMnDunLwGT.png'
      }, {
        title: '分类',
        url: '/pages/list/index',
        img: 'http://image.read.duokan.com/mfsv2/download/s010/p01pz5NtyRI0/2ENONnvOg23NXM.png'
      }, {
        title: '排行',
        url: '/pages/list/index',
        img: 'http://image.read.duokan.com/mfsv2/download/s010/p010kK7M5VyH/8kPz9nKvRXyu1k.png'
      }
    ],
    _pageData: [],
    pageData: data
   },
   onLoad: () => {
    console.log(data);
   },
   swiperChange: function (e) {
     this.setData({
       swiperCurrent: e.detail.current
     })
   }
 })