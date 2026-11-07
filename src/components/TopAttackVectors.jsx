import React from 'react';
import { INITIAL_ATTACK_VECTORS } from '../utils/mockData';

export default function TopAttackVectors() {
  return (
    <div className="cyber-card">
      <div className="cyber-card-header">
        <div>
          <div className="cyber-title">TOP ATTACK VECTORS</div>
          <div className="cyber-subtitle">By Percentage</div>
        </div>
      </div>

      <div className="vectors-list">
        {INITIAL_ATTACK_VECTORS.map((vec) => (
          <div key={vec.name} className="vector-row">
            <div className="vector-label-col">
              <span className="vector-name">{vec.name}</span>
            </div>
            
            <div className="vector-bar-col">
              <div className="vector-track">
                <div 
                  className="vector-fill"
                  style={{ 
                    width: `${vec.percentage}%`,
                    backgroundColor: vec.color,
                    boxShadow: `0 0 8px ${vec.color}`
                  }}
                />
              </div>
            </div>

            <div className="vector-val-col">
              {vec.percentage}%
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .vectors-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 4px 0;
        }

        .vector-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .vector-label-col {
          width: 110px;
          flex-shrink: 0;
        }

        .vector-name {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          color: var(--text-secondary);
        }

        .vector-bar-col {
          flex: 1;
        }

        .vector-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 3px;
          overflow: hidden;
        }

        .vector-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.6s ease;
        }

        .vector-val-col {
          width: 42px;
          text-align: right;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
