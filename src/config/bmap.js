// 百度地图配置
export const BMAP_CONFIG = {
  // 百度地图API密钥
  API_KEY: 'SkyhdVOiNTHrDxVGpBYxiq2Izp5rBxt6',
  
  // 地图默认配置
  DEFAULT_CENTER: [112.5, 31.5], // 湖北省中心坐标
  DEFAULT_ZOOM: 5, // 降低缩放级别以显示更大范围
  
  // 地图样式 - 使用蓝色主题
  MAP_STYLE: 'normal', // 百度地图样式：normal, light, dark, redalert, googlelite, grassgreen, midnight, pink, darkgreen, bluish, grayscale, hardedge
  
  // 地图类型
  MAP_TYPE: 'BMAP_NORMAL_MAP', // BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP
  
  // 控件配置
  CONTROLS: {
    scale: true,        // 比例尺控件
    navigation: true,   // 导航控件
    mapType: false,     // 地图类型控件
    overview: false,    // 缩略图控件
    geolocation: false  // 定位控件
  },
  
  // 交互配置
  INTERACTION: {
    enableScrollWheelZoom: true,    // 启用滚轮缩放
    enableDoubleClickZoom: true,    // 启用双击缩放
    enableKeyboard: false,          // 启用键盘操作
    enableInertialDragging: true,   // 启用惯性拖拽
    enableContinuousZoom: true,     // 启用连续缩放
    enablePinchToZoom: true,        // 启用双指缩放
    enableAutoResize: true          // 启用自动调整
  },
  
  // 缩放范围
  MIN_ZOOM: 3,
  MAX_ZOOM: 19,
  
  // 错误重试配置
  MAX_RETRY_COUNT: 3,
  RETRY_DELAY: 2000,
  
  // 湖北省边界样式配置
  BOUNDARY_STYLE: {
    strokeColor: '#3b82f6',     // 边界线颜色
    strokeWeight: 3,            // 边界线宽度
    strokeOpacity: 1,           // 边界线透明度
    fillColor: '#3b82f6',       // 填充颜色
    fillOpacity: 0.25           // 填充透明度
  },
  
  // 遮罩样式配置
  MASK_STYLE: {
    fillColor: '#1e3a8a',       // 遮罩颜色
    fillOpacity: 0.85           // 遮罩透明度
  },
  
  // 标签样式配置
  LABEL_STYLE: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: 'rgba(30, 64, 175, 0.95)',
    borderRadius: '20px',
    padding: '8px 16px',
    border: '2px solid #60a5fa',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
  }
};

// 获取百度地图API密钥
export const getBMapApiKey = () => {
  // 优先使用环境变量
  if (process.env.REACT_APP_BMAP_API_KEY) {
    return process.env.REACT_APP_BMAP_API_KEY;
  }
  
  // 使用配置文件中的密钥
  return BMAP_CONFIG.API_KEY;
};

// 检查API密钥是否有效
export const isBMapApiKeyValid = () => {
  const apiKey = getBMapApiKey();
  return apiKey && apiKey !== 'your-baidu-map-api-key';
};

// 百度地图SDK加载配置
export const BMAP_SDK_CONFIG = {
  version: '3.0',
  type: 'webgl', // webgl 或 lite
  callback: 'initBMap'
};