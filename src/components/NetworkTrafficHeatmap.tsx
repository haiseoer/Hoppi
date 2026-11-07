import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { AppTheme, ConnectedMeshDevice, TrafficHeatmapCell } from '../types';
import { Activity, Radio, Clock, Zap, RefreshCw, BarChart2, Info } from 'lucide-react';

interface NetworkTrafficHeatmapProps {
  theme?: AppTheme;
  devices?: ConnectedMeshDevice[];
  onSelectHour?: (hour: number) => void;
}

export const NetworkTrafficHeatmap: React.FC<NetworkTrafficHeatmapProps> = ({
  theme = 'cyberpunk',
  devices: propDevices,
  onSelectHour,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [activeMetric, setActiveMetric] = useState<'throughput' | 'packets' | 'latency'>('throughput');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'daytime' | 'night'>('all');
  const [hoveredCell, setHoveredCell] = useState<TrafficHeatmapCell | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Default device list if not provided
  const meshDevices = useMemo(() => {
    if (propDevices && propDevices.length > 0) return propDevices;
    return [
      { id: 'dev-server-home', name: 'Home Server 24/7 (Mini PC)', type: 'server' },
      { id: 'dev-macbook-master', name: 'MacBook Pro M3 Max', type: 'desktop' },
      { id: 'dev-iphone-master', name: 'iPhone 16 Pro Max', type: 'mobile' },
      { id: 'dev-ipad-living', name: 'iPad Pro M2 (Phòng khách)', type: 'tablet' },
    ];
  }, [propDevices]);

  // Generate realistic 24-hour historical traffic data for each device
  const [dataset, setDataset] = useState<TrafficHeatmapCell[]>(() => {
    const list: TrafficHeatmapCell[] = [];
    const devicesList = [
      { id: 'dev-server-home', name: 'Home Server 24/7' },
      { id: 'dev-macbook-master', name: 'MacBook Pro M3' },
      { id: 'dev-iphone-master', name: 'iPhone 16 Pro' },
      { id: 'dev-ipad-living', name: 'iPad Pro M2' },
    ];

    devicesList.forEach((dev) => {
      for (let h = 0; h < 24; h++) {
        // Base curves based on device archetype and time of day
        let baseThroughput = 50; // KB/s
        if (dev.id === 'dev-server-home') {
          // Home server runs 24/7 with steady background vector index + spikes at night (backup)
          baseThroughput = h >= 1 && h <= 4 ? 420 : 180 + Math.sin(h / 3) * 60;
        } else if (dev.id === 'dev-macbook-master') {
          // Peak daytime coding 09:00 - 18:00
          baseThroughput = h >= 9 && h <= 18 ? 340 + Math.sin(h) * 90 : 30;
        } else if (dev.id === 'dev-iphone-master') {
          // Peak morning 07:00 - 09:00 and evening 19:00 - 23:00
          baseThroughput = (h >= 7 && h <= 9) || (h >= 19 && h <= 23) ? 220 : 45;
        } else {
          // iPad living room ambient dashboard
          baseThroughput = h >= 10 && h <= 21 ? 95 : 15;
        }

        const trafficKBps = Math.round(Math.max(10, baseThroughput + (Math.random() * 40 - 20)));
        const packetCount = Math.round(trafficKBps * 8.5);
        const inboundKB = Math.round(trafficKBps * 0.65);
        const outboundKB = Math.round(trafficKBps * 0.35);
        const latencyMs = dev.id === 'dev-server-home' ? 2 : dev.id === 'dev-macbook-master' ? 8 : 16;
        const status: 'optimal' | 'busy' | 'spike' =
          trafficKBps > 380 ? 'spike' : trafficKBps > 180 ? 'busy' : 'optimal';

        list.push({
          deviceId: dev.id,
          deviceName: dev.name,
          hour: h,
          hourLabel: `${h.toString().padStart(2, '0')}:00`,
          trafficKBps,
          packetCount,
          inboundKB,
          outboundKB,
          latencyMs,
          status,
        });
      }
    });

    return list;
  });

  // Ticker for current hour live simulation updates
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      const currentHour = new Date().getHours();
      setDataset((prev) =>
        prev.map((cell) => {
          if (cell.hour === currentHour) {
            const delta = Math.floor(Math.random() * 25 - 12);
            const newTraffic = Math.max(15, cell.trafficKBps + delta);
            return {
              ...cell,
              trafficKBps: newTraffic,
              packetCount: Math.round(newTraffic * 8.5),
              status: newTraffic > 380 ? 'spike' : newTraffic > 180 ? 'busy' : 'optimal',
            };
          }
          return cell;
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Filtered hours
  const filteredHours = useMemo(() => {
    const all = Array.from({ length: 24 }, (_, i) => i);
    if (filterPeriod === 'daytime') {
      return all.filter((h) => h >= 7 && h <= 19);
    }
    if (filterPeriod === 'night') {
      return all.filter((h) => h < 7 || h > 19);
    }
    return all;
  }, [filterPeriod]);

  // D3 Rendering effect
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth || 700;
    const margin = { top: 32, right: 24, bottom: 45, left: 130 };
    const width = Math.max(480, containerWidth) - margin.left - margin.right;
    const height = 180 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const deviceNames = Array.from(new Set(dataset.map((d) => d.deviceName)));
    const hourLabels = filteredHours.map((h) => `${h.toString().padStart(2, '0')}:00`);

    // X scale (Hours)
    const x = d3.scaleBand().domain(hourLabels).range([0, width]).padding(0.08);

    // Y scale (Devices)
    const y = d3.scaleBand().domain(deviceNames).range([0, height]).padding(0.12);

    // Color Scale based on selected metric
    const maxVal = d3.max(dataset, (d) =>
      activeMetric === 'throughput' ? d.trafficKBps : activeMetric === 'packets' ? d.packetCount : d.latencyMs
    ) || 450;

    const minVal = d3.min(dataset, (d) =>
      activeMetric === 'throughput' ? d.trafficKBps : activeMetric === 'packets' ? d.packetCount : d.latencyMs
    ) || 10;

    // Custom aesthetic interpolators matching the app's cyberpunk / deepspace neon
    const colorScale = d3
      .scaleSequential()
      .domain([minVal, maxVal])
      .interpolator(
        theme === 'light'
          ? d3.interpolateBlues
          : theme === 'deepspace'
          ? (t) => d3.interpolateInferno(t * 0.85 + 0.1)
          : (t) => d3.interpolateViridis(t)
      );

    // X Axis
    const xAxis = g
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3.axisBottom(x).tickFormat((d, i) => {
          // Show every 2nd or 3rd hour label on compact view to prevent overlapping
          if (filteredHours.length > 16 && i % 2 !== 0) return '';
          return d;
        })
      );

    xAxis.select('.domain').attr('stroke', theme === 'light' ? '#cbd5e1' : '#334155');
    xAxis
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('fill', theme === 'light' ? '#475569' : '#94a3b8');

    // Y Axis
    const yAxis = g.append('g').call(d3.axisLeft(y));
    yAxis.select('.domain').attr('stroke', theme === 'light' ? '#cbd5e1' : '#334155');
    yAxis
      .selectAll('text')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', theme === 'light' ? '#1e293b' : '#e2e8f0');

    // Filtered data items to draw
    const visibleData = dataset.filter((d) => filteredHours.includes(d.hour));

    // Draw Heatmap Rectangles with D3 transitions
    const cells = g
      .selectAll('rect.heatmap-cell')
      .data(visibleData)
      .enter()
      .append('rect')
      .attr('class', 'heatmap-cell')
      .attr('x', (d) => x(d.hourLabel) || 0)
      .attr('y', (d) => y(d.deviceName) || 0)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('stroke', (d) =>
        selectedHour === d.hour
          ? '#22d3ee'
          : theme === 'light'
          ? 'rgba(255,255,255,0.7)'
          : 'rgba(15, 23, 42, 0.4)'
      )
      .attr('stroke-width', (d) => (selectedHour === d.hour ? 2 : 1))
      .attr('fill', (d) => {
        const val =
          activeMetric === 'throughput'
            ? d.trafficKBps
            : activeMetric === 'packets'
            ? d.packetCount
            : d.latencyMs;
        return colorScale(val);
      })
      .style('cursor', 'pointer')
      .style('transition', 'transform 0.15s ease, opacity 0.15s ease');

    // Interactivity: hover & click
    cells
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .attr('stroke', '#38bdf8')
          .attr('stroke-width', 2.5)
          .style('opacity', 1)
          .attr('transform', 'scale(1.05)');

        setHoveredCell(d);
      })
      .on('mouseleave', function (event, d) {
        d3.select(this)
          .attr('stroke', selectedHour === d.hour ? '#22d3ee' : theme === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(15, 23, 42, 0.4)')
          .attr('stroke-width', selectedHour === d.hour ? 2 : 1)
          .style('opacity', 0.95)
          .attr('transform', 'scale(1)');
      })
      .on('click', function (event, d) {
        setSelectedHour(d.hour);
        if (onSelectHour) onSelectHour(d.hour);
      });

    // Current hour pulse marker
    const currentHour = new Date().getHours();
    const currentHourLabel = `${currentHour.toString().padStart(2, '0')}:00`;
    if (x(currentHourLabel) !== undefined) {
      g.append('line')
        .attr('x1', (x(currentHourLabel) || 0) + x.bandwidth() / 2)
        .attr('x2', (x(currentHourLabel) || 0) + x.bandwidth() / 2)
        .attr('y1', -8)
        .attr('y2', height)
        .attr('stroke', '#22d3ee')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '3,3');

      g.append('text')
        .attr('x', (x(currentHourLabel) || 0) + x.bandwidth() / 2)
        .attr('y', -12)
        .attr('text-anchor', 'middle')
        .attr('font-size', '9px')
        .attr('font-weight', 'bold')
        .attr('fill', '#22d3ee')
        .text('NOW');
    }
  }, [dataset, filteredHours, activeMetric, theme, selectedHour, onSelectHour]);

  return (
    <div
      ref={containerRef}
      className={`w-full p-4 md:p-5 rounded-2xl border transition-all ${
        theme === 'light'
          ? 'bg-white border-slate-200 shadow-sm'
          : theme === 'deepspace'
          ? 'bg-[#090d15] border-neutral-800'
          : 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md'
      }`}
    >
      {/* Header with Title and Control Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3
              className={`text-sm font-bold flex items-center gap-2 ${
                theme === 'light' ? 'text-slate-900' : 'text-slate-100'
              }`}
            >
              <span>Mật Độ Lưu Lượng Mạng Mesh 24h</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-normal">
                D3.js Heatmap
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Cường độ truyền dữ liệu (Network Traffic Intensity) giữa 4 thiết bị Mesh trong 24 giờ qua
            </p>
          </div>
        </div>

        {/* Action Controls: Metrics & Period Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Metric Selector */}
          <div
            className={`flex items-center p-0.5 rounded-lg border text-xs ${
              theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800'
            }`}
          >
            <button
              onClick={() => setActiveMetric('throughput')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                activeMetric === 'throughput'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Throughput (KB/s)
            </button>
            <button
              onClick={() => setActiveMetric('packets')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                activeMetric === 'packets'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gói tin (Packets)
            </button>
          </div>

          {/* Timeframe Filter */}
          <div
            className={`flex items-center p-0.5 rounded-lg border text-xs ${
              theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800'
            }`}
          >
            <button
              onClick={() => setFilterPeriod('all')}
              className={`px-2 py-1 rounded text-[11px] transition-all cursor-pointer ${
                filterPeriod === 'all'
                  ? 'bg-indigo-500/20 text-indigo-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setFilterPeriod('daytime')}
              className={`px-2 py-1 rounded text-[11px] transition-all cursor-pointer ${
                filterPeriod === 'daytime'
                  ? 'bg-indigo-500/20 text-indigo-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ngày (07h-19h)
            </button>
            <button
              onClick={() => setFilterPeriod('night')}
              className={`px-2 py-1 rounded text-[11px] transition-all cursor-pointer ${
                filterPeriod === 'night'
                  ? 'bg-indigo-500/20 text-indigo-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Đêm (20h-06h)
            </button>
          </div>

          {/* Live Sim Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            title={isSimulating ? 'Tạm dừng mô phỏng dữ liệu live' : 'Bật luồng mô phỏng live'}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              isSimulating
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* D3 Heatmap Canvas Container */}
      <div className="mt-3 overflow-x-auto">
        <svg ref={svgRef} className="w-full" style={{ minWidth: '460px', height: '170px' }} />
      </div>

      {/* Heatmap Legend & Hovered Detail Bar */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Hovered cell insight */}
        {hoveredCell ? (
          <div className="flex items-center gap-3 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1.5 rounded-xl text-[11px]">
            <span className="font-semibold text-cyan-300">{hoveredCell.deviceName}</span>
            <span className="text-slate-400 font-mono">Lúc {hoveredCell.hourLabel}</span>
            <span className="text-emerald-400 font-mono font-bold">
              {hoveredCell.trafficKBps} KB/s ({hoveredCell.packetCount.toLocaleString()} pkts)
            </span>
            <span className="text-slate-400 text-[10px]">
              Vào: {hoveredCell.inboundKB} KB | Ra: {hoveredCell.outboundKB} KB | Ping: {hoveredCell.latencyMs}ms
            </span>
            <span
              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                hoveredCell.status === 'spike'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : hoveredCell.status === 'busy'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {hoveredCell.status === 'spike'
                ? 'ĐỈNH TẢI'
                : hoveredCell.status === 'busy'
                ? 'BẬN RỘN'
                : 'TỐI ƯU'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Rê chuột lên từng ô để xem chi tiết thông lượng, số gói tin và độ trễ theo từng giờ.</span>
          </div>
        )}

        {/* Color Intensity Scale Legend */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400 self-end md:self-center font-mono">
          <span>Thấp (&lt;50 KB/s)</span>
          <div className="w-24 h-2.5 rounded-full bg-gradient-to-r from-emerald-950 via-teal-600 to-yellow-300 border border-slate-700" />
          <span>Cao (&gt;400 KB/s)</span>
        </div>
      </div>
    </div>
  );
};
