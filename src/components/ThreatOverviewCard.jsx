import React, { useEffect, useRef } from 'react';

export default function ThreatOverviewCard({ summary }) {
  const canvasRef = useRef(null);

  // Render animated glowing sine/cyber wave chart on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const renderWave = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      phase += 0.05;

      // Calculate dynamic wave points using multi-frequency sine wave
      const points = [];
      const numPoints = 28;
      for (let i = 0; i <= numPoints; i++) {
        const x = (width / numPoints) * i;
        const normalizedX = i / numPoints;
        // Wave math: combination of sine curves to create organic threat telemetry wave
        const yOffset = Math.sin(phase + normalizedX * 8) * 6 + 
                         Math.cos(phase * 0.7 + normalizedX * 14) * 4 + 
                         Math.sin(normalizedX * Math.PI) * -8;
        const y = height * 0.52 + yOffset;
        points.push({ x, y });
      }

      // Create glowing area gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(255, 0, 85, 0.45)');
      gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.15)');
      gradient.addColorStop(1, 'rgba(255, 0, 85, 0.0)');

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const xc = (points[i].x + points[i - 1].x) / 2;
        const yc = (points[i].y + points[i - 1].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw glowing top stroke line
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const xc = (points[i].x + points[i - 1].x) / 2;
        const yc = (points[i].y + points[i - 1].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
      }
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 12;
      ctx.stroke();

      // Draw active telemetry wave pulse dot at wave crest
      const pulseIdx = Math.floor((Math.sin(phase * 0.8) * 0.5 + 0.5) * (points.length - 1));
      const pulsePoint = points[pulseIdx];
      if (pulsePoint) {
        ctx.beginPath();
        ctx.arc(pulsePoint.x, pulsePoint.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 15;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [summary]);

  return (
    <div className="cyber-card">
      <div className="cyber-card-header">
        <div>
          <div className="cyber-title font-tech">
            THREAT OVERVIEW
          </div>
          <div className="cyber-subtitle font-sans">Real-time Summary</div>
        </div>
      </div>

      <div className="sparkline-container">
        <canvas ref={canvasRef} width={270} height={45} className="sparkline-canvas" />
      </div>

      <div className="metrics-grid font-sans">
        <div className="metric-item total-item">
          <div className="metric-label font-tech">TOTAL THREATS</div>
          <div className="metric-value font-mono">{summary.total.toLocaleString()}</div>
          <div className="metric-change red font-mono">
            ▲ 12.4%
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-label font-tech">HIGH</div>
          <div className="metric-value font-mono">{summary.high.toLocaleString()}</div>
          <div className="metric-change red font-mono">
            ▲ 15.3%
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-label font-tech">MEDIUM</div>
          <div className="metric-value font-mono">{summary.medium.toLocaleString()}</div>
          <div className="metric-change red font-mono">
            ▲ 3.2%
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-label font-tech">LOW</div>
          <div className="metric-value font-mono">{summary.low.toLocaleString()}</div>
          <div className="metric-change green font-mono">
            ▼ 1.1%
          </div>
        </div>
      </div>

      <style>{`
        .sparkline-container {
          margin: 4px 0 12px 0;
          background: rgba(4, 8, 18, 0.7);
          border-radius: 6px;
          padding: 4px;
          border: 1px solid rgba(255, 0, 85, 0.2);
          overflow: hidden;
        }

        .sparkline-canvas {
          width: 100%;
          height: 45px;
          display: block;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }

        .metric-item {
          display: flex;
          flex-direction: column;
        }

        .metric-label {
          font-size: 0.64rem;
          font-weight: 700;
          color: var(--text-secondary);
          letter-spacing: 0.5px;
        }

        .metric-value {
          font-size: 1.05rem;
          font-weight: 800;
          color: #ffffff;
          margin: 2px 0;
        }

        .metric-change {
          font-size: 0.62rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .metric-change.red {
          color: #ff3377;
        }

        .metric-change.green {
          color: #00ff9d;
        }
      `}</style>
    </div>
  );
}
