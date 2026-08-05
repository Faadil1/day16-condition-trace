import React from 'react';

interface LabelProps {
  text: string;
  opacity: number;
}

export const Label: React.FC<LabelProps> = ({ text, opacity }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 72,
        left: 120,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        zIndex: 5,
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          width: 3,
          height: 28,
          background: '#B58A59',
          flexShrink: 0,
        }}
      />
      {/* Label text */}
      <div
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.22em',
          color: '#FFDCE8',
          textTransform: 'uppercase',
        }}
      >
        {text}
      </div>
    </div>
  );
};
