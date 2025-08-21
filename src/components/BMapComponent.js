/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { BMAP_CONFIG, getBMapApiKey, isBMapApiKeyValid, BMAP_SDK_CONFIG } from '../config/bmap';

const BMapComponent = forwardRef(({ realData, onCityClick }, ref) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  let initTimeout = null;

  // 暴露地图实例给父组件
  useImperativeHandle(ref, () => ({
    mapInstance,
    mapRef,
    isLoaded: mapLoaded
  }), [mapLoaded]);



  // 地图初始化函数
  const initMap = React.useCallback(() => {
    if (!mapRef.current || mapInstance.current || !window.BMapGL) return;

    try {
      console.log('开始初始化百度地图...');
      
      // 创建地图实例
      mapInstance.current = new window.BMapGL.Map(mapRef.current, {
        enableMapClick: false // 禁用地图点击
      });

      // 设置地图中心点和缩放级别
      const point = new window.BMapGL.Point(BMAP_CONFIG.DEFAULT_CENTER[0], BMAP_CONFIG.DEFAULT_CENTER[1]);
      mapInstance.current.centerAndZoom(point, BMAP_CONFIG.DEFAULT_ZOOM);

      // 设置地图样式 - 应用深色主题
      try {
        // 应用自定义样式JSON配置
        const styleJson = [
          {
            "featureType": "land",
            "elementType": "geometry",
            "stylers": {
              "color": "#033447",
              "visibility": "on"
            }
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": {
              "visibility": "on",
              "color": "#081018"
            }
          },
          {
            "featureType": "road",
            "elementType": "all",
            "stylers": {
              "visibility": "off"
            }
          },
          {
            "featureType": "highway",
            "elementType": "all",
            "stylers": {
              "visibility": "off"
            }
          },
          {
            "featureType": "arterial",
            "elementType": "all",
            "stylers": {
              "visibility": "off"
            }
          },
          {
            "featureType": "local",
            "elementType": "all",
            "stylers": {
              "visibility": "off"
            }
          }
        ];
        
        // 使用setMapStyleV2方法应用样式ID和自定义JSON
        if (mapInstance.current.setMapStyleV2) {
          mapInstance.current.setMapStyleV2({
            styleId: 'f8c979e95b57f2fd802f768009689f34',
            styleJson: styleJson
          });
          console.log('百度地图样式应用完成');
        } else {
          console.warn('setMapStyleV2方法不可用');
        }
      } catch (error) {
        console.warn('地图样式设置失败:', error);
      }

      // 配置交互选项
      if (BMAP_CONFIG.INTERACTION.enableScrollWheelZoom) {
        mapInstance.current.enableScrollWheelZoom();
      }
      if (BMAP_CONFIG.INTERACTION.enableDoubleClickZoom) {
        mapInstance.current.enableDoubleClickZoom();
      }
      if (BMAP_CONFIG.INTERACTION.enableKeyboard) {
        mapInstance.current.enableKeyboard();
      }
      if (BMAP_CONFIG.INTERACTION.enableInertialDragging) {
        mapInstance.current.enableInertialDragging();
      }
      if (BMAP_CONFIG.INTERACTION.enableContinuousZoom) {
        mapInstance.current.enableContinuousZoom();
      }
      if (BMAP_CONFIG.INTERACTION.enablePinchToZoom) {
        mapInstance.current.enablePinchToZoom();
      }
      if (BMAP_CONFIG.INTERACTION.enableAutoResize) {
        mapInstance.current.enableAutoResize();
      }

      // 设置缩放范围
      mapInstance.current.setMinZoom(BMAP_CONFIG.MIN_ZOOM);
      mapInstance.current.setMaxZoom(BMAP_CONFIG.MAX_ZOOM);

      // 添加控件
      if (BMAP_CONFIG.CONTROLS.scale) {
        const scaleCtrl = new window.BMapGL.ScaleControl();
        mapInstance.current.addControl(scaleCtrl);
      }
      if (BMAP_CONFIG.CONTROLS.navigation) {
        const navCtrl = new window.BMapGL.NavigationControl();
        mapInstance.current.addControl(navCtrl);
      }

      // 添加双击事件 - 返回全省视图
      mapInstance.current.addEventListener('dblclick', () => {
        const point = new window.BMapGL.Point(BMAP_CONFIG.DEFAULT_CENTER[0], BMAP_CONFIG.DEFAULT_CENTER[1]);
        mapInstance.current.centerAndZoom(point, BMAP_CONFIG.DEFAULT_ZOOM);
      });

      // 地图加载完成事件
      mapInstance.current.addEventListener('tilesloaded', () => {
        console.log('百度地图加载完成');
        
        // 延迟设置加载状态，确保地图完全准备就绪
        setTimeout(() => {
          setMapLoaded(true);
          setLoadingProgress(100);
          
          // 添加湖北省边界
          addHubeiBoundary();
        }, 1000);
      });

      console.log('百度地图初始化完成');

    } catch (error) {
      console.error('百度地图初始化失败:', error);
      setMapError(true);
    }
  }, []);

  // 添加湖北省边界轮廓
  const addHubeiBoundary = React.useCallback(() => {
    if (!mapInstance.current || !window.BMapGL) {
      console.warn('地图实例或百度地图API不可用，跳过边界添加');
      return;
    }

    // 验证地图实例方法是否可用
    if (typeof mapInstance.current.addOverlay !== 'function') {
      console.warn('地图实例addOverlay方法不可用，跳过边界添加');
      return;
    }

    try {
      const bdary = new window.BMapGL.Boundary();
      bdary.get('湖北省', function(rs) {
        if (rs.boundaries && rs.boundaries.length > 0) {
          const boundary = rs.boundaries[0];
          const points = [];
          const coords = boundary.split(';');
          
          for (let i = 0; i < coords.length; i++) {
            const coord = coords[i].split(',');
            if (coord.length === 2) {
              points.push(new window.BMapGL.Point(parseFloat(coord[0]), parseFloat(coord[1])));
            }
          }
          
          if (points.length > 0) {
            // 再次验证地图实例
            if (!mapInstance.current || typeof mapInstance.current.addOverlay !== 'function') {
              console.warn('地图实例在添加边界时变为无效');
              return;
            }

            const polygon = new window.BMapGL.Polygon(points, {
              strokeColor: '#2563EB',
              strokeWeight: 3,
              strokeOpacity: 0.9,
              fillColor: '#3B82F6',
              fillOpacity: 0.15
            });
            
            try {
              mapInstance.current.addOverlay(polygon);
              console.log('湖北省边界轮廓添加成功');
              
              // 自动调整视野到湖北省范围
              if (typeof mapInstance.current.getViewport === 'function') {
                const viewport = mapInstance.current.getViewport(points);
                mapInstance.current.centerAndZoom(viewport.center, viewport.zoom - 0.6);
              }
            } catch (error) {
              console.error('添加湖北省边界失败:', error);
            }
          }
        }
      });
    } catch (error) {
      console.error('创建湖北省边界失败:', error);
    }
  }, []);

  // 动态加载百度地图SDK
  const loadBMapSDK = () => {
    if (window.BMapGL) {
      initTimeout = setTimeout(initMap, 100);
      return;
    }

    const script = document.createElement('script');
    const apiKey = getBMapApiKey();
    
    // 构建百度地图SDK URL
    const scriptUrl = `https://api.map.baidu.com/api?type=webgl&v=${BMAP_SDK_CONFIG.version}&ak=${apiKey}&callback=${BMAP_SDK_CONFIG.callback}`;
    
    script.src = scriptUrl;
    script.async = true;
    
    // 全局回调函数
    window[BMAP_SDK_CONFIG.callback] = () => {
      console.log('百度地图SDK加载完成');
      setLoadingProgress(80);
      initTimeout = setTimeout(initMap, 100);
    };
    
    script.onerror = () => {
      console.error('百度地图SDK加载失败');
      setMapError(true);
    };
    
    document.head.appendChild(script);
    
    // 模拟加载进度
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 70) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 200);
  };

  // 组件挂载时加载地图
  useEffect(() => {
    // 检查API密钥
    if (!isBMapApiKeyValid()) {
      console.error('百度地图API密钥无效');
      setMapError(true);
      return;
    }

    setLoadingProgress(10);
    loadBMapSDK();

    // 清理函数
    return () => {
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
      if (mapInstance.current) {
        mapInstance.current = null;
      }
      // 清理全局回调
      if (window[BMAP_SDK_CONFIG.callback]) {
        delete window[BMAP_SDK_CONFIG.callback];
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl border border-blue-200/30 shadow-2xl">
      {/* 地图容器 */}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* 加载状态 */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/90 via-blue-800/90 to-blue-900/90 backdrop-blur-md">
          <div className="text-center relative">
            {/* 背景光晕 */}
            <div className="absolute inset-0 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
            
            <div className="relative">
              <div className="w-20 h-20 bg-blue-500/80 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-400/30">
                <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="text-blue-200 text-xl font-semibold mb-2">正在加载湖北省地图</div>
              <div className="text-blue-300 text-sm mb-4">湖北·四清单两名录可视化系统</div>
              
              {/* 进度条 */}
              <div className="w-64 bg-blue-800/50 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-blue-300 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <div className="text-blue-400 text-xs">{Math.round(loadingProgress)}%</div>
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
              <div className="text-red-300 text-sm mb-4">请检查百度地图API密钥配置</div>
              <button 
                onClick={() => {
                  setMapError(false);
                  setMapLoaded(false);
                  setLoadingProgress(0);
                  loadBMapSDK();
                }}
                className="px-6 py-2 bg-red-600/80 hover:bg-red-500/80 text-white rounded-lg transition-colors duration-200 border border-red-400/30"
              >
                重新加载
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 地图加载完成后的操作提示 */}
      {mapLoaded && (
        <div className="absolute top-4 right-4 bg-blue-900/80 backdrop-blur-sm text-blue-200 px-4 py-2 rounded-lg text-sm border border-blue-400/30">
          双击返回全省视图
        </div>
      )}
    </div>
  );
});

export default BMapComponent;