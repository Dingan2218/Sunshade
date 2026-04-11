"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ArrowDownLeft, Clock, MapPin, CircleDot, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { LocationSearchInput } from '@/components/SearchInput/LocationSearchInput';

function BusTimingsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const uiMode = (searchParams.get('mode') as 'tech' | 'normal') || 'normal';
    const isTech = uiMode === 'tech';

    const urlFrom = searchParams.get('from') || '';
    const urlTo = searchParams.get('to') || '';

    const [inputFrom, setInputFrom] = useState(urlFrom);
    const [inputTo, setInputTo] = useState(urlTo);

    const [buses, setBuses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isTech) document.body.classList.add('normal-mode');
        else document.body.classList.remove('normal-mode');
    }, [isTech]);

    // Update inputs if URL changes
    useEffect(() => {
        setInputFrom(urlFrom);
        setInputTo(urlTo);
    }, [urlFrom, urlTo]);

    useEffect(() => {
        if (urlFrom && urlTo) {
            setLoading(true);
            fetch(`/api/buses?from=${encodeURIComponent(urlFrom)}&to=${encodeURIComponent(urlTo)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.buses) {
                        setBuses(data.buses);
                    } else {
                        setError(data.error || 'Failed to fetch buses');
                    }
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [urlFrom, urlTo]);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (inputFrom && inputTo) {
            router.push(`/bus?from=${encodeURIComponent(inputFrom)}&to=${encodeURIComponent(inputTo)}&mode=${uiMode}`);
        }
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isTech ? '#000' : '#f2f2f7', color: isTech ? '#fff' : '#000' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className={isTech ? "ndots" : ""} style={{ fontSize: '24px', fontWeight: isTech ? 400 : 700, marginBottom: '24px' }}>
                        {isTech ? 'Querying Database...' : 'Finding buses...'}
                    </div>
                    <div className={isTech ? "tech-text" : ""} style={{ animation: 'pulse 2s infinite', fontSize: isTech ? '11px' : '14px' }}>
                        {isTech ? 'Connecting to local sqlite db' : 'Searching for routes'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className={`results-main ${isTech ? 'tech' : 'normal'}`} style={{ overflowY: 'auto', backgroundColor: isTech ? '#000' : '#fcfcfd' }}>

            <div className={isTech ? "results-sidebar tech" : "bus-container normal"} style={isTech ? { width: '100%', maxWidth: '800px', margin: '0 auto' } : {}}>

                <button
                    onClick={() => router.back()}
                    className={isTech ? "tech-text" : ""}
                    style={isTech ? {
                        background: 'none', border: 'none', color: '#888',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        cursor: 'pointer', marginBottom: '48px', padding: '0'
                    } : {
                        background: '#fff', border: '1px solid #eee', color: '#333',
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        cursor: 'pointer', marginBottom: '10px', padding: '10px 20px',
                        borderRadius: '100px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                        fontWeight: 600, fontSize: '14px', width: 'fit-content', transition: 'all 0.2s'
                    }}
                >
                    {isTech ? <ArrowDownLeft size={14} /> : <ChevronLeft size={18} />}
                    {isTech ? 'Back' : 'Back'}
                </button>

                <div className={!isTech ? "n-premium-card" : ""} style={!isTech ? { padding: '32px', marginBottom: '24px' } : { marginBottom: '32px' }}>
                    <div className={isTech ? "tech-text" : "normal-label"} style={isTech ? { marginBottom: '16px', color: '#888' } : { marginBottom: '24px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {isTech ? 'Route.Query // 01' : 'Search Routes'}
                    </div>

                    <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className={!isTech ? "" : "m-input-container"} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: isTech ? '16px' : '0' }}>
                            {isTech && <div className="m-route-line" />}
                            <LocationSearchInput
                                label={isTech ? "P01. Origin" : "Starting Location"}
                                value={inputFrom}
                                onChange={setInputFrom}
                                icon={CircleDot}
                                placeholder={isTech ? "CURRENT_LOCATION" : "Where from?"}
                                uiMode={uiMode}
                            />
                            {isTech && <div className="m-divider" />}
                            <LocationSearchInput
                                label={isTech ? "P02. Destination" : "Destination"}
                                value={inputTo}
                                onChange={setInputTo}
                                icon={MapPin}
                                placeholder={isTech ? "SEARCH_COORDINATES" : "Where to?"}
                                uiMode={uiMode}
                            />
                        </div>
                        <button
                            type="submit"
                            className={isTech ? "n-button" : "normal-button"}
                            style={isTech ? { background: '#d8ff27', color: '#000', marginTop: '10px' } : { marginTop: '10px' }}
                        >
                            {isTech ? 'Search Buses' : 'Find Buses'}
                            <Search size={isTech ? 18 : 20} />
                        </button>
                    </form>
                </div>

                {urlFrom && urlTo && (
                    <div style={{ marginBottom: '24px', padding: isTech ? '0' : '0 8px' }}>
                        <h2 className={isTech ? "ndots" : ""} style={{
                            fontSize: isTech ? '28px' : '28px',
                            fontWeight: isTech ? 400 : 800,
                            color: isTech ? '#FFF' : '#111',
                            margin: 0,
                            lineHeight: 1.2,
                            letterSpacing: isTech ? '0.05em' : '-0.02em',
                            textTransform: 'capitalize'
                        }}>
                            {urlFrom} <span style={{ color: isTech ? '#888' : '#007AFF' }}>→</span> {urlTo}
                        </h2>
                        {!isTech && <p style={{ color: '#666', marginTop: '8px', fontSize: '15px' }}>Showing all available buses for this route</p>}
                    </div>
                )}

                {error && (
                    <div style={{ padding: '16px', background: 'rgba(255,59,48,0.1)', color: '#ff3b30', borderRadius: '12px', marginBottom: '24px' }}>
                        {error}
                    </div>
                )}

                <div style={isTech ? { display: 'flex', flexDirection: 'column', gap: '16px' } : { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                    {buses.length > 0 ? buses.map((bus, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                            key={bus.id || idx}
                            className={isTech ? "diag-box" : "n-premium-card"}
                            style={isTech ? {
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '20px', background: '#0a0a0a', border: '1px solid #222', borderRadius: '4px'
                            } : {
                                display: 'flex', flexDirection: 'column', padding: '24px', cursor: 'pointer', transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={!isTech ? (e) => e.currentTarget.style.transform = 'translateY(-4px)' : undefined}
                            onMouseLeave={!isTech ? (e) => e.currentTarget.style.transform = 'translateY(0)' : undefined}
                        >
                            <div style={isTech ? {} : { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: isTech ? '8px' : '0' }}>
                                    <Clock size={isTech ? 16 : 20} color={isTech ? '#888' : '#007AFF'} />
                                    <span className={isTech ? "tech-text" : ""} style={{
                                        fontSize: isTech ? '14px' : '22px',
                                        fontWeight: 800,
                                        color: isTech ? '#fff' : '#111',
                                        letterSpacing: isTech ? '0.1em' : '-0.01em'
                                    }}>
                                        {bus.departure} {isTech && bus.arrival ? `- ${bus.arrival}` : ''}
                                    </span>
                                </div>
                                {!isTech && bus.duration && (
                                    <div style={{ background: '#f0f7ff', color: '#007AFF', padding: '6px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 600 }}>
                                        {bus.duration.split(' ')[0]} {bus.duration.split(' ')[1]}
                                    </div>
                                )}
                            </div>

                            <div style={isTech ? { display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 } : { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <MapPin size={14} color={isTech ? '#666' : '#888'} />
                                <span className={isTech ? "tech-text" : ""} style={{
                                    fontSize: isTech ? '11px' : '14px',
                                    color: isTech ? '#888' : '#666',
                                    fontWeight: isTech ? 'normal' : 500
                                }}>
                                    {bus.route || `${bus.source} to ${bus.destination}`}
                                </span>
                            </div>

                            <div style={isTech ? {} : { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                                <div className={isTech ? "tech-text" : ""} style={{
                                    marginTop: isTech ? '12px' : '0',
                                    fontSize: isTech ? '10px' : '13px',
                                    color: isTech ? '#666' : '#888',
                                    textTransform: isTech ? 'uppercase' : 'none',
                                    fontWeight: isTech ? 'normal' : 600
                                }}>
                                    <span style={{ color: isTech ? '#666' : '#444' }}>{bus.operator}</span> • {bus.bus_type}
                                </div>
                                {isTech && bus.duration && (
                                    <div className="tech-text" style={{
                                        background: '#111', padding: '8px 12px', borderRadius: '2px', color: '#888'
                                    }}>
                                        {bus.duration}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )) : (
                        !loading && <div className={isTech ? "tech-text" : ""} style={{ color: isTech ? '#888' : '#888', padding: '24px 0', fontSize: '16px' }}>No buses found for this route.</div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default function BusTimings() {
    return (
        <Suspense fallback={<div style={{ height: '100vh', background: '#000' }} />}>
            <BusTimingsContent />
        </Suspense>
    );
}
