<template lang="pug">
div(id="app")

  el-container.header
    el-aside
      h3 選擇縣市

      el-select.city(v-model="city" @change="cityChange" placeholder="請選擇" clearable filterable)
        el-option(v-for="(item, index) in cityList" :label="item.CityName" :value="item.CityName" :key="index")

      h3 選擇鄉/鎮/區

      el-select.area(:disabled="city === ''" v-model="area" @change="areaChange" placeholder="請選擇" clearable filterable)
        el-option(v-for="item in areaList" :label="item.AreaName" :value="item.AreaName" :key="item.ZipCode")

    el-main
      div(id="map")
      
    <router-view></router-view>
</template>

<script>
import L from 'leaflet'
import { cityList } from '@/site.js'

// 設定空物件
let openStreetMap = {}

export default {
  name: 'App',

  data () {
    return {
      L,
      city: '',
      area: '',
      cityList,
      areaList: [],
      allData: [],
      data: [],
    }
  },

  watch: {
    'city' (newValue) {
      this.area = ''
      if (!['', null, undefined].includes(newValue)) {
        let result = cityList.filter(item => item.CityName === this.city)
        this.areaList = result[0].AreaList
      }
    },

    'data' (newValue) {
      if (newValue.length !== 0) {
        this.updateMap()
      }
    },
  },

  mounted() {
    // == 初始化 ==
    openStreetMap = L.map('map').setView([24.164145, 120.636210], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(openStreetMap)

    // == 呼叫 api ==
    this.$http.get('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json')
      .then(res => {
      this.allData = res.data.features
    })
  },

  methods: {
    cityChange () {
      this.area = ''
    },

    areaChange () {
      if (!['', null, undefined].includes(this.area)) {
        this.data = this.allData.filter(item => item.properties.town === this.area && item.properties.county === this.city)
      }
    },

    async updateMap() {
      let x, y
      let easternmost
      let southernmost
      let Westmost
      let northernmost

      // == 清除 markers ==

      openStreetMap.eachLayer(layer => {
        if (layer instanceof L.Marker) openStreetMap.removeLayer(layer)
      })

      // == 加 markers ==
      
      this.data.forEach(item => {
        // 紀錄資料，用來做定位
        if (easternmost === undefined) easternmost = item.geometry.coordinates[0]
        if (Westmost === undefined) Westmost = item.geometry.coordinates[0]
        if (southernmost === undefined) southernmost = item.geometry.coordinates[1]
        if (northernmost === undefined) northernmost = item.geometry.coordinates[1]

        if (easternmost !== undefined && easternmost > item.geometry.coordinates[0]) easternmost = item.geometry.coordinates[0]
        if (Westmost !== undefined && Westmost < item.geometry.coordinates[0]) Westmost = item.geometry.coordinates[0]
        if (southernmost !== undefined && southernmost < item.geometry.coordinates[1]) southernmost = item.geometry.coordinates[1]
        if (northernmost !== undefined && northernmost > item.geometry.coordinates[1]) northernmost = item.geometry.coordinates[1]

        // 透過藥局經緯度疊加標記
        L.marker([item.geometry.coordinates[1], item.geometry.coordinates[0]])
          .addTo(openStreetMap)
          .bindPopup(
            `
              <h3 style="font-size: 16px;"> ${item.properties.name} </h3>
              <p style="font-size: 16px; color: #d45345;"> 口罩剩餘：大人 - ${item.properties.mask_adult ? `${item.properties.mask_adult} 個` : '未取得資料'} / 兒童 - ${item.properties.mask_child ? `${item.properties.mask_child} 個` : '未取得資料'} </p>
              <p> 地址: ${item.properties.address} </p>
              <p> 電話: ${item.properties.phone} </p>
              <p> 最後更新時間: ${item.properties.updated} </p>
            `,
          )
      })

      // == 當選擇鄉/鎮/區時，畫面移動到該地 ==

      x = (southernmost + northernmost)/2
      y = (easternmost + Westmost)/2
      if (x !== undefined && y !== undefined) {
        openStreetMap.flyTo([x, y], 14)
      }
    },
  },
}
</script>

<style lang="scss">

#app {
  padding: 10px;
  background-color: snow;
}

#map {
  width: 100%;
  height: 90vh;
}

.city {
  margin: 0 0 15px 0;
}

</style>