# 故障排除指南

## 已修复的控制台错误

### 1. React非布尔属性警告 ✅

**问题描述：**
```
Warning: Received `true` for a non-boolean attribute `jsx`.
Warning: Received `true` for a non-boolean attribute `global`.
```

**解决方案：**
将 `<style jsx global>` 改为 `<style jsx="true" global="true">`

**修复位置：**
- `src/App.js` 第454行
- `src/components/AMapComponent.js` 样式标签

### 2. Canvas2D性能警告 ✅

**问题描述：**
```
Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true.
```

**解决方案：**
在高德地图配置中添加Canvas优化参数：
- `canvas: true`
- `willReadFrequently: true`

**修复位置：**
- `src/components/AMapComponent.js` 地图初始化配置

### 3. 高德地图API域名错误 ⚠️

**问题描述：**
```
<AMap JSAPI> KEY异常，错误信息：INVALID_USER_DOMAIN
```

**解决方案：**
需要在[高德开放平台](https://console.amap.com/)配置域名白名单：
- `localhost`
- `127.0.0.1`
- `localhost:3000`

**临时解决方案：**
使用新的API密钥或等待域名白名单配置完成

### 4. 错误处理优化 ✅

**新增功能：**
- 错误边界组件 (`ErrorBoundary`)
- 地图加载重试机制
- 性能监控和错误日志

## 开发环境设置

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm start
# 或
npm run dev
```

### 3. 清理和重新安装
```bash
npm run clean
```

## 生产环境部署

### 1. 构建生产版本
```bash
npm run build
```

### 2. 配置环境变量
创建 `.env.production` 文件：
```bash
REACT_APP_AMAP_API_KEY=你的生产环境API密钥
REACT_APP_AMAP_SECURITY_JS_CODE=你的安全密钥
```

### 3. 域名配置
确保生产域名已添加到高德地图API白名单

## 常见问题

### Q: 地图不显示怎么办？
A: 检查控制台是否有API密钥错误，确认域名白名单配置

### Q: 控制台还有警告怎么办？
A: 清除浏览器缓存，重新启动开发服务器

### Q: 如何获取新的高德地图API密钥？
A: 访问[高德开放平台](https://console.amap.com/)创建新应用

## 技术支持

如果问题仍然存在，请：
1. 检查浏览器控制台完整错误信息
2. 确认网络连接正常
3. 验证API密钥有效性
4. 查看高德地图服务状态
