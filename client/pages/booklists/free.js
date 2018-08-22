/**
 * book list Page script
 */

 import pageData from '../../lib/freeData.js'

Page({
  data: {
    pageData: pageData
  },
  onLoad(){
    console.log(pageData);
    
  }
})