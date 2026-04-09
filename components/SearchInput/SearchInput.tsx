import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SearchInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  placeholder?: string;
  type?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
  label, 
  value, 
  onChange, 
  icon: Icon, 
  placeholder,
  type = 'text'
}) => {
  return (
    <div className="floating-input-group">
      <label style={{ 
        display: 'block', 
        fontSize: '13px', 
        fontWeight: 600, 
        marginBottom: '8px',
        color: 'var(--text-secondary)',
        marginLeft: '4px'
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <Icon 
          size={20} 
          style={{ 
            position: 'absolute', 
            left: '16px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'var(--primary)',
            opacity: 0.8
          }} 
        />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="floating-input"
          placeholder={placeholder}
          style={{ paddingLeft: '48px' }}
        />
      </div>
    </div>
  );
};
