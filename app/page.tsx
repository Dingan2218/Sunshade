"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Clock, Globe, ArrowUpRight, User, Settings } from 'lucide-react';
import { LocationSearchInput } from '@/components/SearchInput/LocationSearchInput';

const MapBackground = dynamic(() => import('@/components/MapView/DarkMapBackground'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const [uiMode, setUiMode] = useState<'tech' | 'normal'>('tech');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('2026-04-09');
  const [time, setTime] = useState('10:43');
  const [estimateDuration, setEstimateDuration] = useState(false);

  useEffect(() => {
    if (uiMode === 'normal') {
      document.body.classList.add('normal-mode');
    } else {
      document.body.classList.remove('normal-mode');
    }
  }, [uiMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    
    const params = new URLSearchParams({
      from,
      to,
      time: `${date}T${time}`,
      mode: uiMode
    });
    router.push(`/results?${params.toString()}`);
  };

  const isTech = uiMode === 'tech';

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: isTech ? '#000' : '#f2f2f7' }}>
      {/* Background Layer */}
      {isTech && <MapBackground />}

      {/* Mode Toggle Button */}
      <button 
        onClick={() => setUiMode(isTech ? 'normal' : 'tech')}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 100,
          background: isTech ? 'rgba(255,255,255,0.1)' : 'white',
          color: isTech ? 'white' : 'black',
          border: isTech ? '1px solid rgba(255,255,255,0.1)' : 'none',
          borderRadius: '50px',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          boxShadow: isTech ? 'none' : '0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        {isTech ? <User size={16} /> : <Settings size={16} />}
        {isTech ? 'SWITCH TO NORMAL' : 'SWITCH TO TECH'}
      </button>

      {/* Sidebar / Form Container */}
      <div 
        className={isTech ? "n-glass-sidebar" : ""} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: isTech ? '420px' : '100%',
          zIndex: 10,
          padding: isTech ? '60px 40px' : '40px',
          display: 'flex',
          justifyContent: isTech ? 'flex-start' : 'center',
          alignItems: isTech ? 'flex-start' : 'center',
          overflowY: 'auto'
        }}
      >
        <div style={{ 
          width: '100%',
          maxWidth: isTech ? '420px' : '500px',
          padding: isTech ? '0' : '48px',
          background: isTech ? 'transparent' : 'white',
          borderRadius: isTech ? '0' : '32px',
          boxShadow: isTech ? 'none' : '0 25px 50px -12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: isTech ? '48px' : '40px', textAlign: isTech ? 'left' : 'center' }}>
            <div className={isTech ? "ndots" : ""} style={{ 
              fontSize: isTech ? '32px' : '40px', 
              fontWeight: isTech ? 400 : 900,
              letterSpacing: isTech ? '0.05em' : '-0.02em',
              marginBottom: '8px', 
              color: isTech ? '#fff' : '#000' 
            }}>
              ShadeSeat
            </div>
            <p className={isTech ? "tech-text" : ""} style={{ 
              fontSize: isTech ? '11px' : '17px', 
              color: isTech ? '#888' : '#666',
              fontWeight: isTech ? 400 : 500,
              lineHeight: 1.5
            }}>
              {isTech ? 'V.03 // Diagnostic Intelligence' : 'Find the best seat for your journey.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: isTech ? '32px' : '24px' }}>
            
            <LocationSearchInput 
              label={isTech ? "P01. Origin" : "Starting Location"}
              value={from}
              onChange={setFrom}
              icon={MapPin}
              placeholder={isTech ? "CURRENT_LOCATION" : "Enter starting city"}
              uiMode={uiMode}
            />

            <LocationSearchInput 
              label={isTech ? "P02. Destination" : "Destination"}
              value={to}
              onChange={setTo}
              icon={Navigation}
              placeholder={isTech ? "SEARCH_COORDINATES" : "Where are you going?"}
              uiMode={uiMode}
            />

            {isTech && <div className="diag-line" style={{ margin: '8px 0' }} />}

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label className={isTech ? "n-label" : "normal-label"}>
                  {isTech ? "System.Date" : "Travel Date"}
                </label>
                <input 
                  type="date" 
                  className={isTech ? "n-input" : "normal-input"} 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                  style={isTech ? { colorScheme: 'dark' } : {}}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className={isTech ? "n-label" : "normal-label"}>
                  {isTech ? "System.Time" : "Travel Time"}
                </label>
                <input 
                  type="time" 
                  className={isTech ? "n-input" : "normal-input"} 
                  value={time} 
                  onChange={e => setTime(e.target.value)} 
                  style={isTech ? { colorScheme: 'dark' } : {}}
                />
              </div>
            </div>

            <div className={isTech ? "diag-box" : ""} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: isTech ? '12px' : '10px 16px',
              borderRadius: isTech ? '4px' : '16px',
              backgroundColor: isTech ? 'transparent' : '#f8f9fa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isTech ? <div className="n-status-live" /> : <Clock size={18} color="#007AFF" />}
                <span className={isTech ? "tech-text" : ""} style={{ color: isTech ? '#fff' : '#1c1c1e', fontWeight: isTech ? 400 : 600, fontSize: '14px' }}>
                  {isTech ? 'Auto.Detection' : 'Live Tracking'}
                </span>
              </div>
              <label className="n-switch">
                <input type="checkbox" checked={estimateDuration} onChange={e => setEstimateDuration(e.target.checked)} />
                <span className="n-slider" style={!isTech ? { background: estimateDuration ? '#34C759' : '#e5e5ea' } : {}}></span>
              </label>
            </div>

            <div style={{ marginTop: isTech ? 'auto' : '16px', paddingTop: isTech ? '40px' : '0' }}>
              <button type="submit" className={isTech ? "n-button" : "normal-button"}>
                {isTech ? 'Run Calculation' : 'Find Best Seat'}
                {isTech && <ArrowUpRight size={18} />}
              </button>
              
              {isTech && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                  <div className="tech-text">Lat: 52.2297</div>
                  <div className="tech-text">Lon: 21.0122</div>
                </div>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
