import React, { useState, useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { useDebounce } from 'use-debounce';

interface LocationSearchInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  placeholder?: string;
  autoFocus?: boolean;
  uiMode: 'tech' | 'normal';
}

export const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ 
  label, 
  value, 
  onChange, 
  icon: Icon, 
  placeholder,
  autoFocus,
  uiMode
}) => {
  const [query, setQuery] = useState(value);
  const [debouncedQuery] = useDebounce(query, 500);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== query) {
      setQuery(value);
    }
  }, [value]);

  useEffect(() => {
    if (debouncedQuery.length > 2 && debouncedQuery !== value) {
      // Prioritize Kerala, India: viewbox=74.85,8.29,77.41,12.82
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedQuery)}&limit=6&viewbox=74.85,12.82,77.41,8.29&bounded=0`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data);
        })
        .catch(err => console.error(err));
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (displayName: string) => {
    const parts = displayName.split(', ');
    const simpleName = parts.slice(0, 2).join(', ');
    setQuery(simpleName);
    onChange(simpleName);
    setSuggestions([]);
    setIsFocused(false);
  };

  const isTech = uiMode === 'tech';

  return (
    <div className={isTech ? "n-input-group" : ""} ref={wrapperRef} style={!isTech ? { marginBottom: '20px' } : {}}>
      <label className={isTech ? "n-label" : ""} style={!isTech ? { display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '8px' } : {}}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value === '') onChange('');
          }}
          onFocus={() => setIsFocused(true)}
          className={isTech ? "n-input" : "normal-input"}
          placeholder={placeholder}
          style={isTech ? { paddingRight: '40px' } : { paddingLeft: '44px' }}
          autoFocus={autoFocus}
        />
        {!isTech && (
          <Icon size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
        )}
        {isTech && (
          <Icon size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#333' }} />
        )}
        
        {isFocused && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: isTech ? 'rgba(10, 10, 10, 0.95)' : 'white',
            backdropFilter: isTech ? 'blur(20px)' : 'none',
            borderRadius: isTech ? '8px' : '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            zIndex: 100,
            marginTop: '8px',
            border: isTech ? '1px solid #333' : '1px solid #eee',
            overflow: 'hidden'
          }}>
            {suggestions.map((s, idx) => (
              <div 
                key={idx}
                onClick={() => handleSelect(s.display_name)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: idx < suggestions.length - 1 ? (isTech ? '1px solid #222' : '1px solid #eee') : 'none',
                  fontSize: '14px',
                  fontFamily: isTech ? 'var(--font-mono)' : 'inherit',
                  color: isTech ? '#fff' : '#000',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = isTech ? '#222' : '#f2f2f7'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {s.display_name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
