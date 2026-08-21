/**
 * Live Real-time Weather Service for Saigon (Ho Chi Minh City)
 * Uses Open-Meteo Public Weather API (No API key needed, high reliability)
 */

const WMO_WEATHER_DESCRIPTIONS = {
  0: { day: 'TRỜI QUANG NẮNG', night: 'TRỜI QUANG MÁT', iconDay: 'fa-sun', iconNight: 'fa-moon' },
  1: { day: 'NẮNG NHẸ', night: 'ÍT MÂY MÁT MẺ', iconDay: 'fa-cloud-sun', iconNight: 'fa-cloud-moon' },
  2: { day: 'MÂY RẢI RÁC', night: 'MÂY RẢI RÁC', iconDay: 'fa-cloud-sun', iconNight: 'fa-cloud-moon' },
  3: { day: 'NHIỀU MÂY', night: 'NHIỀU MÂY', iconDay: 'fa-cloud', iconNight: 'fa-cloud' },
  45: { day: 'SƯƠNG MÙ NHẸ', night: 'SƯƠNG MÙ', iconDay: 'fa-smog', iconNight: 'fa-smog' },
  48: { day: 'SƯƠNG MÙ ĐỌNG', night: 'SƯƠNG MÙ', iconDay: 'fa-smog', iconNight: 'fa-smog' },
  51: { day: 'MƯA PHÙN NHẸ', night: 'MƯA PHÙN NHẸ', iconDay: 'fa-cloud-rain', iconNight: 'fa-cloud-rain' },
  53: { day: 'MƯA PHÙN', night: 'MƯA PHÙN', iconDay: 'fa-cloud-rain', iconNight: 'fa-cloud-rain' },
  55: { day: 'MƯA PHÙN DÀY', night: 'MƯA PHÙN', iconDay: 'fa-cloud-rain', iconNight: 'fa-cloud-rain' },
  61: { day: 'MƯA RÀO NHẸ', night: 'MƯA RÀO ĐÊM', iconDay: 'fa-cloud-showers-heavy', iconNight: 'fa-cloud-showers-heavy' },
  63: { day: 'MƯA VỪA', night: 'MƯA VỪA', iconDay: 'fa-cloud-showers-heavy', iconNight: 'fa-cloud-showers-heavy' },
  65: { day: 'MƯA TO', night: 'MƯA TO', iconDay: 'fa-cloud-showers-heavy', iconNight: 'fa-cloud-showers-heavy' },
  80: { day: 'MƯA RÀO TỪNG CƠN', night: 'MƯA RÀO TỪNG CƠN', iconDay: 'fa-cloud-showers-water', iconNight: 'fa-cloud-showers-water' },
  95: { day: 'CÓ DÔNG SẤM', night: 'CÓ DÔNG SẤM', iconDay: 'fa-cloud-bolt', iconNight: 'fa-cloud-bolt' },
};

let cachedWeather = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

export const fetchLiveWeather = async () => {
  const now = Date.now();
  if (cachedWeather && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedWeather;
  }

  try {
    // Coordinates for Saigon (10.8231, 106.6297)
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=10.8231&longitude=106.6297&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code&timezone=Asia%2FHo_Chi_Minh';
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API HTTP error');
    
    const data = await response.json();
    const current = data.current;
    
    const tempNum = Math.round(current.temperature_2m);
    const isDay = current.is_day === 1;
    const weatherCode = current.weather_code;
    
    const info = WMO_WEATHER_DESCRIPTIONS[weatherCode] || {
      day: 'NẮNG NHẸ',
      night: 'TRỜI MÁT',
      iconDay: 'fa-sun',
      iconNight: 'fa-moon'
    };

    const statusText = isDay ? info.day : info.night;
    const icon = isDay ? info.iconDay : info.iconNight;

    const weatherResult = {
      temp: `${tempNum}°C`,
      tempNum,
      statusText,
      fullTextLanding: `${tempNum}°C ${statusText} SÀI GÒN`,
      fullTextAdmin: `${tempNum}°C ${statusText}`,
      icon,
      isDay,
      humidity: `${current.relative_humidity_2m}%`,
      feelsLike: `${Math.round(current.apparent_temperature)}°C`,
      updatedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    cachedWeather = weatherResult;
    lastFetchTime = now;
    return weatherResult;
  } catch (err) {
    console.warn('Cannot fetch live weather, using time-based estimate:', err);
    // Fallback: estimate based on current hour in Vietnam
    const currentHour = new Date().getHours();
    const isNight = currentHour < 6 || currentHour >= 18;
    const fallbackTemp = isNight ? 26 : 31;
    
    return {
      temp: `${fallbackTemp}°C`,
      tempNum: fallbackTemp,
      statusText: isNight ? 'TRỜI MÁT MẺ' : 'NẮNG NHẸ',
      fullTextLanding: `${fallbackTemp}°C ${isNight ? 'TRỜI MÁT MẺ' : 'NẮNG NHẸ'} SÀI GÒN`,
      fullTextAdmin: `${fallbackTemp}°C ${isNight ? 'TRỜI MÁT MẺ' : 'NẮNG NHẸ'}`,
      icon: isNight ? 'fa-moon' : 'fa-sun',
      isDay: !isNight,
      humidity: '75%',
      feelsLike: `${fallbackTemp + 2}°C`,
      updatedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  }
};
