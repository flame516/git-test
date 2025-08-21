// 环境配置
export const ENV_CONFIG = {
  // 开发环境配置
  development: {
    AMAP_API_KEY: 'f513561f9f5be5c75228c432e079c792',
    AMAP_WHITELIST_DOMAINS: ['localhost', '127.0.0.1', 'localhost:3000'],
    AMAP_SECURITY_JS_CODE: 'your-security-js-code-here'
  },
  
  // 生产环境配置
  production: {
    AMAP_API_KEY: 'f513561f9f5be5c75228c432e079c792',
    AMAP_WHITELIST_DOMAINS: ['your-domain.com', 'your-production-domain.com'],
    AMAP_SECURITY_JS_CODE: 'your-production-security-js-code'
  }
};

// 获取当前环境
export const getCurrentEnv = () => {
  return process.env.NODE_ENV || 'development';
};

// 获取当前环境配置
export const getCurrentEnvConfig = () => {
  const env = getCurrentEnv();
  return ENV_CONFIG[env] || ENV_CONFIG.development;
};
