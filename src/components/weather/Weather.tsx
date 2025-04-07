import React, { useEffect, useState } from 'react';
import { FiCloud, FiSun, FiCloudRain, FiCloudSnow, FiCloudLightning, FiWind } from 'react-icons/fi';

interface WeatherData {
  temp: number;
  weather: string;
  city: string;
  icon: string;
}

// 城市名称映射表
const cityNameMap: Record<string, string> = {
  'Beijing': '北京',
  'Shanghai': '上海',
  'Guangzhou': '广州',
  'Shenzhen': '深圳',
  'Tianjin': '天津',
  'Chongqing': '重庆',
  'Hangzhou': '杭州',
  'Nanjing': '南京',
  'Wuhan': '武汉',
  'Chengdu': '成都',
  'Xian': "西安",
  'Xi\'an': '西安',
};

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // 免费的OpenWeatherMap API密钥

  useEffect(() => {
    const fetchWeatherData = async (url: string) => {
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('天气数据获取失败');
        }
        
        const data = await response.json();
        // 将英文城市名转换为中文
        const cityName = data.name;
        const chineseCityName = cityNameMap[cityName] || cityName;
        
        setWeather({
          temp: Math.round(data.main.temp),
          weather: data.weather[0].description,
          city: chineseCityName,
          icon: data.weather[0].main
        });
        setLoading(false);
      } catch (err) {
        setError('天气数据获取失败');
        setLoading(false);
      }
    };

    const fetchWeatherByCoords = (latitude: number, longitude: number) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=zh_cn`;
      return fetchWeatherData(url);
    };

    const fetchWeatherByCity = (city: string) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=zh_cn`;
      return fetchWeatherData(url);
    };
    
    const fetchWeather = async () => {
      try {
        // 尝试获取用户位置
        navigator.geolocation.getCurrentPosition(
          // 成功获取位置
          position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
          },
          // 获取位置失败，使用默认城市
          () => {
            console.log('位置获取失败，使用默认城市');
            fetchWeatherByCity('Beijing');
          },
          // 设置选项
          { timeout: 5000 }
        );
      } catch (err) {
        // 备用方案：完全失败时使用默认城市
        fetchWeatherByCity('Beijing');
      }
    };

    fetchWeather();
  }, [API_KEY]);

  const getWeatherIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'clear':
        return <FiSun className="text-yellow-400" size={24} />;
      case 'clouds':
        return <FiCloud className="text-gray-400" size={24} />;
      case 'rain':
        return <FiCloudRain className="text-blue-400" size={24} />;
      case 'snow':
        return <FiCloudSnow className="text-blue-200" size={24} />;
      case 'thunderstorm':
        return <FiCloudLightning className="text-purple-400" size={24} />;
      default:
        return <FiWind className="text-gray-400" size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-1 px-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-sm">
        <div className="animate-pulse">获取天气信息中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-1 px-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-sm">
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-1 px-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-sm">
      {weather && (
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {getWeatherIcon(weather.icon)}
          </div>
          <div className="font-medium">{weather.city}</div>
          <div>{weather.temp}°C</div>
          <div>{weather.weather}</div>
        </div>
      )}
    </div>
  );
};

export default Weather; 