import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line,
    AreaChart, Area, ScatterChart, Scatter
  } from 'recharts';
import BMapComponent from './components/BMapComponent';
import VenueMap from './components/VenueMap';
import TrainingPeriodsPage from './components/TrainingPeriodsPage';
import ErrorBoundary from './components/ErrorBoundary';
import {
  Building2, TrendingUp, GraduationCap, FileText,
  UserCheck, Briefcase
} from 'lucide-react';
import trainingData from './data/training_data.json';

// 模拟数据
const realData = {
  // Sheet1: 场地信息清单
  venues: [
    {
      id: 1,
      city: '武汉市',
      name: '光谷创业咖啡',
      address: '武汉市洪山区光谷创业街9栋201室',
      category: '国家级、省级、市级',
      totalArea: 20000,
      availableArea: 3000,
      facilities: '办公设施、会议室、培训室、咖啡厅',
      policies: '租金优惠、政策咨询、创业指导、投融资对接',
      contact: '张主任',
      phone: '13260566578'
    },
    {
      id: 2,
      city: '武汉市',
      name: '武汉理工大学创业学院',
      address: '武汉市洪山区珞狮路122号',
      category: '省级、市级',
      totalArea: 15000,
      availableArea: 2500,
      facilities: '办公设施、会议室、培训室、实验室',
      policies: '租金补贴、政策咨询、创业指导、技术转移',
      contact: '李主任',
      phone: '13800138000'
    },
    {
      id: 3,
      city: '宜昌市',
      name: '宜昌高新区创业园',
      address: '宜昌市高新区发展大道',
      category: '市级',
      totalArea: 12000,
      availableArea: 1800,
      facilities: '办公设施、会议室、培训室',
      policies: '租金优惠、政策咨询、创业指导',
      contact: '王主任',
      phone: '13900139000'
    },
    {
      id: 4,
      city: '襄阳市',
      name: '襄阳创业孵化基地',
      address: '襄阳市高新区创业大道',
      category: '省级',
      totalArea: 10000,
      availableArea: 1500,
      facilities: '办公设施、会议室、培训室',
      policies: '租金补贴、政策咨询、创业指导',
      contact: '陈主任',
      phone: '13900139001'
    },
    {
      id: 5,
      city: '黄石市',
      name: '黄石创业服务中心',
      address: '黄石市下陆区创业路',
      category: '市级',
      totalArea: 8000,
      availableArea: 1200,
      facilities: '基础办公设施',
      policies: '租金优惠、政策咨询',
      contact: '刘主任',
      phone: '13900139002'
    }
  ],

  // Sheet2: 融资信息清单
  financing: [
    {
      id: 1,
      city: '武汉市',
      name: '武汉农村商业银行',
      address: '武汉市江岸区建设大道618号武银大厦',
      policy: '一年内，新招用符合创业担保贷款申请条件的人数，达企业在职职工10%（超100人企业达5%）且签1年以上劳动合同。企业须无拖欠工资、欠缴社保等违法违规信用记录。小微企业贷款额度不超500万元，期限不超2年。对符合条件的，贷款利率上限为LPR+150BPs。财政部门按照实际贷款利率的50%给予贴息。创业担保贷款累计可享受不超3次。',
      onlineLink: 'https://www.whrcb.com',
      financeContact: '陈昕',
      financePhone: '027-85497387',
      hrContact: '张曙宇',
      hrPhone: '027-85805987',
      maxAmount: 500,
      interestRate: 'LPR+150BPs'
    },
    {
      id: 2,
      city: '武汉市',
      name: '个人创业担保贷款',
      address: '武汉市各区人社部门',
      policy: '劳动年龄内的符合条件的创业人员在我市依法开办个体工商户、合伙经营及创办小微企业，注册营业执照并正常经营3个月及以上的，可申请最长期限不超过3年、最高额度不超过30万元的个人创业担保贷款。对符合条件的，贷款利率上限为LPR+150BPs。财政部门按照实际贷款利率的50%给予贴息。创业担保贷款累计可享受不超3次。',
      onlineLink: 'https://www.whrsj.gov.cn',
      financeContact: '人社部门',
      financePhone: '027-12333',
      hrContact: '创业指导科',
      hrPhone: '027-12333',
      maxAmount: 30,
      interestRate: 'LPR+150BPs'
    },
    {
      id: 3,
      city: '宜昌市',
      name: '宜昌创业担保贷款',
      address: '宜昌市人社局',
      policy: '为符合条件的创业者提供最高50万元的创业担保贷款支持',
      onlineLink: 'https://www.ycrs.gov.cn',
      financeContact: '创业科',
      financePhone: '0717-12333',
      hrContact: '就业科',
      hrPhone: '0717-12333',
      maxAmount: 50,
      interestRate: 'LPR+100BPs'
    }
  ],

  // Sheet3: 培训信息清单
  training: [
    {
      id: 1,
      city: '武汉市',
      name: '武汉伟鼎职业培训学校',
      location: '武汉市江汉区经济开发区智慧大厦汉口创业中心二号楼',
      content: 'SYB培训、网络创业培训',
      periods: 8,
      target: '城镇登记失业人员、农村转移就业劳动者、毕业年度高校毕业生、初期创业者等符合条件的群体',
      contact: '培训部',
      phone: '13477024007',
      students: 120,
      satisfaction: 4.6
    },
    {
      id: 2,
      city: '武汉市',
      name: '武汉创业培训中心',
      location: '武汉市洪山区光谷创业街',
      content: '创业技能培训、企业管理培训',
      periods: 6,
      target: '创业者、小微企业主、高校毕业生',
      contact: '培训部',
      phone: '13800138001',
      students: 80,
      satisfaction: 4.8
    },
    {
      id: 3,
      city: '宜昌市',
      name: '宜昌创业学院',
      location: '宜昌市高新区创业园',
      content: '创业基础培训、技能提升培训',
      periods: 4,
      target: '创业者、失业人员、农村转移劳动力',
      contact: '培训部',
      phone: '13900139003',
      students: 60,
      satisfaction: 4.5
    },
    {
      id: 4,
      city: '襄阳市',
      name: '襄阳创业培训学校',
      location: '襄阳市高新区创业大道',
      content: '创业指导培训、技能培训',
      periods: 5,
      target: '创业者、失业人员、高校毕业生',
      contact: '培训部',
      phone: '13900139004',
      students: 45,
      satisfaction: 4.7
    },
    {
      id: 5,
      city: '黄石市',
      name: '黄石创业培训中心',
      location: '黄石市下陆区创业路',
      content: '创业技能培训、政策解读培训',
      periods: 3,
      target: '创业者、失业人员、农村劳动力',
      contact: '培训部',
      phone: '13900139005',
      students: 35,
      satisfaction: 4.4
    }
  ],

  // Sheet4: 湖北省创业扶持政策清单
  policies: [
    {
      id: 1,
      city: '武汉市',
      name: '武汉市创业担保贷款贴息政策',
      category: '贷款贴息',
      amount: 100,
      description: '为符合条件的创业者提供贷款贴息支持，贴息比例最高50%',
      contact: '武汉市人社局',
      phone: '027-12333',
      onlineLink: 'https://www.whrsj.gov.cn'
    },
    {
      id: 2,
      city: '武汉市',
      name: '武汉市创业场地租金补贴政策',
      category: '场地租金',
      amount: 80,
      description: '为入驻创业孵化基地的创业者提供场地租金补贴',
      contact: '武汉市人社局',
      phone: '027-12333',
      onlineLink: 'https://www.whrsj.gov.cn'
    },
    {
      id: 3,
      city: '宜昌市',
      name: '宜昌市创业培训补贴政策',
      category: '培训补贴',
      amount: 60,
      description: '为参加创业培训的创业者提供培训费用补贴',
      contact: '宜昌市人社局',
      phone: '0717-12333',
      onlineLink: 'https://www.ycrs.gov.cn'
    },
    {
      id: 4,
      city: '襄阳市',
      name: '襄阳市创业孵化基地建设补贴',
      category: '孵化园',
      amount: 120,
      description: '支持创业孵化基地建设，提供建设补贴和运营补贴',
      contact: '襄阳市人社局',
      phone: '0710-12333',
      onlineLink: 'https://www.xfrs.gov.cn'
    },
    {
      id: 5,
      city: '黄石市',
      name: '黄石市创业设备补贴政策',
      category: '设备补贴',
      amount: 40,
      description: '为创业者提供必要的办公设备补贴',
      contact: '黄石市人社局',
      phone: '0714-12333',
      onlineLink: 'https://www.hsrs.gov.cn'
    }
  ],

      // Sheet5: 创业导师名录
    mentors: [
      {
        id: 1,
        city: '武汉市',
        name: '艾靓',
        title: '高级创业导师',
        company: '武汉创业导师协会',
        specialty: '商业模式设计、市场营销、团队建设',
        experience: '15年创业指导经验，指导过200+创业项目',
        experienceYears: 15,
        rating: 4.8,
        students: 45,
        phone: '13800138002',
        email: 'ailing@mentor.com'
      },
      {
        id: 2,
        city: '武汉市',
        name: '张教授',
        title: '创业学教授',
        company: '武汉理工大学',
        specialty: '创业理论、政策研究、项目评估',
        experience: '20年教学研究经验，发表论文100+篇',
        experienceYears: 20,
        rating: 4.9,
        students: 38,
        phone: '13800138003',
        email: 'zhang@whut.edu.cn'
      },
      {
        id: 3,
        city: '宜昌市',
        name: '李导师',
        title: '资深创业导师',
        company: '宜昌创业服务中心',
        specialty: '财务管理、风险控制、融资对接',
        experience: '12年创业指导经验，成功指导项目150+',
        experienceYears: 12,
        rating: 4.7,
        students: 52,
        phone: '13900139006',
        email: 'li@ycmentor.com'
      },
      {
        id: 4,
        city: '襄阳市',
        name: '王导师',
        title: '创业指导师',
        company: '襄阳创业学院',
        specialty: '技术创业、知识产权、产学研合作',
        experience: '10年创业指导经验，专注科技创业',
        experienceYears: 10,
        rating: 4.6,
        students: 28,
        phone: '13900139007',
        email: 'wang@xymentor.com'
      },
      {
        id: 5,
        city: '黄石市',
        name: '陈导师',
        title: '创业咨询师',
        company: '黄石创业服务中心',
        specialty: '创业规划、市场调研、品牌建设',
        experience: '8年创业指导经验，擅长传统行业转型',
        experienceYears: 8,
        rating: 4.5,
        students: 35,
        phone: '13900139008',
        email: 'chen@hsmentor.com'
      }
    ],

  // Sheet6: 公共就业服务机构名录
  services: [
    {
      id: 1,
      city: '武汉市',
      name: '江岸区公共就业和人才服务中心',
      address: '武汉市江岸区黄浦大街27号',
      category: '区级',
      services: '就业指导、创业指导、职业介绍、技能培训',
      clients: 1200,
      satisfaction: 4.8,
      contact: '就业科',
      phone: '027-12333',
      onlineLink: 'https://www.whrsj.gov.cn'
    },
    {
      id: 2,
      city: '武汉市',
      name: '洪山区公共就业服务中心',
      address: '武汉市洪山区珞狮路122号',
      category: '区级',
      services: '就业服务、创业指导、政策咨询、技能培训',
      clients: 980,
      satisfaction: 4.7,
      contact: '就业科',
      phone: '027-12333',
      onlineLink: 'https://www.whrsj.gov.cn'
    },
    {
      id: 3,
      city: '宜昌市',
      name: '宜昌市公共就业服务中心',
      address: '宜昌市西陵区西陵一路7号',
      category: '市级',
      services: '就业指导、创业服务、职业介绍、技能培训',
      clients: 850,
      satisfaction: 4.6,
      contact: '就业科',
      phone: '0717-12333',
      onlineLink: 'https://www.ycrs.gov.cn'
    },
    {
      id: 4,
      city: '襄阳市',
      name: '襄阳市公共就业服务中心',
      address: '襄阳市樊城区长虹路',
      category: '市级',
      services: '就业服务、创业指导、政策咨询、技能培训',
      clients: 720,
      satisfaction: 4.5,
      contact: '就业科',
      phone: '0710-12333',
      onlineLink: 'https://www.xfrs.gov.cn'
    },
    {
      id: 5,
      city: '黄石市',
      name: '黄石市公共就业服务中心',
      address: '黄石市下陆区创业路',
      category: '市级',
      services: '就业指导、创业服务、职业介绍、技能培训',
      clients: 650,
      satisfaction: 4.4,
      contact: '就业科',
      phone: '0714-12333',
      onlineLink: 'https://www.hsrs.gov.cn'
    }
  ]
};

const COLORS = ['#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff', '#f3e8ff', '#faf5ff'];

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animateData, setAnimateData] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 启动数据动画
    const animationTimer = setTimeout(() => {
      setAnimateData(true);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(animationTimer);
    };
  }, []);

  // 计算统计数据
  const stats = {
    totalVenues: realData.venues.length,
    totalArea: realData.venues.reduce((sum, v) => sum + v.totalArea, 0),
    availableArea: realData.venues.reduce((sum, v) => sum + v.availableArea, 0),
    totalFinancing: realData.financing.length,
    totalTraining: trainingData && trainingData.items ? 
      trainingData.items
        .filter(item => 
          item.institution && 
          item.institution !== 'nan' && 
          item.institution.toLowerCase() !== 'nan'
        )
        .reduce((sum, item) => sum + (item.sessions || 0), 0) : 0,
    totalPolicies: realData.policies.length,
    totalMentors: realData.mentors.length,
    totalServices: realData.services.length,
    totalSupport: realData.policies.reduce((sum, p) => sum + (p.amount || 0), 0)
  };

  // 动画数值
  const animatedStats = animateData ? stats : {
    totalVenues: 0,
    totalArea: 0,
    availableArea: 0,
    totalFinancing: 0,
    totalTraining: 0,
    totalPolicies: 0,
    totalMentors: 0,
    totalServices: 0,
    totalSupport: 0
  };

  // 页面渲染函数
  const renderPage = () => {
    if (currentPage === 'venues') {
      return (
        <ErrorBoundary>
          <VenueMap />
        </ErrorBoundary>
      );
    }
    if (currentPage === 'training') {
      return (
        <ErrorBoundary>
          <TrainingPeriodsPage onBackToHome={() => setCurrentPage('home')} />
        </ErrorBoundary>
      );
    }
    // 默认返回首页内容
    return renderHomePage();
  };

  const renderHomePage = () => (
    <>
      {/* 中央地图 - 作为背景显示 */}
      <div className="absolute inset-0 z-0">
        <BMapComponent
          realData={realData}
          onCityClick={() => {}}
        />
      </div>

      {/* 周围模块 - 大幅增加间距和高度，让界面宽松舒适 */}
      <div className="fixed inset-0 z-10 pt-24 pointer-events-none">
        <div className="h-full grid grid-cols-12 grid-rows-7 gap-4 p-4">
          {/* 全局样式优化 */}
          <style jsx="true" global="true">{`
            .module-content {
              overflow: visible !important;
              height: auto !important;
            }
            .chart-container {
              min-height: 144px !important;
              height: 144px !important;
            }
            .text-content {
              line-height: 1.2 !important;
              margin-bottom: 0.5rem !important;
            }
          `}</style>

          {/* 动态背景效果 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float delay-2000"></div>

            {/* 粒子效果 */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* 字体优化工具 */}
          {/* Removed FontOptimizer component */}

          {/* 头部标题 - 大幅增加高度，让界面宽松 */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600/40 via-blue-500/35 to-blue-600/40 backdrop-blur-3xl h-28 border-b border-blue-300/20 shadow-2xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(32px) saturate(200%) brightness(1.1)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%) brightness(1.1)'
        }}
      >
        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-80"></div>
        
                <div className="container mx-auto px-8 h-full flex items-center justify-between">
          {/* 左侧Logo和标题 */}
          <motion.div
            className="flex items-center space-x-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Logo */}
            <motion.img
              src="/logo.png"
              alt="湖北省创业扶持平台Logo"
              className="w-60 h-60 object-contain"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            
            {/* 标题文字 - 紧挨着logo */}
            <div className="flex flex-col justify-center">
              <motion.h1
                className="text-3xl font-bold bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent leading-tight tracking-wide mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                湖北·四清单两名录
              </motion.h1>
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <span className="text-lg text-blue-300 font-semibold bg-blue-800/30 px-4 py-2 rounded-full border border-blue-400/40 backdrop-blur-sm shadow-lg">
                  可视化系统
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* 右侧时间显示和实时数据 */}
          <motion.div
            className="flex items-center space-x-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
                          {/* 实时数据指示器 */}
            <div className="flex items-center space-x-3 bg-blue-600/30 backdrop-blur-lg px-4 py-3 rounded-2xl border border-blue-300/20">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-blue-100 text-sm font-medium">实时数据</span>
            </div>
            
            {/* 时间显示 */}
            <div className="text-xl font-mono text-blue-100 bg-gradient-to-r from-blue-600/50 to-blue-500/50 px-6 py-3 rounded-2xl backdrop-blur-lg border border-blue-300/20 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {currentTime.toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-lg text-blue-200">
                    {currentTime.toLocaleTimeString('zh-CN')}
                  </div>
                </div>
              </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 中央地图 - 作为背景显示 */}
      <div className="absolute inset-0 z-0">
        <BMapComponent
          realData={realData}
          onCityClick={() => {}}
        />
      </div>

      {/* 周围模块 - 大幅增加间距和高度，让界面宽松舒适 */}
      <div className="fixed inset-0 z-10 pt-24 pointer-events-none">
        <div className="h-full grid grid-cols-12 grid-rows-7 gap-4 p-4">

          {/* 左上角 - 场地信息模块 */}
          <motion.div
            className="col-span-3 row-span-2 bg-gradient-to-br from-blue-600/40 via-blue-500/35 to-blue-600/40 backdrop-blur-2xl rounded-3xl border border-blue-300/50 shadow-2xl overflow-hidden pointer-events-auto group"
            initial={{ opacity: 0, x: -50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -3, rotateY: 2 }}
            style={{
              boxShadow: '0 25px 50px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* 顶部装饰线 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-60"></div>
            
            <div className="h-full p-4 flex flex-col min-h-0 relative">
              {/* 背景装饰 */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>
              
              <div className="flex items-center space-x-3 mb-3 flex-shrink-0">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400/60 to-blue-500/60 rounded-xl flex items-center justify-center border border-blue-300/40 shadow-lg group-hover:scale-110 transition-all duration-300">
                <Building2 className="w-5 h-5 text-blue-100" />
              </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-100 group-hover:text-blue-50 transition-colors">场地信息</h3>
                  <p className="text-xs text-blue-300/80">创业场地资源分布</p>
                </div>
              </div>

              <div className="mb-3 flex-1 min-h-0 space-y-2">
                <div className="bg-gradient-to-br from-blue-500/30 to-blue-600/25 rounded-xl p-3 border border-blue-300/30 shadow-lg backdrop-blur-sm"
                     style={{
                       boxShadow: '0 4px 16px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                     }}>
                  <div className="text-2xl font-bold text-blue-100 mb-1 transition-all duration-1000">
                    {animatedStats.totalArea.toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-200 font-medium">总场地面积(㎡)</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/30 to-blue-600/25 rounded-xl p-3 border border-blue-300/30 shadow-lg backdrop-blur-sm"
                     style={{
                       boxShadow: '0 4px 16px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                     }}>
                  <div className="text-xl font-bold text-blue-100 mb-1 transition-all duration-1000">
                    {animatedStats.availableArea.toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-200 font-medium">空余面积(㎡)</div>
                </div>
              </div>

              <div className="h-32 flex-shrink-0 min-h-0 bg-blue-700/20 rounded-xl p-2 border border-blue-400/20">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={realData.venues}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="totalArea"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {realData.venues.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e40af',
                        border: '1px solid #3b82f6',
                        borderRadius: '12px',
                        color: '#dbeafe',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                        fontSize: '11px',
                        padding: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* 右上角 - 培训信息模块 */}
          <motion.div
            className="col-span-3 row-span-2 col-start-10 bg-gradient-to-br from-blue-600/30 via-blue-500/25 to-blue-600/30 backdrop-blur-2xl rounded-3xl border border-blue-300/40 shadow-2xl overflow-hidden pointer-events-auto group"
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -3, rotateY: -2 }}
            style={{
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* 顶部装饰线 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60"></div>
            
            <div className="h-full p-4 flex flex-col min-h-0 relative">
              {/* 背景装饰 */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
              
              <div className="flex items-center space-x-3 mb-3 flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/60 to-blue-600/60 rounded-xl flex items-center justify-center border border-blue-400/40 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <GraduationCap className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-100 group-hover:text-blue-50 transition-colors">培训信息</h3>
                  <p className="text-xs text-blue-300/80">创业培训资源统计</p>
                </div>
              </div>

              <div className="mb-3 flex-1 min-h-0 space-y-2">
                <div className="bg-blue-700/30 rounded-xl p-2 border border-blue-400/20">
                  <div className="text-2xl font-bold text-blue-200 mb-1 transition-all duration-1000">
                    {animatedStats.totalTraining}
                  </div>
                  <div className="text-xs text-blue-300 font-medium">总培训期数</div>
                </div>
                <div className="bg-blue-700/30 rounded-xl p-2 border border-blue-400/20">
                  <div className="text-xl font-bold text-blue-200 mb-1 transition-all duration-1000">
                    {realData.training.reduce((sum, t) => sum + 1, 0)}
                  </div>
                  <div className="text-xs text-blue-300 font-medium">培训机构数</div>
                </div>
              </div>

              <div className="h-32 flex-shrink-0 min-h-0 bg-blue-700/20 rounded-xl p-2 border border-blue-400/20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realData.training}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" opacity={0.3} />
                    <XAxis dataKey="city" stroke="#3b82f6" fontSize={9} />
                    <YAxis stroke="#3b82f6" fontSize={8} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e40af',
                        border: '1px solid #3b82f6',
                        borderRadius: '12px',
                        color: '#dbeafe',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                        fontSize: '11px',
                        padding: '8px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="periods"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, stroke: '#1e40af', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* 左侧中间 - 融资信息模块 */}
          <motion.div
            className="col-span-3 row-span-2 row-start-3 bg-gradient-to-br from-blue-600/30 via-blue-500/25 to-blue-600/30 backdrop-blur-2xl rounded-3xl border border-blue-300/40 shadow-2xl overflow-hidden pointer-events-auto group"
            initial={{ opacity: 0, x: -50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -3, rotateY: 2 }}
            style={{
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* 顶部装饰线 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-60"></div>
            
            <div className="h-full p-5 flex flex-col min-h-0 relative">
              {/* 背景装饰 */}
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>
              
              <div className="flex items-center space-x-3 mb-3 flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400/60 to-blue-500/60 rounded-xl flex items-center justify-center border border-blue-300/40 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <TrendingUp className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-100 group-hover:text-blue-50 transition-colors">融资信息</h3>
                  <p className="text-xs text-blue-300/80">创业融资服务评估</p>
                </div>
              </div>

              <div className="mb-3 flex-1 min-h-0 space-y-2">
                <div className="bg-blue-700/30 rounded-xl p-2 border border-blue-400/20">
                  <div className="text-2xl font-bold text-blue-200 mb-1 transition-all duration-1000">
                    {animatedStats.totalFinancing}
                  </div>
                  <div className="text-xs text-blue-300 font-medium">融资产品数量</div>
                </div>
                <div className="bg-blue-700/30 rounded-xl p-2 border border-blue-400/20">
                  <div className="text-xl font-bold text-blue-200 mb-1">
                    500万
                  </div>
                  <div className="text-xs text-blue-300 font-medium">最高贷款额度</div>
                </div>
              </div>

              <div className="h-32 flex-shrink-0 min-h-0 bg-blue-700/20 rounded-xl p-2 border border-blue-400/20">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={[
                    { subject: '企业贷款', A: 100, fullMark: 100 },
                    { subject: '个人贷款', A: 80, fullMark: 100 },
                    { subject: '贴息支持', A: 90, fullMark: 100 },
                    { subject: '申请便利', A: 85, fullMark: 100 },
                    { subject: '审批速度', A: 95, fullMark: 100 }
                  ]}>
                    <PolarGrid stroke="#3b82f6" strokeWidth={1} />
                    <PolarAngleAxis dataKey="subject" stroke="#3b82f6" fontSize={7} />
                    <PolarRadiusAxis stroke="#3b82f6" fontSize={6} />
                    <Radar 
                      name="融资服务" 
                      dataKey="A" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.2}
                      strokeWidth={1}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* 右侧中间 - 政策信息模块 */}
          <motion.div
            className="col-span-3 row-span-2 col-start-10 row-start-3 bg-gradient-to-br from-blue-600/30 via-blue-500/25 to-blue-600/30 backdrop-blur-2xl rounded-3xl border border-blue-300/40 shadow-2xl overflow-hidden pointer-events-auto group"
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -3, rotateY: -2 }}
            style={{
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* 顶部装饰线 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60"></div>
            
            <div className="h-full p-5 flex flex-col min-h-0 relative">
              {/* 背景装饰 */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
              
              <div className="flex items-center space-x-3 mb-3 flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/60 to-blue-600/60 rounded-xl flex items-center justify-center border border-blue-400/40 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <FileText className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-100 group-hover:text-blue-50 transition-colors">政策信息</h3>
                  <p className="text-xs text-blue-300/80">创业扶持政策汇总</p>
                </div>
              </div>

              <div className="mb-3 flex-1 min-h-0 space-y-2">
                <div className="bg-blue-700/30 rounded-xl p-2 border border-blue-400/20">
                  <div className="text-2xl font-bold text-blue-200 mb-1 transition-all duration-1000">
                    {animatedStats.totalPolicies}
                  </div>
                  <div className="text-xs text-blue-300 font-medium">扶持政策数量</div>
                </div>
                <div className="bg-blue-700/30 rounded-xl p-2 border border-blue-400/20">
                  <div className="text-xl font-bold text-blue-200 mb-1 transition-all duration-1000">
                    {animatedStats.totalSupport}万
                  </div>
                  <div className="text-xs text-blue-300 font-medium">总支持金额</div>
                </div>
              </div>

              <div className="h-32 flex-shrink-0 min-h-0 bg-blue-700/20 rounded-xl p-2 border border-blue-400/20">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: '孵化园', value: 120 },
                    { name: '贷款贴息', value: 100 },
                    { name: '培训补贴', value: 60 },
                    { name: '场地租金', value: 80 },
                    { name: '设备补贴', value: 40 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#3b82f6" fontSize={8} />
                    <YAxis stroke="#3b82f6" fontSize={8} domain={[0, 130]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e40af',
                        border: '1px solid #3b82f6',
                        borderRadius: '12px',
                        color: '#dbeafe',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                        fontSize: '11px',
                        padding: '8px'
                      }}
                      formatter={(value, name) => [`${value}万元`, '支持金额']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                      strokeWidth={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* 左下角 - 服务机构模块 */}
          <motion.div
            className="col-span-3 row-span-2 row-start-5 bg-gradient-to-br from-blue-600/30 via-blue-500/25 to-blue-600/30 backdrop-blur-2xl rounded-3xl border border-blue-300/40 shadow-2xl overflow-hidden pointer-events-auto group"
            initial={{ opacity: 0, x: -50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -3, rotateY: 2 }}
            style={{
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* 顶部装饰线 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60"></div>
            
            <div className="h-full p-5 flex flex-col min-h-0 relative">
              {/* 背景装饰 */}
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
              
              <div className="flex items-center space-x-3 mb-3 flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/60 to-blue-600/60 rounded-xl flex items-center justify-center border border-blue-400/40 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Briefcase className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-100 group-hover:text-blue-50 transition-colors">服务机构</h3>
                  <p className="text-xs text-blue-300/80">创业服务满意度</p>
                </div>
              </div>

              <div className="mb-3 flex-1 min-h-0 space-y-2">
                <div className="bg-blue-700/30 rounded-xl p-2 border border-blue-400/20">
                  <div className="text-2xl font-bold text-blue-200 mb-1 transition-all duration-1000">
                    {animatedStats.totalServices}
                  </div>
                  <div className="text-xs text-blue-300 font-medium">服务机构数量</div>
                </div>
                <div className="bg-blue-700/30 rounded-xl p-2 border border-blue-400/20">
                  <div className="text-xl font-bold text-blue-200 mb-1 transition-all duration-1000">
                    {realData.services.reduce((sum, s) => sum + s.clients, 0)}
                  </div>
                  <div className="text-xs text-blue-300 font-medium">总服务客户数</div>
                </div>
              </div>

              <div className="h-32 flex-shrink-0 min-h-0 bg-blue-700/20 rounded-xl p-2 border border-blue-400/20">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={realData.services.slice(0, 3)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#3b82f6" fontSize={8} />
                    <YAxis stroke="#3b82f6" fontSize={8} domain={[0, 5]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e40af',
                        border: '1px solid #3b82f6',
                        borderRadius: '12px',
                        color: '#dbeafe',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                        fontSize: '11px',
                        padding: '8px'
                      }}
                      formatter={(value, name) => [`${value}分`, '满意度']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar dataKey="satisfaction" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* 右下角 - 导师信息模块 */}
          <motion.div
            className="col-span-3 row-span-2 col-start-10 row-start-5 bg-gradient-to-br from-blue-600/30 via-blue-500/25 to-blue-600/30 backdrop-blur-2xl rounded-3xl border border-blue-400/40 shadow-2xl overflow-hidden pointer-events-auto group"
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.02, y: -3, rotateY: -2 }}
            style={{
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* 顶部装饰线 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60"></div>
            
            <div className="h-full p-5 flex flex-col min-h-0 relative">
              {/* 背景装饰 */}
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
              
              <div className="flex items-center space-x-3 mb-3 flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/60 to-blue-600/60 rounded-xl flex items-center justify-center border border-blue-400/40 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <UserCheck className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-100 group-hover:text-blue-50 transition-colors">导师信息</h3>
                  <p className="text-xs text-blue-300/80">创业导师能力分布</p>
                </div>
              </div>

              <div className="mb-3 flex-1 min-h-0 space-y-2">
                <div className="bg-blue-700/30 rounded-xl p-2 border border-blue-400/20">
                  <div className="text-2xl font-bold text-blue-200 mb-1 transition-all duration-1000">
                    {animatedStats.totalMentors}
                  </div>
                  <div className="text-xs text-blue-300 font-medium">导师总人数</div>
                </div>
                <div className="bg-blue-700/30 rounded-xl p-2 border border-blue-400/20">
                  <div className="text-xl font-bold text-blue-200 mb-1 transition-all duration-1000">
                    {realData.mentors.reduce((sum, m) => sum + m.students, 0)}
                  </div>
                  <div className="text-xs text-blue-300 font-medium">指导学员总数</div>
                </div>
              </div>

              <div className="h-32 flex-shrink-0 min-h-0 bg-blue-700/20 rounded-xl p-2 border border-blue-400/20">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={realData.mentors}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" opacity={0.3} />
                    <XAxis dataKey="rating" stroke="#3b82f6" fontSize={8} domain={[4, 5]} />
                    <YAxis stroke="#3b82f6" fontSize={8} domain={[0, 60]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e40af',
                        border: '1px solid #3b82f6',
                        borderRadius: '12px',
                        color: '#dbeafe',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                        fontSize: '11px',
                        padding: '8px'
                      }}
                      formatter={(value, name) => {
                        if (name === 'rating') return [`${value}分`, '评分'];
                        if (name === 'students') return [`${value}人`, '学员数'];
                        if (name === 'experience') return [`${value}年`, '经验年限'];
                        return [value, name];
                      }}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Scatter 
                      dataKey="students" 
                      fill="#3b82f6" 
                      r={(entry) => Math.max(6, Math.min(16, entry.experienceYears * 1.5))}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* 底部统计信息 - 重新集成到网格布局 */}
          <motion.div
            className="col-span-12 row-span-1 row-start-7 bg-gradient-to-r from-blue-600/40 via-blue-500/35 to-blue-600/40 backdrop-blur-xl rounded-3xl border border-blue-300/20 shadow-lg overflow-hidden pointer-events-auto group"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            whileHover={{ scale: 1.01 }}
            style={{
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* 顶部装饰线 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60"></div>
            
            <div className="h-full p-6 relative">
              {/* 背景装饰 */}
              <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
              
              <div className="grid grid-cols-7 gap-6 h-full max-w-7xl mx-auto">
                {/* 首页按钮 */}
                <motion.div
                  className="flex items-center space-x-3 group cursor-pointer w-full"
                  initial={{ opacity: 0, scale: 0.5, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{
                    scale: 1.05,
                    y: -3,
                    transition: { type: "spring", stiffness: 300, damping: 10 }
                  }}
                  onClick={() => window.location.reload()}
                >
                  {/* 图标容器 */}
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/60 to-blue-600/60 rounded-2xl flex items-center justify-center border border-blue-400/40 shadow-lg group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {/* 悬停光效 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                  </div>
                  
                  {/* 标签显示 */}
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <div className="text-xl font-bold text-blue-200 transition-all duration-1000 mb-1">
                      首页
                    </div>
                    <div className="text-xs text-blue-300/80 font-medium leading-tight">
                      返回首页
                    </div>
                  </div>
                </motion.div>
                
                {[
                  { icon: Building2, label: '创业场地', value: animatedStats?.totalVenues || 0, page: 'venues' },
                  { icon: TrendingUp, label: '融资产品', value: animatedStats?.totalFinancing || 0, page: 'financing' },
                  { icon: GraduationCap, label: '培训期数', value: animatedStats?.totalTraining || 0, page: 'training' },
                  { icon: FileText, label: '扶持政策', value: animatedStats?.totalPolicies || 0, page: 'policies' },
                  { icon: UserCheck, label: '创业导师', value: animatedStats?.totalMentors || 0, page: 'mentors' },
                  { icon: Briefcase, label: '服务机构', value: animatedStats?.totalServices || 0, page: 'services' }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center space-x-3 group cursor-pointer w-full"
                    initial={{ opacity: 0, scale: 0.5, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: Math.min(0.8 + index * 0.1, 1.5) }}
                    whileHover={{
                      scale: 1.05,
                      y: -3,
                      transition: { type: "spring", stiffness: 300, damping: 10 }
                    }}
                    onClick={() => setCurrentPage(item.page)}
                    onError={(error) => {
                      console.warn('Animation error:', error);
                    }}
                  >
                    {/* 图标容器 */}
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500/60 to-blue-600/60 rounded-2xl flex items-center justify-center border border-blue-400/40 shadow-lg group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex-shrink-0">
                      {item.icon && <item.icon className="w-7 h-7 text-white" />}
                      {/* 悬停光效 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                    </div>
                    
                    {/* 数值和标签显示 - 水平排列 */}
                    <div className="flex flex-col justify-center min-w-0 flex-1">
                      <div className="text-xl font-bold text-blue-200 transition-all duration-1000 mb-1">
                        {item.value || 0}
                      </div>
                      <div className="text-xs text-blue-300/80 font-medium leading-tight">
                        {item.label || ''}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
          {/* Removed FontTest component */}
        </div>
      </div>
    </>
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-700 text-white overflow-hidden relative font-display">
        {renderPage()}
      </div>
    </ErrorBoundary>
  );
}

export default App;

