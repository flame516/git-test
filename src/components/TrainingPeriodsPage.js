import React, { useState, useEffect } from 'react';
import trainingData from '../data/training_data.json';
import { 
  Home, 
  Building2, 
  TrendingUp, 
  GraduationCap, 
  FileText, 
  UserCheck, 
  Briefcase 
} from 'lucide-react';

const TrainingPeriodsPage = ({ onBackToHome }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const itemsPerPage = 20;

  useEffect(() => {
    if (trainingData && trainingData.items) {
      // 过滤掉机构名称为 "nan" 的记录
      const filteredItems = trainingData.items.filter(item => 
        item.institution && 
        item.institution !== 'nan' && 
        item.institution.toLowerCase() !== 'nan'
      );
      setData(filteredItems);
      setFilteredData(filteredItems);
    }
  }, []);

  // 实时时间更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 格式化时间
  const formatTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return {
      date: `${year}年${month}月${day}日`,
      time: `${hours}:${minutes}:${seconds}`
    };
  };

  // 获取显示城市的函数 - 基于原始数据索引
  const getDisplayCity = (item, originalIndex) => {
    if (item.city && item.city.trim() !== '') {
      return item.city;
    }
    
    // 如果没有城市，查找前一个有城市的机构
    for (let i = originalIndex - 1; i >= 0; i--) {
      if (data[i] && data[i].city && data[i].city.trim() !== '') {
        return data[i].city;
      }
    }
    
    return '未指定';
  };

  // 获取显示地址的函数 - 基于原始数据索引
  const getDisplayAddress = (item, originalIndex) => {
    if (item.address && item.address.trim() !== '') {
      return item.address;
    }
    
    // 如果没有地址，查找前一个有地址的机构
    for (let i = originalIndex - 1; i >= 0; i--) {
      if (data[i] && data[i].address && data[i].address.trim() !== '') {
        return data[i].address;
      }
    }
    
    return '未指定';
  };

  useEffect(() => {
    let filtered = data;
    
    // 调试信息
    console.log('筛选前数据数量:', filtered.length);
    console.log('当前筛选条件:', { searchTerm, cityFilter, courseFilter });
    
    // 首先过滤掉机构名称为 "nan" 的记录
    filtered = filtered.filter(item => 
      item.institution && 
      item.institution !== 'nan' && 
      item.institution.toLowerCase() !== 'nan'
    );
    
    if (searchTerm) {
      filtered = filtered.filter((item, index) => {
        const displayCity = getDisplayCity(item, index);
        const displayAddress = getDisplayAddress(item, index);
        
        const matches = item.institution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               displayAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
               displayCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.courses?.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matches;
      });
      console.log('搜索筛选后数量:', filtered.length);
    }
    
    if (cityFilter) {
      filtered = filtered.filter((item, index) => {
        const displayCity = getDisplayCity(item, index);
        const matches = displayCity === cityFilter;
        if (matches) {
          console.log('城市匹配:', displayCity, '机构:', item.institution);
        }
        return matches;
      });
      console.log('城市筛选后数量:', filtered.length);
    }
    
    if (courseFilter) {
      filtered = filtered.filter(item => {
        if (!item.courses) return false;
        // 确保courses是数组格式
        const courseArray = Array.isArray(item.courses) ? item.courses : [item.courses];
        return courseArray.some(course => course && course.trim() === courseFilter);
      });
      console.log('课程筛选后数量:', filtered.length);
    }
    
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, searchTerm, cityFilter, courseFilter]);

  // 从所有140条记录中获取填充后的城市列表
  const cities = [...new Set(data.map((item, index) => getDisplayCity(item, index)).filter(city => city !== '未指定'))];
  
  // 从所有140条记录中获取课程列表
  const courses = [...new Set(data.flatMap(item => {
    if (!item.courses) return [];
    // 确保courses是数组格式
    const courseArray = Array.isArray(item.courses) ? item.courses : [item.courses];
    return courseArray.filter(Boolean).map(course => course.trim());
  }))].sort();

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // 导航模块数据
  const navigationModules = [
    {
      id: 'home',
      icon: Home,
      title: '首页',
      subtitle: '返回首页',
      count: null,
      onClick: onBackToHome,
      isActive: false
    },
    {
      id: 'venues',
      icon: Building2,
      title: '创业场地',
      subtitle: '场地信息',
      count: 5,
      onClick: () => console.log('跳转到创业场地'),
      isActive: false
    },
    {
      id: 'financing',
      icon: TrendingUp,
      title: '融资产品',
      subtitle: '融资信息',
      count: 3,
      onClick: () => console.log('跳转到融资产品'),
      isActive: false
    },
    {
      id: 'training',
      icon: GraduationCap,
      title: '培训期数',
      subtitle: '培训信息',
      count: data.reduce((sum, item) => sum + (item.sessions || 0), 0),
      onClick: () => console.log('当前页面'),
      isActive: true
    },
    {
      id: 'policies',
      icon: FileText,
      title: '扶持政策',
      subtitle: '政策信息',
      count: 5,
      onClick: () => console.log('跳转到扶持政策'),
      isActive: false
    },
    {
      id: 'mentors',
      icon: UserCheck,
      title: '创业导师',
      subtitle: '导师信息',
      count: 5,
      onClick: () => console.log('跳转到创业导师'),
      isActive: false
    },
    {
      id: 'institutions',
      icon: Briefcase,
      title: '服务机构',
      subtitle: '机构信息',
      count: 5,
      onClick: () => console.log('跳转到服务机构'),
      isActive: false
    }
  ];

  const timeInfo = formatTime(currentTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-700 text-white">
      {/* 固定顶部导航栏 - 不随页面滚动 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-blue-800/50 backdrop-blur-xl border-b border-blue-300/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* 左侧Logo和标题 */}
            <div className="flex items-center space-x-6">
              {/* Logo区域 */}
              <div className="relative">
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-1">
                    <span className="text-2xl font-bold text-white">源来</span>
                    <span className="text-2xl font-bold text-blue-300">好</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-semibold text-white">创业</span>
                    <span className="text-xs text-blue-200">CHUANGYE</span>
                  </div>
                </div>
                {/* 装饰性弧形 */}
                <div className="absolute -top-2 -left-2 -right-2 -bottom-2 border-2 border-green-400 rounded-full opacity-30"></div>
                <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-blue-300 rounded-full opacity-20"></div>
              </div>
              
              {/* 主标题 */}
              <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold text-white">
                  湖北·四清单两名录
                </h1>
                <button className="mt-1 px-4 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition-colors">
                  可视化系统
                </button>
              </div>
            </div>

            {/* 右侧状态信息 */}
            <div className="flex items-center space-x-4">
              {/* 实时数据按钮 */}
              <div className="flex items-center space-x-2 bg-blue-600/60 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white">实时数据</span>
              </div>
              
              {/* 时间显示 */}
              <div className="bg-blue-600/60 px-4 py-2 rounded-lg text-center">
                <div className="text-sm text-white">{timeInfo.date}</div>
                <div className="text-lg font-mono text-white">{timeInfo.time}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 - 添加顶部和底部边距为固定导航栏留出空间 */}
      <div className="pt-24 p-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-100 mb-4">
              湖北省培训期数管理系统
            </h1>
            <p className="text-lg text-blue-200">
              共计 {data.length} 个培训机构，{filteredData.length} 个符合条件
            </p>
          </div>

          {/* 筛选器 */}
          <div className="bg-blue-600/40 backdrop-blur-xl rounded-2xl border border-blue-300/30 shadow-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  搜索机构/地址/课程/城市
                </label>
                <input
                  type="text"
                  placeholder="输入关键词搜索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-blue-500/30 border border-blue-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-white placeholder-blue-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  城市筛选
                </label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-blue-500/30 border border-blue-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-white"
                >
                  <option value="">全部城市</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  课程筛选
                </label>
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-blue-500/30 border border-blue-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-white"
                >
                  <option value="">全部课程</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCityFilter('');
                    setCourseFilter('');
                  }}
                  className="w-full px-4 py-2 bg-blue-500/60 text-white rounded-lg hover:bg-blue-500/80 transition-colors border border-blue-300/50"
                >
                  重置筛选
                </button>
              </div>
            </div>
          </div>

          {/* 数据表格 */}
          <div className="bg-blue-600/40 backdrop-blur-xl rounded-2xl border border-blue-300/30 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-300/30">
                <thead className="bg-blue-500/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider w-20">
                      城市
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider w-48">
                      培训机构
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider w-64">
                      地址
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider w-40">
                      培训课程
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider w-16">
                      期数
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider w-48">
                      培训对象
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-100 uppercase tracking-wider w-40">
                      联系方式
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-blue-600/20 divide-y divide-blue-300/20">
                  {currentData
                    .filter(item => 
                      item.institution && 
                      item.institution !== 'nan' && 
                      item.institution.toLowerCase() !== 'nan'
                    )
                    .map((item, index) => {
                      // 找到项目在原始数据中的索引
                      const originalIndex = data.findIndex(originalItem => 
                        originalItem.institution === item.institution && 
                        originalItem.address === item.address &&
                        JSON.stringify(originalItem.courses) === JSON.stringify(item.courses)
                      );
                      
                      return (
                        <tr key={index} className="hover:bg-blue-500/30 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-100">
                            {getDisplayCity(item, originalIndex >= 0 ? originalIndex : 0)}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-blue-50">
                            {item.institution || '未指定'}
                          </td>
                          <td className="px-4 py-4 text-sm text-blue-100">
                            {getDisplayAddress(item, originalIndex >= 0 ? originalIndex : 0)}
                          </td>
                          <td className="px-4 py-4 text-sm text-blue-100">
                            {item.courses ? (
                              <div className="space-y-1">
                                {item.courses.map((course, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block bg-blue-400/30 text-blue-100 text-xs px-2 py-1 rounded-full mr-1 mb-1 border border-blue-300/50"
                                  >
                                    {course}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              '未指定'
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-100">
                            {item.sessions || 0}
                          </td>
                          <td className="px-4 py-4 text-sm text-blue-100">
                            {item.audience || '未指定'}
                          </td>
                          <td className="px-4 py-4 text-sm text-blue-100">
                            {item.contact || '未指定'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-blue-100 bg-blue-600/40 border border-blue-300/50 rounded-lg hover:bg-blue-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  上一页
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-400 text-blue-900 border border-blue-300'
                        : 'text-blue-100 bg-blue-600/40 border border-blue-300/50 hover:bg-blue-500/60'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-blue-100 bg-blue-600/40 border border-blue-300/50 rounded-lg hover:bg-blue-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  下一页
                </button>
              </nav>
            </div>
          )}

          {/* 统计信息 */}
          <div className="mt-6 text-center text-sm text-blue-200">
            显示第 {startIndex + 1} - {Math.min(endIndex, filteredData.length)} 条记录，
            共 {filteredData.length} 条记录
          </div>
        </div>
      </div>

      {/* 固定底部导航栏 - 不随页面滚动 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-blue-600/40 backdrop-blur-xl border-t border-blue-300/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {navigationModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <div
                  key={module.id}
                  onClick={module.onClick}
                  className={`group cursor-pointer bg-blue-500/30 backdrop-blur-xl rounded-xl border border-blue-300/30 p-4 hover:bg-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    module.isActive ? 'ring-2 ring-blue-400 bg-blue-500/50' : ''
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        module.isActive 
                          ? 'bg-blue-400 text-white' 
                          : 'bg-blue-500/60 text-white group-hover:bg-blue-400'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1">
                        {module.count !== null && (
                          <span className="text-lg font-bold text-blue-100">
                            {module.count}
                          </span>
                        )}
                        <span className={`text-sm font-semibold transition-colors ${
                          module.isActive 
                            ? 'text-blue-50' 
                            : 'text-blue-100 group-hover:text-blue-50'
                        }`}>
                          {module.title}
                        </span>
                      </div>
                      <span className={`text-xs transition-colors ${
                        module.isActive 
                          ? 'text-blue-200' 
                          : 'text-blue-200 group-hover:text-blue-100'
                      }`}>
                        {module.subtitle}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPeriodsPage;

