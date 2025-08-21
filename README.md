# 湖北省创业扶持数据展示平台

## 🎯 项目简介

专为55寸大屏展示设计的湖北省创业扶持数据可视化平台，展示"四清单两名录"六大核心模块的实时数据。

## ✨ 核心功能

- **场地信息分析** - 创业场地分布、面积统计
- **融资信息分析** - 融资产品、贷款政策
- **培训信息分析** - 培训机构、培训内容
- **政策信息分析** - 扶持政策、支持金额
- **导师信息分析** - 创业导师、专业领域
- **服务机构分析** - 就业服务、满意度评分

## 🚀 快速开始

### 环境要求
- Node.js 16.0+
- npm 8.0+

### 安装步骤

1. **克隆项目**
   ```bash
   git clone [项目地址]
   cd hubei-preview-demo
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动项目**
   ```bash
   # 使用启动脚本
   chmod +x start.sh
   ./start.sh
   
   # 或直接使用npm
   npm start
   ```

4. **访问应用**
   - 本地开发: http://localhost:3000
   - 大屏展示: 全屏模式访问

## 🎨 技术架构

- **React 18** - 用户界面框架
- **Tailwind CSS** - 样式框架
- **Recharts** - 数据可视化图表库
- **高德地图** - 地理信息展示
- **Lucide React** - 图标库

## 📱 屏幕适配

- **分辨率**: 3840x2160 (4K)
- **布局**: 12列6行网格布局
- **响应式**: 自适应不同屏幕尺寸
- **触摸友好**: 大按钮和悬停效果

## 📁 项目结构

```
src/
├── App.js              # 主应用组件
├── index.js            # 应用入口
├── index.css           # 全局样式
├── components/         # 组件目录
│   └── AMapComponent.js # 地图组件
└── config/             # 配置文件
    └── amap.js         # 高德地图配置

public/
├── index.html          # HTML模板
└── manifest.json       # PWA配置

package.json            # 项目配置
tailwind.config.js      # Tailwind配置
```

## 🚀 部署

### 本地构建
```bash
npm run build
```

### 部署脚本
Linux:
```bash
chmod +x deploy.sh
./deploy.sh
```
windows:
```
./deploy.bat
```

## �� 许可证

MIT License
