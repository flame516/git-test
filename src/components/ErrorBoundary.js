import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    console.error('ErrorBoundary 捕获到错误:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // 如果是地图相关错误，记录详细信息
    if (error && error.message && error.message.includes('addOverlay')) {
      console.error('地图实例错误详情:', {
        error: error.message,
        stack: error.stack,
        errorInfo: errorInfo
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // 自定义降级后的 UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl border border-red-200 p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-red-900 mb-4">
              页面出现错误
            </h1>
            
            <p className="text-red-700 mb-6">
              很抱歉，页面加载时遇到了问题。这可能是由于地图服务暂时不可用或网络连接问题导致的。
            </p>

            {this.state.error && (
              <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-red-800 mb-2">错误详情:</h3>
                <p className="text-red-700 text-sm font-mono break-all">
                  {this.state.error.message}
                </p>
                {this.state.errorInfo && this.state.errorInfo.componentStack && (
                  <details className="mt-2">
                    <summary className="text-red-700 text-sm cursor-pointer">查看组件堆栈</summary>
                    <pre className="text-red-600 text-xs mt-2 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-200"
              >
                重新加载页面
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors duration-200"
              >
                尝试恢复
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>如果问题持续存在，请检查：</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>网络连接是否正常</li>
                <li>浏览器是否支持WebGL</li>
                <li>地图API密钥是否有效</li>
                <li>是否启用了JavaScript</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
