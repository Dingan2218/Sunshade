"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, Sun, Shield, Info, Map as MapIcon, Compass, CloudRain, ArrowDownLeft, Activity, Thermometer, Wind } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouteData } from '@/hooks/useRouteData';
import { useSunPosition, Recommendation } from '@/hooks/useSunPosition';
import { useWeather, WeatherData } from '@/hooks/useWeather';
import { motion, AnimatePresence } from 'framer-motion';

const ShadeMap = dynamic(() => import('@/components/MapView/ShadeMap'), { 
  ssr: false,
  loading: () => <div style={{ height: '100%', width: '100%', backgroundColor: '#000' }} />
});

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uiMode = searchParams.get('mode') || 'tech';
  const isTech = uiMode === 'tech';
  
  const { fetchRoute, loading: routeLoading, error: routeError } = useRouteData();
  const { getRecommendation } = useSunPosition();
  const { fetchWeather } = useWeather();

  const [route, setRoute] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const timeStr = searchParams.get('time');

    if (from && to) {
      fetchRoute(from, to).then(async data => {
        if (data) {
          setRoute(data);
          const time = timeStr ? new Date(timeStr) : new Date();
          const rec = getRecommendation(data.path, time);
          setRecommendation(rec);

          const w = await fetchWeather(data.end.lat, data.end.lon);
          setWeather(w);
        }
      });
    }

    if (!isTech) document.body.classList.add('normal-mode');
    else document.body.classList.remove('normal-mode');
  }, [searchParams, isTech]);

  if (routeLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isTech ? '#000' : '#f2f2f7', color: isTech ? '#fff' : '#000' }}>
        <div style={{ textAlign: 'center' }}>
          <div className={isTech ? "ndots" : ""} style={{ fontSize: '24px', fontWeight: isTech ? 400 : 700, marginBottom: '24px' }}>
            {isTech ? 'Processing...' : 'Finding your seat...'}
          </div>
          <div className={isTech ? "tech-text" : ""} style={{ animation: 'pulse 2s infinite', fontSize: isTech ? '11px' : '14px' }}>
            {isTech ? 'Analyzing Solar Coordinates' : 'Comparing route with sun position'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className={`results-main ${isTech ? 'tech' : 'normal'}`}>
      
      {/* Dynamic Results Sidebar */}
      <div className={`results-sidebar ${isTech ? 'tech' : 'normal'}`}>
        
        <button 
          onClick={() => router.push('/')}
          className={isTech ? "tech-text" : ""}
          style={{ 
            background: isTech ? 'none' : '#f2f2f7', 
            border: 'none', color: isTech ? '#888' : '#000',
            display: 'flex', alignItems: 'center', gap: '8px', 
            cursor: 'pointer', marginBottom: isTech ? '48px' : '0',
            padding: isTech ? '0' : '10px 16px',
            borderRadius: isTech ? '0' : '100px',
            marginRight: isTech ? '0' : '20px'
          }}
        >
          {isTech ? <ArrowDownLeft size={14} /> : <ChevronLeft size={18} />} 
          {isTech ? 'Back to Terminal' : 'Back'}
        </button>

        <AnimatePresence mode="wait">
          {recommendation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ flex: 1, display: isTech ? 'block' : 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', flexDirection: isTech ? 'column' : 'row', alignItems: isTech ? 'flex-start' : 'center', gap: isTech ? '0' : '24px' }}>
                <div>
                  <div className={isTech ? "tech-text" : ""} style={{ marginBottom: isTech ? '8px' : '0', color: isTech ? '#888' : '#666', fontSize: isTech ? '11px' : '12px' }}>
                    {isTech ? 'Analysis.Result // 01' : 'OUR RECOMMENDATION'}
                  </div>
                  <h2 className={isTech ? "ndots" : ""} style={{ 
                    fontSize: isTech ? '28px' : '24px', 
                    fontWeight: isTech ? 400 : 800,
                    color: isTech ? '#FFF' : '#000', 
                    marginBottom: isTech ? '40px' : '0',
                    lineHeight: 1.1 
                  }}>
                    {isTech ? `Optimal: ${recommendation.side} side` : `Sit on the ${recommendation.side.toUpperCase()} side`}
                  </h2>
                </div>

                {/* Status Indicator */}
                <div 
                  className={isTech ? "diag-box" : ""} 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px',
                    marginBottom: isTech ? '48px' : '0',
                    padding: isTech ? '12px' : '8px 16px',
                    background: isTech ? 'transparent' : 'rgba(52, 199, 89, 0.1)',
                    borderRadius: isTech ? '4px' : '100px',
                    border: isTech ? '1px solid #333' : 'none',
                  }}
                >
                  <div style={{ 
                    width: isTech ? '32px' : '24px', 
                    height: isTech ? '32px' : '24px', 
                    borderRadius: '50%', 
                    background: isTech ? '#111' : '#34C759', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}>
                     {recommendation.side === 'left' ? <Shield size={14} color="#fff" /> : <Sun size={14} color="#fff" />}
                  </div>
                  <div>
                    {!isTech && <span style={{ fontWeight: 700, color: '#34C759' }}>{recommendation.confidence}% Clear</span>}
                    {isTech && <div className="tech-text" style={{ color: '#fff' }}>Confidence: {recommendation.confidence}%</div>}
                  </div>
                </div>
              </div>

              {/* Wireframe Bus Viz (Tech Only) */}
              {isTech && (
                <div className="diag-box" style={{ padding: '32px', marginBottom: '48px', position: 'relative', background: '#050505' }}>
                  <div className="tech-text" style={{ fontSize: '9px', position: 'absolute', top: '10px', left: '10px' }}>Visual.Model.01x</div>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', height: '140px' }}>
                    <svg width="60" height="120" viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="5" y="5" width="50" height="110" rx="2" stroke="#333" strokeWidth="1" />
                      {[25, 45, 65, 85, 105].map(y => (
                        <g key={y}>
                          <rect x="10" y={y} width="12" height="10" 
                            stroke={recommendation.side === 'left' ? '#fff' : '#222'} 
                            fill={recommendation.side === 'left' ? '#fff' : 'transparent'} 
                          />
                          <rect x="38" y={y} width="12" height="10" 
                            stroke={recommendation.side === 'right' ? '#fff' : '#222'} 
                            fill={recommendation.side === 'right' ? '#fff' : 'transparent'} 
                          />
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              )}

              {/* Weather & Info (Normal Only Inline) */}
              {!isTech && weather && (
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f2f2f7', padding: '8px 16px', borderRadius: '100px' }}>
                    <Thermometer size={16} color="#FF9500" />
                    <span style={{ fontWeight: 600 }}>{Math.round(weather.temperature)}°C</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f2f2f7', padding: '8px 16px', borderRadius: '100px' }}>
                    <CloudRain size={16} color="#007AFF" />
                    <span style={{ fontWeight: 600 }}>{weather.precipitationProbability}%</span>
                  </div>
                </div>
              )}

              {/* Tech Stats Grid */}
              {isTech && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#111', border: '1px solid #111' }}>
                  <div style={{ padding: '16px', background: '#000' }}>
                    <div className="tech-text">Heading</div>
                    <div className="tech-text" style={{ color: '#fff', marginTop: '4px' }}>{Math.round(recommendation.routeBearing)}°</div>
                  </div>
                  <div style={{ padding: '16px', background: '#000' }}>
                    <div className="tech-text">Distance</div>
                    <div className="tech-text" style={{ color: '#fff', marginTop: '4px' }}>{(route.distance / 1000).toFixed(1)}km</div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map Layer */}
      <div style={{ flex: 1, position: 'relative' }}>
         <ShadeMap route={route?.path} />
      </div>

    </main>
  );
}

export default function Results() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', background: '#000' }} />}>
      <ResultsContent />
    </Suspense>
  );
}
