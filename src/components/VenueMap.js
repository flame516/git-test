import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Building2, Users, Phone, X, Info, DollarSign, Search } from 'lucide-react';
import { venueData, venueStats } from '../data/venueData';
import BMapComponent from './BMapComponent';

const VenueMap = () => {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [hoveredVenue, setHoveredVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('全部');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  // 获取所有城市和类别
  const cities = ['全部', ...Array.from(new Set(venueData.map(venue => venue.city)))];
  const categories = ['全部', ...Array.from(new Set(venueData.map(venue => venue.category)))];

  // 过滤后的场地数据
  const filteredVenues = venueData.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === '全部' || venue.city === selectedCity;
    const matchesCategory = selectedCategory === '全部' || venue.category === selectedCategory;
    return matchesSearch && matchesCity && matchesCategory;
  });

  // 添加场地标记
  const addVenueMarkers = useCallback((map) => {
    if (!map || !window.BMapGL) {
      console.error('地图实例或百度地图API不可用');
      return;
    }

    // 清除之前的标记
    markersRef.current.forEach(marker => {
      try {
        if (map && typeof map.removeOverlay === 'function') {
          map.removeOverlay(marker);
        }
      } catch (error) {
        console.warn('移除标记失败:', error);
      }
    });
    markersRef.current = [];

    let successCount = 0;
    filteredVenues.forEach((venue, index) => {
      try {
        // 验证地图实例
        if (!map || typeof map.addOverlay !== 'function') {
          console.error('地图实例在添加标记时变为无效');
          return;
        }

        // 创建坐标点
        const point = new window.BMapGL.Point(venue.coordinates[0], venue.coordinates[1]);
        
        // 创建自定义标记图标
        const icon = new window.BMapGL.Icon(
          'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 40 16 40S32 24.837 32 16C32 7.163 24.837 0 16 0Z" fill="#3B82F6"/>
              <circle cx="16" cy="16" r="8" fill="white"/>
              <text x="16" y="20" text-anchor="middle" fill="#3B82F6" font-size="10" font-weight="bold">${index + 1}</text>
            </svg>
          `),
          new window.BMapGL.Size(32, 40),
          {
            anchor: new window.BMapGL.Size(16, 40)
          }
        );

        const marker = new window.BMapGL.Marker(point, { icon });
        
        // 添加标记到地图
        if (map && typeof map.addOverlay === 'function') {
          map.addOverlay(marker);
          successCount++;
          
          // 鼠标悬停事件
          marker.addEventListener('mouseover', () => {
            setHoveredVenue(venue);
          });

          marker.addEventListener('mouseout', () => {
            setHoveredVenue(null);
          });

          // 点击事件
          marker.addEventListener('click', () => {
            setSelectedVenue(venue);
          });

          markersRef.current.push(marker);
        }
      } catch (error) {
        console.error(`添加第${index + 1}个标记失败:`, error, venue.name);
      }
    });

    console.log(`成功添加 ${successCount}/${filteredVenues.length} 个场地标记`);
    
    // 如果成功添加了标记，设置地图为就绪状态
    if (successCount > 0) {
      setMapReady(true);
      setIsLoading(false);
    }
  }, [filteredVenues]);

  // 地图加载完成后的回调
  const handleMapLoaded = useCallback((mapInstance) => {
    console.log('地图加载完成，开始添加场地标记');
    if (!mapInstance || !window.BMapGL) {
      console.error('地图实例或百度地图API不可用');
      return;
    }
    
    // 验证地图实例的方法是否可用
    if (typeof mapInstance.addOverlay !== 'function') {
      console.error('地图实例addOverlay方法不可用');
      return;
    }
    
    // 延迟添加标记，确保地图完全准备就绪
    setTimeout(() => {
      addVenueMarkers(mapInstance);
    }, 1500);
  }, [addVenueMarkers]);

  // 获取地图实例的引用
  const handleMapRef = useCallback((ref) => {
    mapRef.current = ref;
    if (ref) {
      // 设置超时机制，防止无限等待
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          console.error('地图加载超时，设置错误状态');
          setIsLoading(false);
          // 显示错误提示
          alert('地图加载超时，请刷新页面重试');
        }
      }, 30000); // 30秒超时

      // 监听地图实例变化
      const checkMapInstance = () => {
        if (ref.mapInstance && ref.mapInstance.current && ref.isLoaded) {
          console.log('地图实例已准备就绪');
          clearTimeout(timeoutId); // 清除超时
          mapInstance.current = ref.mapInstance.current;
          
          // 验证地图实例是否有效
          if (mapInstance.current && typeof mapInstance.current.addOverlay === 'function') {
            console.log('地图实例验证通过，开始初始化');
            handleMapLoaded(mapInstance.current);
          } else {
            console.warn('地图实例方法不可用，继续等待...');
            setTimeout(checkMapInstance, 500);
          }
        } else {
          // 地图实例还未创建，继续等待
          console.log('等待地图实例创建...');
          setTimeout(checkMapInstance, 500);
        }
      };
      
      // 延迟开始检查，给BMapComponent更多时间初始化
      setTimeout(checkMapInstance, 1000);
    }
  }, [handleMapLoaded, isLoading]);

  // 当过滤条件改变时重新添加标记
  useEffect(() => {
    if (mapInstance.current && mapReady) {
      addVenueMarkers(mapInstance.current);
    }
  }, [searchTerm, selectedCity, selectedCategory, addVenueMarkers, mapReady]);

  // 添加备用显示方案
  const [showFallback, setShowFallback] = useState(false);

  // 如果地图加载失败，显示备用方案
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        setShowFallback(true);
      }
    }, 15000); // 15秒后显示备用方案

    return () => clearTimeout(fallbackTimer);
  }, [isLoading]);

  // 清理函数
  useEffect(() => {
    return () => {
      // 清理标记
      if (mapInstance.current && markersRef.current.length > 0) {
        try {
          markersRef.current.forEach(marker => {
            if (mapInstance.current && typeof mapInstance.current.removeOverlay === 'function') {
              mapInstance.current.removeOverlay(marker);
            }
          });
        } catch (error) {
          console.warn('清理标记时出现错误:', error);
        }
        markersRef.current = [];
      }
    };
  }, []);

  const formatArea = (area) => {
    if (area >= 10000) {
      return `${(area / 10000).toFixed(1)}万平方米`;
    }
    return `${area.toLocaleString()}平方米`;
  };

  const formatContact = (contact) => {
    const phoneMatch = contact.match(/(\d{11})/);
    const nameMatch = contact.replace(/(\d{11})/, '').trim();
    return {
      name: nameMatch || '联系人',
      phone: phoneMatch ? phoneMatch[1] : contact
    };
  };

  // 备用显示方案 - 场地列表
  if (showFallback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
        <div className="container mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">
              湖北省创业场地分布图
            </h1>
            <p className="text-blue-600 text-lg mb-4">
              共有 {venueData.length} 个创业场地为您提供服务
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-yellow-800">
                <strong>提示：</strong>地图加载较慢，已为您显示场地列表。您可以继续使用搜索和筛选功能。
              </p>
            </div>
          </div>

          {/* 搜索和筛选工具栏 */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-200/30 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 搜索框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索场地名称或地址..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* 城市筛选 */}
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* 类别筛选 */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* 结果统计 */}
              <div className="flex items-center justify-center px-4 py-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-blue-700 font-semibold">
                  找到 {filteredVenues.length} 个场地
                </span>
              </div>
            </div>
          </div>

          {/* 场地列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue, index) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-blue-200/30 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedVenue(venue)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-2 text-lg">{venue.name}</h3>
                    <p className="text-slate-600 mb-2">{venue.city} · {venue.district}</p>
                    <div className="space-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{venue.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>总面积 {formatArea(venue.totalArea)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{formatContact(venue.contact).name}</span>
                      </div>
                    </div>
                    <p className="text-xs text-blue-600 mt-3">点击查看详细信息</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 重新尝试加载地图 */}
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setShowFallback(false);
                setIsLoading(true);
                setMapReady(false);
                window.location.reload();
              }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              重新尝试加载地图
            </button>
          </div>
        </div>

        {/* 详情弹窗 */}
        <AnimatePresence>
          {selectedVenue && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedVenue(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 弹窗头部 */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Building2 className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{selectedVenue.name}</h2>
                        <div className="flex items-center gap-4 text-blue-100">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {selectedVenue.city} · {selectedVenue.district}
                          </span>
                          <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                            {selectedVenue.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedVenue(null)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* 弹窗内容 */}
                <div className="p-6 space-y-6">
                  {/* 基本信息 */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                        <Info className="w-5 h-5 text-blue-600" />
                        基本信息
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">详细地址</span>
                          <span className="text-slate-800 font-medium text-right flex-1 ml-4">{selectedVenue.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">总面积</span>
                          <span className="text-slate-800 font-medium">{formatArea(selectedVenue.totalArea)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">可用面积</span>
                          <span className="text-slate-800 font-medium">{formatArea(selectedVenue.availableArea)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                        <Phone className="w-5 h-5 text-blue-600" />
                        联系方式
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        {(() => {
                          const contact = formatContact(selectedVenue.contact);
                          return (
                            <>
                              <div className="flex justify-between">
                                <span className="text-slate-600">联系人</span>
                                <span className="text-slate-800 font-medium">{contact.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">联系电话</span>
                                <a href={`tel:${contact.phone}`} className="text-blue-600 font-medium hover:text-blue-700">
                                  {contact.phone}
                                </a>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* 设施设备 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      设施设备情况
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-slate-700 leading-relaxed">{selectedVenue.facilities}</p>
                    </div>
                  </div>

                  {/* 政策服务 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      政策服务情况
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-slate-700 leading-relaxed">{selectedVenue.policies}</p>
                    </div>
                  </div>
                </div>

                {/* 弹窗底部 */}
                <div className="bg-slate-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedVenue(null)}
                    className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                  >
                    关闭
                  </button>
                  <a
                    href={`tel:${formatContact(selectedVenue.contact).phone}`}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    联系咨询
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 加载状态显示
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center z-50">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 opacity-20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-white mb-2">正在加载创业场地地图</h2>
            <p className="text-blue-200 text-lg">湖北·四清单两名录可视化系统</p>
            
            <div className="w-80 mx-auto mt-8">
              <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              </div>
              <p className="text-blue-300 text-sm mt-2">正在加载地图数据...</p>
            </div>

            {/* 重试按钮 */}
            <div className="mt-8">
              <button
                onClick={() => {
                  setIsLoading(false);
                  setMapReady(false);
                  // 重新加载页面
                  window.location.reload();
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 border border-blue-400/30"
              >
                重新加载
              </button>
            </div>

            {/* 故障排除提示 */}
            <div className="mt-6 text-sm text-blue-300 max-w-md mx-auto">
              <p className="mb-2">如果加载时间过长，请检查：</p>
              <ul className="text-left space-y-1">
                <li>• 网络连接是否正常</li>
                <li>• 浏览器是否支持WebGL</li>
                <li>• 是否启用了JavaScript</li>
                <li>• 百度地图服务是否可用</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            湖北省创业场地分布图
          </h1>
          <p className="text-blue-600 text-lg">
            共有 {venueData.length} 个创业场地为您提供服务
          </p>
        </div>

        {/* 搜索和筛选工具栏 */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200/30 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索场地名称或地址..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* 城市筛选 */}
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* 类别筛选 */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* 结果统计 */}
            <div className="flex items-center justify-center px-4 py-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-blue-700 font-semibold">
                找到 {filteredVenues.length} 个场地
              </span>
            </div>
          </div>
        </div>

        {/* 地图容器 */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-200/30">
          <div className="h-[600px] relative">
            {/* 使用BMapComponent */}
            <BMapComponent ref={handleMapRef} />
            
            {/* 统计信息面板 */}
            <motion.div 
              className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200/50 p-6 max-w-sm z-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                创业场地统计
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{venueStats.total}</div>
                  <div className="text-sm text-slate-600">总场地数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{venueStats.cities.length}</div>
                  <div className="text-sm text-slate-600">覆盖城市</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatArea(venueStats.totalArea)}</div>
                  <div className="text-sm text-slate-600">总面积</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{formatArea(venueStats.totalAvailableArea)}</div>
                  <div className="text-sm text-slate-600">可用面积</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 悬停信息卡片 */}
          <AnimatePresence>
            {hoveredVenue && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 max-w-sm border border-blue-100"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 mb-1">{hoveredVenue.name}</h4>
                    <p className="text-sm text-slate-600 mb-2">{hoveredVenue.city} · {hoveredVenue.district}</p>
                    <div className="space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3 h-3" />
                        <span>{hoveredVenue.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        <span>总面积 {formatArea(hoveredVenue.totalArea)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">点击查看详细信息</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 详情弹窗 */}
          <AnimatePresence>
            {selectedVenue && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => setSelectedVenue(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* 弹窗头部 */}
                  <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                          <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold mb-2">{selectedVenue.name}</h2>
                          <div className="flex items-center gap-4 text-blue-100">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {selectedVenue.city} · {selectedVenue.district}
                            </span>
                            <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                              {selectedVenue.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedVenue(null)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* 弹窗内容 */}
                  <div className="p-6 space-y-6">
                    {/* 基本信息 */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                          <Info className="w-5 h-5 text-blue-600" />
                          基本信息
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">详细地址</span>
                            <span className="text-slate-800 font-medium text-right flex-1 ml-4">{selectedVenue.address}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">总面积</span>
                            <span className="text-slate-800 font-medium">{formatArea(selectedVenue.totalArea)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">可用面积</span>
                            <span className="text-slate-800 font-medium">{formatArea(selectedVenue.availableArea)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                          <Phone className="w-5 h-5 text-blue-600" />
                          联系方式
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                          {(() => {
                            const contact = formatContact(selectedVenue.contact);
                            return (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">联系人</span>
                                  <span className="text-slate-800 font-medium">{contact.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">联系电话</span>
                                  <a href={`tel:${contact.phone}`} className="text-blue-600 font-medium hover:text-blue-700">
                                    {contact.phone}
                                  </a>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* 设施设备 */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        设施设备情况
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-slate-700 leading-relaxed">{selectedVenue.facilities}</p>
                      </div>
                    </div>

                    {/* 政策服务 */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        政策服务情况
                      </div>
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-slate-700 leading-relaxed">{selectedVenue.policies}</p>
                      </div>
                    </div>
                  </div>

                  {/* 弹窗底部 */}
                  <div className="bg-slate-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedVenue(null)}
                      className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                    >
                      关闭
                    </button>
                    <a
                      href={`tel:${formatContact(selectedVenue.contact).phone}`}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      联系咨询
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VenueMap;
