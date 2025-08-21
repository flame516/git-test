/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { AMAP_CONFIG, getAMapApiKey, isAMapApiKeyValid } from '../config/amap';
import { HUBEI_BOUNDARY } from '../config/hubeiBoundary';

const AMapComponent = ({ realData, onCityClick }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // 城市配置已移除，只保留湖北省边界

  // 地图初始化函数
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initMap = React.useCallback(() => {
    if (!mapRef.current || mapInstance.current) return;

    try {
      // 创建地图实例 - 简化配置
      mapInstance.current = new window.AMap.Map(mapRef.current, {
        zoom: AMAP_CONFIG.DEFAULT_ZOOM,
        center: AMAP_CONFIG.DEFAULT_CENTER,
        mapStyle: AMAP_CONFIG.MAP_STYLE,
        features: ['bg', 'point', 'text'], // 只保留基础图层
        viewMode: '2D',
        expandZoomRange: true,
        zooms: [3, 20],
        dragEnable: true,
        zoomEnable: true,
        doubleClickZoom: true,
        resizeEnable: true,
        autoResize: true,
        showBuildingBlock: false, // 关闭建筑块显示
        showIndoorMap: false,
        pitch: 0,
        // 基本交互功能
        keyboardEnable: false,
        jogEnable: false,
        scrollWheel: true,
        touchZoom: true,
        pinchToZoom: true,
        // Canvas优化配置
        canvas: true,
        willReadFrequently: true
      });

      // 只添加必要的控件 - 比例尺
      mapInstance.current.addControl(new window.AMap.Scale());

      // 等待地图完全加载后再添加其他元素
      mapInstance.current.on('complete', () => {
        console.log('地图加载完成');
        setMapLoaded(true);
        
        // 添加双击事件 - 返回全省视图
        mapInstance.current.on('dblclick', () => {
          // 返回全省视图
          mapInstance.current.setZoomAndCenter(AMAP_CONFIG.DEFAULT_ZOOM, AMAP_CONFIG.DEFAULT_CENTER, true);
        });
        
        // 移除不需要的图层选择器
        setTimeout(() => {
          const overlayLayers = mapRef.current.querySelectorAll('.amap-ctrl-overlay-layer');
          overlayLayers.forEach(layer => {
            layer.style.display = 'none';
          });
        }, 100);
        
        // 只添加湖北省边界
        addProvinceBoundary();
      });

      // 添加错误处理
      mapInstance.current.on('error', (error) => {
        console.error('地图加载错误:', error);
        setMapError(true);
      });

    } catch (error) {
      console.error('地图初始化失败:', error);
      setMapError(true);
    }
  }, []);

  // 使用高德行政区划服务获取湖北省边界
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const addProvinceBoundary = React.useCallback(() => {
    try {
      // 创建行政区划搜索服务
      const districtSearch = new window.AMap.DistrictSearch({
        level: 'province',       // 查询省级
        subdistrict: 0,          // 不获取下级区域
        showbiz: false,          // 不显示业务信息
        extensions: 'all'        // 获取完整边界信息
      });

      // 搜索湖北省
      console.log('开始搜索湖北省边界...');
      districtSearch.search('湖北省', (status, result) => {
        console.log('行政区划搜索结果:', status, result);
        if (status === 'complete' && result.districtList && result.districtList.length) {
          const hubei = result.districtList[0];
          console.log('湖北省信息:', hubei);
          const hubeiPath = hubei.districts[0].polyline;
          console.log('湖北省边界路径:', hubeiPath);
          
          // 绘制湖北省边界
          drawHubeiDistrict(hubeiPath);
        } else {
          console.warn('获取湖北省边界失败，使用备用方案');
          console.log('失败详情:', result);
          drawHubeiDistrictFallback();
        }
      });
      
    } catch (error) {
      console.warn('行政区划服务初始化失败:', error);
      drawHubeiDistrictFallback();
    }
  }, []);

  // 绘制湖北省边界
  const drawHubeiDistrict = (paths) => {
    try {
      // 创建外层遮罩（覆盖整个地图）- 使用更明显的蓝色遮罩
      const outerMask = [
        [70, 15], [140, 15], [140, 55], [70, 55], [70, 15]
      ];

      // 使用多边形孔洞：外层矩形 + 内层湖北省边界
      const maskPolygon = new window.AMap.Polygon({
        path: [outerMask, paths], // 外层遮罩 + 内层孔洞
        strokeColor: 'transparent',
        fillColor: '#1e3a8a', // 更改为深蓝色
        fillOpacity: 0.85,    // 增加透明度，使遮罩更明显
        zIndex: 1
      });

      // 添加湖北省区域高亮 - 使用更亮的蓝色
      const provinceHighlight = new window.AMap.Polygon({
        path: paths,
        strokeColor: '#3b82f6',
        strokeWeight: 4,
        strokeOpacity: 1,
        fillColor: '#1e40af',
        fillOpacity: 0.4,     // 增加湖北省内部填充的透明度
        zIndex: 15,
        strokeStyle: 'solid'
      });

      // 添加湖北省边界线条
      const boundary = new window.AMap.Polygon({
        path: paths,
        strokeColor: '#60a5fa',
        strokeWeight: 3,
        strokeOpacity: 1,
        fillColor: 'transparent',
        zIndex: 20,
        strokeStyle: 'solid'
      });

      // 添加湖北省内部填充 - 使用更亮的蓝色
      const fill = new window.AMap.Polygon({
        path: paths,
        strokeColor: 'transparent',
        fillColor: '#3b82f6',
        fillOpacity: 0.25,    // 增加内部填充的透明度
        zIndex: 10
      });

      // 添加湖北省标签
      const label = new window.AMap.Text({
        text: '湖北省',
        position: [112.5, 31.5],
        style: {
          'background-color': 'rgba(30, 64, 175, 0.95)',
          'border-radius': '20px',
          'color': '#ffffff',
          'font-size': '18px',
          'font-weight': 'bold',
          'padding': '8px 16px',
          'border': '2px solid #60a5fa',
          'box-shadow': '0 4px 12px rgba(59, 130, 246, 0.4)'
        },
        offset: new window.AMap.Pixel(-35, -12)
      });

      // 按顺序添加图层
      mapInstance.current.add(maskPolygon);
      mapInstance.current.add(fill);
      mapInstance.current.add(provinceHighlight);
      mapInstance.current.add(boundary);
      mapInstance.current.add(label);

      // 自动缩放到湖北省范围
      mapInstance.current.setBounds(boundary.getBounds());
      
    } catch (error) {
      console.warn('绘制湖北省边界失败:', error);
    }
  };

  // 备用方案：使用手动绘制的边界
  const drawHubeiDistrictFallback = () => {
    try {
      const hubeiBoundary = HUBEI_BOUNDARY.coordinates;
      const styles = HUBEI_BOUNDARY.styles;
      
      // 添加深色背景覆盖全国底图
      const backgroundMask = new window.AMap.Polygon({
        path: styles.backgroundMask.path,
        strokeColor: styles.backgroundMask.strokeColor,
        fillColor: styles.backgroundMask.fillColor,
        fillOpacity: styles.backgroundMask.fillOpacity,
        zIndex: styles.backgroundMask.zIndex
      });
      
      // 添加湖北省区域高亮
      const provinceHighlight = new window.AMap.Polygon({
        path: hubeiBoundary,
        strokeColor: styles.provinceHighlight.strokeColor,
        strokeWeight: styles.provinceHighlight.strokeWeight,
        strokeOpacity: styles.provinceHighlight.strokeOpacity,
        fillColor: styles.provinceHighlight.fillColor,
        fillOpacity: styles.provinceHighlight.fillOpacity,
        zIndex: styles.provinceHighlight.zIndex,
        strokeStyle: styles.provinceHighlight.strokeStyle
      });
      
      // 添加湖北省边界线条
      const boundary = new window.AMap.Polygon({
        path: hubeiBoundary,
        strokeColor: styles.boundary.strokeColor,
        strokeWeight: styles.boundary.strokeWeight,
        strokeOpacity: styles.boundary.strokeOpacity,
        fillColor: styles.boundary.fillColor,
        zIndex: styles.boundary.zIndex,
        strokeStyle: styles.boundary.strokeStyle
      });
      
      // 添加湖北省内部填充
      const fill = new window.AMap.Polygon({
        path: hubeiBoundary,
        strokeColor: styles.fill.strokeColor,
        fillColor: styles.fill.fillColor,
        fillOpacity: styles.fill.fillOpacity,
        zIndex: styles.fill.zIndex
      });
      
      // 添加湖北省标签
      const label = new window.AMap.Text({
        text: styles.label.text,
        position: styles.label.position,
        style: styles.label.style,
        offset: new window.AMap.Pixel(styles.label.offset[0], styles.label.offset[1])
      });
      
      // 按顺序添加图层
      mapInstance.current.add(backgroundMask);
      mapInstance.current.add(fill);
      mapInstance.current.add(provinceHighlight);
      mapInstance.current.add(boundary);
      mapInstance.current.add(label);
      
      // 设置地图视野到湖北省
      mapInstance.current.setFitView([provinceHighlight]);
      
    } catch (error) {
      console.warn('备用方案绘制失败:', error);
    }
  };

  // 城市标记功能已移除，只保留湖北省边界

  // 连接线功能已移除，只保留湖北省边界
  


  // 键盘事件监听已移除，简化地图功能

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // 检查API密钥
    if (!isAMapApiKeyValid()) {
      setMapError(true);
      return;
    }

    // 防抖：避免重复初始化
    let initTimeout;
    
    // 性能监控
    const startTime = performance.now();

    // 动态加载高德地图SDK
    const loadAMap = () => {
      if (window.AMap) {
        initTimeout = setTimeout(initMap, 100);
        return;
      }

      const script = document.createElement('script');
      const apiKey = getAMapApiKey();
      
      // 添加安全配置和Canvas优化参数
      const scriptUrl = new URL('https://webapi.amap.com/maps');
      scriptUrl.searchParams.set('v', '2.0');
      scriptUrl.searchParams.set('key', apiKey);
      scriptUrl.searchParams.set('plugin', AMAP_CONFIG.PLUGINS.join(','));
      
      // 添加Canvas优化参数
      scriptUrl.searchParams.set('canvas', 'true');
      scriptUrl.searchParams.set('willReadFrequently', 'true');
      
      script.src = scriptUrl.toString();
      script.async = true;
      script.onload = () => {
        const loadTime = performance.now() - startTime;
        console.log(`高德地图SDK加载完成，耗时: ${loadTime.toFixed(2)}ms`);
        console.log('加载的插件:', AMAP_CONFIG.PLUGINS);
        console.log('AMap对象:', window.AMap);
        console.log('DistrictSearch插件:', window.AMap.DistrictSearch);
        initTimeout = setTimeout(initMap, 100);
      };
      script.onerror = (error) => {
        console.error('高德地图SDK加载失败:', error);
        setMapError(true);
        
        // 尝试重试加载
        if (window.retryCount < (AMAP_CONFIG.MAX_RETRY_COUNT || 3)) {
          window.retryCount = (window.retryCount || 0) + 1;
          console.log(`重试加载高德地图SDK (${window.retryCount}/${AMAP_CONFIG.MAX_RETRY_COUNT})`);
          setTimeout(loadAMap, AMAP_CONFIG.RETRY_DELAY || 2000);
        }
      };
      document.head.appendChild(script);
    };

    // 启动加载
    loadAMap();

    // 清理函数
    return () => {
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
      
      // 清理地图实例
      if (mapInstance.current) {
        try {
          mapInstance.current.destroy();
          mapInstance.current = null;
        } catch (error) {
          console.warn('地图清理时出现警告:', error);
        }
      }
    };
  }, []); // 移除依赖项，避免重复执行

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* 地图容器 */}
      <div 
        ref={mapRef} 
        className="amap-container"
        style={{ 
          height: '100%', 
          width: '100%',
          minHeight: '400px',
          position: 'relative',
          zIndex: 1,
          cursor: 'grab',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.1)'
        }}
      />
      

      
      {/* 添加CSS样式来隐藏不需要的图层选择器 */}
      <style jsx="true">{`        .amap-container .amap-ctrl-overlay-layer {
          display: none !important;
        }
        .amap-container .amap-ui-ctrl-layer-overlay-item {
          display: none !important;
        }
        
        /* 美化地图控件 */
        .amap-container .amap-scale {
          background: rgba(59, 130, 246, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
          color: white !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }
        
        .amap-container .amap-toolbar {
          background: rgba(59, 130, 246, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }
        
        .amap-container .amap-toolbar button {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
          color: white !important;
          transition: all 0.3s ease !important;
        }
        
        .amap-container .amap-toolbar button:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.05) !important;
        }
        
        /* 美化地图类型切换器 */
        .amap-container .amap-maptype {
          background: rgba(59, 130, 246, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }
        
        .amap-container .amap-maptype button {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
          color: white !important;
          transition: all 0.3s ease !important;
        }
        
        .amap-container .amap-maptype button:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.05) !important;
        }
      `}</style>
      
      {/* 地图加载状态 - 只在真正加载时显示 */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/90 via-blue-800/90 to-blue-900/90 backdrop-blur-md">
          <div className="text-center relative">
            {/* 背景光晕 */}
            <div className="absolute inset-0 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
            
            {/* 加载动画 */}
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-6"></div>
              <div className="text-blue-200 text-xl font-semibold mb-2">地图加载中</div>
              <div className="text-blue-300 text-sm mb-4">正在初始化湖北省地图...</div>
              
              {/* 进度条 */}
              <div className="w-48 h-2 bg-blue-900/50 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-300 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 地图错误状态 */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900/90 via-red-800/90 to-red-900/90 backdrop-blur-md">
          <div className="text-center relative">
            {/* 背景光晕 */}
            <div className="absolute inset-0 w-24 h-24 bg-red-400/20 rounded-full blur-xl animate-pulse"></div>
            
            <div className="relative">
              <div className="w-20 h-20 bg-red-500/80 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-400/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="text-red-200 text-xl font-semibold mb-2">地图加载失败</div>
              <div className="text-red-300 text-sm mb-4">请检查高德地图API密钥配置</div>
              
              {/* 重试按钮 */}
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-all duration-300 hover:scale-105 border border-red-400/30"
              >
                重新加载
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 简化提示信息 */}
      {mapLoaded && (
        <div className="absolute bottom-4 left-4 bg-blue-600/80 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg border border-blue-400/30">
          双击地图返回全省视图
        </div>
      )}
    </div>
  );
};

export default AMapComponent;

