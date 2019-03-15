Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      iconPath: '../image/location.png',
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 20,
      height: 43
    }],
    // 右侧导航的数据
    datas:[
      {
        name:"费用",
        case:["免费","收费"]
      },
      {
        name: "距离",
        case: ["500米", "1公里","3公里"]
      },
      {
        name: "无障碍公厕",
        case: ["男女通用", "1公里", "3公里"]
      },
      {
        name: "母婴室",
        case: ["有", "无"]
      },
      {
        name: "第三卫生间",
        case: ["有", "无"]
      },
      {
        name: "厕纸",
        case: ["有", "无"]
      }
    ],
    currentId:-1,
    imposeId:-1,
    dataArr:[],
    hide:true
  },
  selectOn:function(e){
    var index = e.currentTarget.dataset.id;
    this.setData({
      currentId:index
    })
  },
  impose:function(e){
    var index = e.currentTarget.dataset.ids;
    this.setData({
      imposeId: index
    })
  },
  back:function(){
    this.setData({
      hide:true
    })
  },
  showShadow:function(){
    this.setData({
      hide: false
    })
  },
  onShow: function() {
    // 获取当前位置
    let map = wx.createMapContext("map");
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        // console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      }.bind(this)
    })
  }
})