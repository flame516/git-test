# 高德行政区划服务实现方案

## 概述

使用高德地图的行政区划服务（DistrictSearch）来获取湖北省的官方准确边界数据，实现"只显示湖北省"的效果。

## 核心原理

### 1. 行政区划服务
```javascript
const districtSearch = new AMap.DistrictSearch({
    level: 'province',       // 查询省级
    subdistrict: 0,          // 不获取下级区域
    showbiz: false,          // 不显示业务信息
    extensions: 'all'        // 获取完整边界信息
});
```

### 2. 多边形孔洞技术
```javascript
// 外层遮罩 + 内层湖北省边界 = 只显示湖北省
const maskPolygon = new AMap.Polygon({
    path: [outerMask, hubeiPath], // 外层矩形 + 内层孔洞
    fillColor: '#0f172a',
    fillOpacity: 0.8
});
```

## 实现步骤

### 步骤1：获取湖北省边界
```javascript
districtSearch.search('湖北省', (status, result) => {
    if (status === 'complete' && result.districtList && result.districtList.length) {
        const hubei = result.districtList[0];
        const hubeiPath = hubei.districts[0].polyline;
        drawHubeiDistrict(hubeiPath);
    }
});
```

### 步骤2：创建遮罩效果
```javascript
// 外层遮罩覆盖整个地图
const outerMask = [
    [70, 15], [140, 15], [140, 55], [70, 55], [70, 15]
];

// 使用多边形孔洞技术
const maskPolygon = new AMap.Polygon({
    path: [outerMask, hubeiPath], // 外层 + 内层孔洞
    fillColor: '#0f172a',          // 深色遮罩
    fillOpacity: 0.8
});
```

### 步骤3：绘制湖北省
```javascript
// 湖北省区域高亮
const provinceHighlight = new AMap.Polygon({
    path: hubeiPath,
    strokeColor: '#3b82f6',
    strokeWeight: 4,
    fillColor: '#1e40af',
    fillOpacity: 0.3
});

// 湖北省边界线条
const boundary = new AMap.Polygon({
    path: hubeiPath,
    strokeColor: '#60a5fa',
    strokeWeight: 3,
    fillColor: 'transparent'
});
```

## 技术优势

### 1. 官方数据准确性
- 使用高德官方行政区划数据
- 边界坐标精确，符合实际行政区划
- 自动更新，无需手动维护

### 2. 完美遮罩效果
- 多边形孔洞技术
- 湖北省以外区域完全被遮罩
- 视觉效果：只有湖北省可见

### 3. 性能优化
- 减少手动绘制的复杂计算
- 利用高德地图的优化渲染
- 支持大数据量的边界数据

## 备用方案

如果行政区划服务失败，自动回退到手动绘制的边界：

```javascript
} else {
    console.warn('获取湖北省边界失败，使用备用方案');
    drawHubeiDistrictFallback();
}
```

## 配置要求

### 1. 插件配置
```javascript
PLUGINS: [
    'AMap.Scale',           // 比例尺
    'AMap.DistrictSearch'   // 行政区划搜索服务
]
```

### 2. API密钥权限
- 需要启用"行政区划"服务权限
- 确保域名白名单配置正确

## 效果展示

### 实现前
- 显示全国地图
- 湖北省边界不准确
- 其他省份干扰视觉

### 实现后
- 湖北省边界精确
- 其他区域被深色遮罩
- 湖北省突出显示
- 视觉效果：只有湖北省存在

## 使用方法

### 1. 启动应用
```bash
npm start
```

### 2. 查看效果
- 地图将自动获取湖北省边界
- 其他区域被深色遮罩覆盖
- 湖北省区域明亮突出

### 3. 交互功能
- 双击地图返回全省视图
- 拖拽平移查看不同区域
- 滚轮缩放地图

## 总结

通过使用高德地图的行政区划服务，我们实现了：

1. ✅ **官方准确边界** - 使用高德官方行政区划数据
2. ✅ **完美遮罩效果** - 多边形孔洞技术隐藏其他区域
3. ✅ **自动边界获取** - 无需手动维护边界坐标
4. ✅ **性能优化** - 利用高德地图的优化渲染
5. ✅ **备用方案** - 服务失败时自动回退

这种方法比手动绘制边界更加准确、高效，是官方推荐的行政区可视化方案。
