# 调试说明

## 当前状态

我们已经实现了使用高德地图行政区划服务（DistrictSearch）的方案，但可能遇到了一些问题。让我们来调试一下。

## 🔍 调试步骤

### 1. 检查控制台输出

打开浏览器开发者工具（F12），查看Console标签页，应该能看到以下信息：

```
高德地图SDK加载完成，耗时: XX.XXms
加载的插件: ['AMap.Scale', 'AMap.DistrictSearch']
AMap对象: [object Object]
DistrictSearch插件: [function DistrictSearch]
开始搜索湖北省边界...
行政区划搜索结果: complete [object Object]
湖北省信息: [object Object]
湖北省边界路径: [Array]
开始绘制湖北省边界...
湖北省边界绘制完成
```

### 2. 如果看到错误信息

#### 错误1：DistrictSearch插件未加载
```
DistrictSearch插件: undefined
```
**解决方案：** 检查插件配置是否正确

#### 错误2：API密钥问题
```
<AMap JSAPI> KEY异常，错误信息：INVALID_USER_DOMAIN
```
**解决方案：** 需要在[高德开放平台](https://console.amap.com/)配置域名白名单

#### 错误3：行政区划服务失败
```
获取湖北省边界失败，使用备用方案
```
**解决方案：** 检查网络连接和API权限

### 3. 使用简化测试组件

我创建了一个简化的测试组件 `SimpleMapTest.js`，你可以临时替换主地图组件来测试：

```javascript
// 在 App.js 中临时替换
import SimpleMapTest from './components/SimpleMapTest';

// 替换原来的 AMapComponent
<SimpleMapTest />
```

## 🛠️ 常见问题解决

### 问题1：地图不显示
- 检查API密钥是否有效
- 确认网络连接正常
- 查看控制台错误信息

### 问题2：湖北省边界不显示
- 检查DistrictSearch插件是否正确加载
- 查看行政区划服务调用结果
- 确认边界绘制函数是否执行

### 问题3：遮罩效果不正确
- 检查多边形孔洞技术实现
- 确认图层顺序和zIndex设置
- 验证边界坐标数据

## 📋 测试清单

### 基础功能测试
- [ ] 高德地图SDK加载成功
- [ ] 地图实例创建成功
- [ ] 地图显示正常（蓝色主题）

### 行政区划服务测试
- [ ] DistrictSearch插件加载成功
- [ ] 湖北省边界数据获取成功
- [ ] 边界坐标数据有效

### 视觉效果测试
- [ ] 深色遮罩覆盖其他区域
- [ ] 湖北省边界清晰显示
- [ ] 湖北省区域高亮显示
- [ ] "湖北省"标签显示正确

## 🚀 下一步操作

1. **重启开发服务器**：`npm start`
2. **打开浏览器开发者工具**：按F12
3. **查看控制台输出**：检查是否有错误信息
4. **如果问题持续**：使用 `SimpleMapTest` 组件进行详细调试

## 📞 技术支持

如果问题仍然存在，请提供：
1. 浏览器控制台的完整错误信息
2. 网络请求的状态（Network标签页）
3. 当前使用的API密钥配置

这样我可以帮你进一步诊断问题！
