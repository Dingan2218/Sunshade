"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ArrowDownLeft, Clock, MapPin, CircleDot, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { LocationSearchInput } from '@/components/SearchInput/LocationSearchInput';

function BusTimingsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const uiMode = (searchParams.get('mode') as 'tech' | 'normal') || 'tech';
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
        <main className={`results-main ${isTech ? 'tech' : 'normal'}`} style={{ overflowY: 'auto' }}>

            {/* Dynamic Results Sidebar */}
            <div className={`results-sidebar ${isTech ? 'tech' : 'normal'}`} style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>

                <button
                    onClick={() => router.back()}
                    className={isTech ? "tech-text" : ""}
                    style={{
                        background: isTech ? 'none' : '#fff',
                        border: 'none', color: isTech ? '#888' : '#000',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        cursor: 'pointer', marginBottom: isTech ? '48px' : '24px',
                        padding: isTech ? '0' : '10px 16px',
                        borderRadius: isTech ? '0' : '100px',
                        boxShadow: isTech ? 'none' : '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                >
                    {isTech ? <ArrowDownLeft size={14} /> : <ChevronLeft size={18} />}
                    {isTech ? 'Back' : 'Back'}
                </button>

                <div style={{ marginBottom: '32px' }}>
                    <div className={isTech ? "tech-text" : ""} style={{ marginBottom: isTech ? '16px' : '8px', color: isTech ? '#888' : '#666', fontSize: isTech ? '11px' : '12px' }}>
                        {isTech ? 'Route.Query // 01' : 'FIND BUS TIMINGS'}
                    </div>

                    <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="m-input-container" style={{ position: 'relative', marginBottom: isTech ? '16px' : '0' }}>
                            <div className="m-route-line" />
                            <LocationSearchInput
                                label={isTech ? "P01. Origin" : "Starting Location"}
                                value={inputFrom}
                                onChange={setInputFrom}
                                icon={CircleDot}
                                placeholder={isTech ? "CURRENT_LOCATION" : "Home"}
                                uiMode={uiMode}
                            />
                            <div className="m-divider" />
                            <LocationSearchInput
                                label={isTech ? "P02. Destination" : "Destination"}
                                value={inputTo}
                                onChange={setInputTo}
                                icon={MapPin}
                                placeholder={isTech ? "SEARCH_COORDINATES" : "Destination"}
                                uiMode={uiMode}
                            />
                        </div>
                        <button
                            type="submit"
                            className={isTech ? "n-button" : "normal-button"}
                            style={isTech ? { background: '#d8ff27', color: '#000', display: 'flex', justifyContent: 'center', gap: '8px' } : { background: '#007AFF', color: '#fff', display: 'flex', justifyContent: 'center', gap: '8px' }}
                        >
                            {isTech ? 'Search Buses' : 'Search Buses'}
                            <Search size={18} />
                        </button>
                    </form>

                    {urlFrom && urlTo && (
                        <h2 className={isTech ? "ndots" : ""} style={{
                            fontSize: isTech ? '28px' : '24px',
                            fontWeight: isTech ? 400 : 800,
                            color: isTech ? '#FFF' : '#000',
                            marginTop: '40px',
                            marginBottom: '16px',
                            lineHeight: 1.1,
                            textTransform: 'uppercase'
                        }}>
                            {urlFrom} TO {urlTo}
                        </h2>
                    )}
                </div>

                {error && (
                    <div style={{ color: 'red', marginBottom: '24px' }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {buses.length > 0 ? buses.map((bus, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={bus.id || idx}
                            className={isTech ? "diag-box" : ""}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '20px',
                                background: isTech ? '#0a0a0a' : '#fff',
                                border: isTech ? '1px solid #222' : 'none',
                                borderRadius: isTech ? '4px' : '16px',
                                boxShadow: isTech ? 'none' : '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <Clock size={16} color={isTech ? '#888' : '#007AFF'} />
                                    <span className={isTech ? "tech-text" : ""} style={{
                                        fontSize: isTech ? '14px' : '18px',
                                        fontWeight: 700,
                                        color: isTech ? '#fff' : '#000'
                                    }}>
                                        {bus.departure} {bus.arrival ? `- ${bus.arrival}` : ''}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
                                    <MapPin size={14} color={isTech ? '#666' : '#666'} />
                                    <span className={isTech ? "tech-text" : ""} style={{
                                        fontSize: isTech ? '11px' : '14px',
                                        color: isTech ? '#888' : '#666'
                                    }}>
                                        {bus.route || `${bus.source} to ${bus.destination}`}
                                    </span>
                                </div>

                                <div className={isTech ? "tech-text" : ""} style={{
                                    marginTop: '12px',
                                    fontSize: isTech ? '10px' : '12px',
                                    color: isTech ? '#666' : '#888',
                                    textTransform: 'uppercase'
                                }}>
                                    {bus.operator} • {bus.bus_type}
                                </div>
                            </div>

                            {bus.duration && (
                                <div className={isTech ? "tech-text" : ""} style={{
                                    background: isTech ? '#111' : '#f2f2f7',
                                    padding: '8px 12px',
                                    borderRadius: isTech ? '2px' : '100px',
                                    fontSize: isTech ? '10px' : '14px',
                                    color: isTech ? '#888' : '#666',
                                    fontWeight: 600
                                }}>
                                    {bus.duration}
                                </div>
                            )}
                        </motion.div>
                    )) : (
                        !loading && <div className={isTech ? "tech-text" : ""} style={{ color: isTech ? '#888' : '#666' }}>No buses found for this route.</div>
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
