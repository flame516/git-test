import React, { useEffect, useRef, useState } from 'react';
import { AMAP_CONFIG, getAMapApiKey } from '../config/amap';

const SimpleMapTest = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    // 检查API密钥
    if (!getAMapApiKey()) {
      setMapError(true);
      return;
    }

    // 动态加载高德地图SDK
    const loadAMap = () => {
      if (window.AMap) {
        setTimeout(initMap, 100);
        return;
      }

      const script = document.createElement('script');
      const apiKey = getAMapApiKey();
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${apiKey}&plugin=AMap.Scale,AMap.DistrictSearch`;
      script.async = true;
      
      script.onload = () => {
        console.log('高德地图SDK加载完成');
        console.log('AMap对象:', window.AMap);
        console.log('DistrictSearch插件:', window.AMap.DistrictSearch);
        setTimeout(initMap, 100);
      };
      
      script.onerror = () => {
        console.error('高德地图SDK加载失败');
        setMapError(true);
      };
      
      document.head.appendChild(script);
    };

    loadAMap();

    return () => {
      if (mapInstance.current) {
        try {
          mapInstance.current.destroy();
          mapInstance.current = null;
        } catch (error) {
          console.warn('地图清理时出现警告:', error);
        }
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current || mapInstance.current) return;

    try {
      console.log('开始初始化地图...');
      
      // 创建地图实例
      mapInstance.current = new window.AMap.Map(mapRef.current, {
        zoom: 7,
        center: [112.5, 31.5],
        mapStyle: 'amap://styles/blue',
        features: ['bg', 'point', 'text']
      });

      console.log('地图实例创建成功:', mapInstance.current);

      // 添加比例尺
      mapInstance.current.addControl(new window.AMap.Scale());

      // 等待地图加载完成
      mapInstance.current.on('complete', () => {
        console.log('地图加载完成');
        setMapLoaded(true);
        
        // 测试行政区划服务
        testDistrictSearch();
      });

    } catch (error) {
      console.error('地图初始化失败:', error);
      setMapError(true);
    }
  };

  const testDistrictSearch = () => {
    try {
      console.log('开始测试行政区划服务...');
      
      if (!window.AMap.DistrictSearch) {
        console.error('DistrictSearch插件未加载');
        return;
      }

      const districtSearch = new window.AMap.DistrictSearch({
        level: 'province',
        subdistrict: 0,
        showbiz: false,
        extensions: 'all'
      });

      console.log('DistrictSearch实例创建成功:', districtSearch);

      districtSearch.search('湖北省', (status, result) => {
        console.log('搜索结果状态:', status);
        console.log('搜索结果:', result);
        
        if (status === 'complete' && result.districtList && result.districtList.length) {
          const hubei = result.districtList[0];
          console.log('湖北省信息:', hubei);
          
          if (hubei.districts && hubei.districts.length > 0) {
            const hubeiPath = hubei.districts[0].polyline;
            console.log('湖北省边界路径:', hubeiPath);
            
            // 绘制湖北省边界
            drawHubeiBoundary(hubeiPath);
          } else {
            console.warn('未找到湖北省下级区域信息');
          }
        } else {
          console.warn('获取湖北省边界失败');
          console.log('失败详情:', result);
        }
      });
      
    } catch (error) {
      console.error('测试行政区划服务失败:', error);
    }
  };

  const drawHubeiBoundary = (paths) => {
    try {
      console.log('开始绘制湖北省边界...');
      
      // 创建外层遮罩
      const outerMask = [
        [70, 15], [140, 15], [140, 55], [70, 55], [70, 15]
      ];

      // 使用多边形孔洞技术
      const maskPolygon = new window.AMap.Polygon({
        path: [outerMask, paths],
        strokeColor: 'transparent',
        fillColor: '#0f172a',
        fillOpacity: 0.8,
        zIndex: 1
      });

      // 添加湖北省区域高亮
      const provinceHighlight = new window.AMap.Polygon({
        path: paths,
        strokeColor: '#3b82f6',
        strokeWeight: 4,
        strokeOpacity: 1,
        fillColor: '#1e40af',
        fillOpacity: 0.3,
        zIndex: 15
      });

      // 添加湖北省边界线条
      const boundary = new window.AMap.Polygon({
        path: paths,
        strokeColor: '#60a5fa',
        strokeWeight: 3,
        strokeOpacity: 1,
        fillColor: 'transparent',
        zIndex: 20
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
          'border': '2px solid #60a5fa'
        },
        offset: new window.AMap.Pixel(-35, -12)
      });

      // 按顺序添加图层
      mapInstance.current.add(maskPolygon);
      mapInstance.current.add(provinceHighlight);
      mapInstance.current.add(boundary);
      mapInstance.current.add(label);

      // 自动缩放到湖北省范围
      mapInstance.current.setBounds(boundary.getBounds());
      
      console.log('湖北省边界绘制完成');
      
    } catch (error) {
      console.error('绘制湖北省边界失败:', error);
    }
  };

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
      
      {/* 地图加载状态 */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/90 via-blue-800/90 to-blue-900/90 backdrop-blur-md">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="text-blue-200 text-xl font-semibold mb-2">地图加载中</div>
            <div className="text-blue-300 text-sm">正在初始化湖北省地图...</div>
          </div>
        </div>
      )}
      
      {/* 地图错误状态 */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900/90 via-red-800/90 to-red-900/90 backdrop-blur-md">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500/80 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="text-red-200 text-xl font-semibold mb-2">地图加载失败</div>
            <div className="text-red-300 text-sm mb-4">请检查高德地图API密钥配置</div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-all duration-300"
            >
              重新加载
            </button>
          </div>
        </div>
      )}
      
      {/* 调试信息 */}
      <div className="absolute top-4 left-4 bg-black/80 text-white text-xs p-2 rounded">
        <div>地图状态: {mapLoaded ? '已加载' : mapError ? '错误' : '加载中'}</div>
        <div>AMap: {window.AMap ? '已加载' : '未加载'}</div>
        <div>DistrictSearch: {window.AMap?.DistrictSearch ? '已加载' : '未加载'}</div>
      </div>
    </div>
  );
};

export default SimpleMapTest;
