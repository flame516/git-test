// 高德地图配置
export const AMAP_CONFIG = {
  // 高德地图API密钥
  API_KEY: 'f513561f9f5be5c75228c432e079c792',
  
  // 地图默认配置
  DEFAULT_CENTER: [112.5, 31.5], // 湖北省中心坐标
  DEFAULT_ZOOM: 7,
  
  // 地图样式 - 使用蓝色主题，专业美观
  MAP_STYLE: 'amap://styles/blue',
  
  // 插件配置
  PLUGINS: [
    'AMap.Scale',           // 比例尺
    'AMap.DistrictSearch'   // 行政区划搜索服务
  ],
  
  // 安全配置
  SECURITY_JS_CODE: 'your-security-js-code-here',
  
  // 错误重试配置
  MAX_RETRY_COUNT: 3,
  RETRY_DELAY: 2000,
  
  // 城市配置已简化，只保留湖北省基本信息
};

// 获取高德地图API密钥
export const getAMapApiKey = () => {
  // 优先使用环境变量
  if (process.env.REACT_APP_AMAP_API_KEY) {
    return process.env.REACT_APP_AMAP_API_KEY;
  }
  
  // 使用配置文件中的密钥
  return AMAP_CONFIG.API_KEY;
};

// 检查API密钥是否有效
export const isAMapApiKeyValid = () => {
  const apiKey = getAMapApiKey();
  return apiKey && apiKey !== 'YOUR_AMAP_API_KEY';
};
