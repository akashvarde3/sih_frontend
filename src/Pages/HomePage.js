import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  BellRing,
  Bug,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  CloudSun,
  Clock,
  Map,
  Radio,
  Satellite,
  Smartphone,
  Sprout,
  ThermometerSun,
  Waves,
} from 'lucide-react';
import './HomePage.css';

const riskBadgeClass = (level) => {
  switch (level) {
    case 'High':
      return 'badge bg-danger-subtle text-danger-emphasis';
    case 'Medium':
      return 'badge bg-warning-subtle text-warning-emphasis';
    default:
      return 'badge bg-success-subtle text-success-emphasis';
  }
};

export default function HomePage() {
  const [weather, setWeather] = useState([]);
  const [pestModels, setPestModels] = useState([]);
  const [ndviSeries, setNdviSeries] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [alertPrefs, setAlertPrefs] = useState({ sms: true, push: true, email: false, quietHours: '22:00 - 05:00' });
  const [notificationQueue, setNotificationQueue] = useState([]);
  const [scheduledJobs, setScheduledJobs] = useState([]);
  const [mapLayers, setMapLayers] = useState({ ndvi: true, rainfall: false, pestRisk: true });

  useEffect(() => {
    // Simulate API integration for weather, pest risk models, and NDVI streams
    setWeather([
      { provider: 'IMD', temp: 32, feelsLike: 34, humidity: 62, rain: 4, summary: 'Scattered showers', icon: <CloudRain size={24} /> },
      { provider: 'OpenWeather', temp: 31, feelsLike: 33, humidity: 58, rain: 2, summary: 'Partly cloudy', icon: <CloudSun size={24} /> },
      { provider: 'Meteomatics', temp: 30, feelsLike: 31, humidity: 60, rain: 0, summary: 'Clear sky', icon: <ThermometerSun size={24} /> },
    ]);

    setPestModels([
      { name: 'Fall Armyworm (FAO)', risk: 'High', confidence: 0.82, window: '48h', triggers: ['Humidity >60%', 'Wind <15km/h'] },
      { name: 'Stem Borer', risk: 'Medium', confidence: 0.68, window: '72h', triggers: ['NDVI drop', 'Temp 28-32°C'] },
      { name: 'Rust Watch', risk: 'Low', confidence: 0.41, window: '96h', triggers: ['Dew risk low'] },
    ]);

    setScheduledJobs([
      { name: 'Weather ingest', cadence: 'Every 3h', status: 'Running', nextRun: '01:30 IST', type: 'Fetch + normalize' },
      { name: 'Pest inference', cadence: 'At 02:00 daily', status: 'Queued', nextRun: '02:00 IST', type: 'FAW + Rust models' },
      { name: 'NDVI ingestion', cadence: '10:00/16:00 IST', status: 'Running', nextRun: '16:00 IST', type: 'Sentinel-2 + Planet' },
    ]);

    setNdviSeries([
      { date: 'Today', ndvi: 0.74, health: 91, stress: 'None' },
      { date: 'Yesterday', ndvi: 0.71, health: 88, stress: 'Mild moisture stress' },
      { date: '3 days ago', ndvi: 0.65, health: 80, stress: 'Heat stress pockets' },
    ]);

    setAdvisories([
      {
        title: 'Irrigation advisory',
        content: '1 inch irrigation recommended within 24h; soil moisture deficit detected.',
        channel: 'Push + SMS',
        impact: 'Yield protection',
      },
      {
        title: 'Pest monitoring',
        content: 'Deploy pheromone traps in northern blocks; FAW risk flagged in model run.',
        channel: 'Push',
        impact: 'Pest suppression',
      },
      {
        title: 'Nutrient management',
        content: 'Foliar spray (Zn + B) suggested after forecasted rain event (48h).',
        channel: 'SMS',
        impact: 'Quality uplift',
      },
    ]);

    setNotificationQueue([
      { id: 1, type: 'SMS', message: 'Moisture stress alert for Plot A', window: 'Next 30m', priority: 'High' },
      { id: 2, type: 'Push', message: 'Pest scouting checklist ready', window: 'In 2h', priority: 'Normal' },
      { id: 3, type: 'SMS', message: 'Rain expected after 15:00, reschedule spraying', window: 'In 4h', priority: 'High' },
    ]);
  }, []);

  const healthAverage = useMemo(() => {
    if (!ndviSeries.length) return 0;
    return Math.round(ndviSeries.reduce((acc, s) => acc + s.health, 0) / ndviSeries.length);
  }, [ndviSeries]);

  const toggleLayer = (layer) => setMapLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));

  const updateAlertPref = (field) => setAlertPrefs((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <div className="home-bg py-4">
      <div className="container">
        <header className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between mb-4 gap-3">
          <div>
            <p className="text-uppercase fw-semibold text-success small mb-1">Integrated advisories</p>
            <h1 className="fw-bold mb-2">Weather, pests, satellite health — in one farmer view</h1>
            <p className="text-muted mb-0">
              Live API integrations, scheduled inferences, and alerting rails keep farmers informed via SMS and push.
            </p>
          </div>
          <div className="badge bg-success-subtle text-success-emphasis px-3 py-2 d-flex align-items-center gap-2">
            <Sprout size={20} />
            <span>FPO Control Room</span>
          </div>
        </header>

        <div className="row g-3 mb-3">
          {weather.map((w) => (
            <div className="col-12 col-md-4" key={w.provider}>
              <div className="card shadow-sm h-100 weather-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      {w.icon}
                      <h6 className="mb-0">{w.provider}</h6>
                    </div>
                    <span className="badge bg-light text-success fw-semibold">API live</span>
                  </div>
                  <div className="d-flex align-items-end gap-2">
                    <h2 className="fw-bold mb-0">{w.temp}°C</h2>
                    <span className="text-muted small">Feels {w.feelsLike}°C</span>
                  </div>
                  <div className="d-flex flex-wrap gap-3 mt-3 small text-muted">
                    <span className="d-flex align-items-center gap-1"><Waves size={16} /> Humidity {w.humidity}%</span>
                    <span className="d-flex align-items-center gap-1"><CloudRain size={16} /> Rain {w.rain} mm</span>
                  </div>
                  <p className="mb-0 mt-3 text-success fw-semibold">{w.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Bug size={20} className="text-danger" />
                    <h5 className="mb-0">Pest models</h5>
                  </div>
                  <span className="badge bg-light text-success fw-semibold">Scheduled inference</span>
                </div>
                <div className="row g-2">
                  {pestModels.map((m) => (
                    <div className="col-12 col-md-4" key={m.name}>
                      <div className="border rounded-3 p-3 h-100">
                        <div className="d-flex justify-content-between align-items-start">
                          <p className="fw-semibold mb-1">{m.name}</p>
                          <span className={riskBadgeClass(m.risk)}>{m.risk} risk</span>
                        </div>
                        <p className="small text-muted mb-2">Confidence {Math.round(m.confidence * 100)}%</p>
                        <p className="small text-muted mb-2">Next {m.window}</p>
                        <div className="small text-success">{m.triggers.join(' • ')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Radio size={20} className="text-primary" />
                    <h5 className="mb-0">Inference scheduler</h5>
                  </div>
                  <span className="badge bg-primary-subtle text-primary-emphasis">Cron + queues</span>
                </div>
                <ul className="list-unstyled mb-0">
                  {scheduledJobs.map((job) => (
                    <li className="mb-3" key={job.name}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="fw-semibold mb-0">{job.name}</p>
                          <p className="text-muted small mb-1">{job.type}</p>
                          <span className="badge bg-light text-secondary">{job.cadence}</span>
                        </div>
                        <div className="text-end">
                          <span className={`badge ${job.status === 'Running' ? 'bg-success-subtle text-success-emphasis' : 'bg-warning-subtle text-warning-emphasis'}`}>
                            {job.status}
                          </span>
                          <p className="small text-muted mb-0">Next: {job.nextRun}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-lg-7">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Satellite size={20} className="text-success" />
                    <h5 className="mb-0">Satellite / NDVI health</h5>
                  </div>
                  <span className="badge bg-success-subtle text-success-emphasis">{healthAverage}% avg health</span>
                </div>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <button className={`btn btn-sm ${mapLayers.ndvi ? 'btn-success' : 'btn-outline-success'}`} onClick={() => toggleLayer('ndvi')}>
                    NDVI overlay
                  </button>
                  <button className={`btn btn-sm ${mapLayers.rainfall ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => toggleLayer('rainfall')}>
                    Rainfall radar
                  </button>
                  <button className={`btn btn-sm ${mapLayers.pestRisk ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => toggleLayer('pestRisk')}>
                    Pest risk heatmap
                  </button>
                </div>
                <div className="map-overlay mb-3">
                  <div className="map-grid">
                    {mapLayers.ndvi && <span className="map-chip bg-success">NDVI</span>}
                    {mapLayers.rainfall && <span className="map-chip bg-primary">Rain</span>}
                    {mapLayers.pestRisk && <span className="map-chip bg-danger">Pest</span>}
                  </div>
                  <div className="map-legend">
                    <Map size={18} />
                    <span className="small text-muted">Layered overlays shown on farmer dashboard map</span>
                  </div>
                </div>
                <div className="row g-2">
                  {ndviSeries.map((row) => (
                    <div className="col-12 col-md-4" key={row.date}>
                      <div className="border rounded-3 p-3 h-100">
                        <p className="fw-semibold mb-1">{row.date}</p>
                        <p className="text-success mb-1">NDVI {row.ndvi}</p>
                        <p className="text-muted small mb-1">Health score {row.health}</p>
                        <div className="d-flex align-items-center gap-2 small">
                          {row.stress === 'None' ? <CheckCircle2 size={16} className="text-success" /> : <AlertTriangle size={16} className="text-warning" />}
                          <span className={row.stress === 'None' ? 'text-success' : 'text-warning'}>{row.stress}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Bell size={20} className="text-warning" />
                    <h5 className="mb-0">Advisory feed</h5>
                  </div>
                  <span className="badge bg-warning-subtle text-warning-emphasis">Farmer dashboard</span>
                </div>
                <div className="list-group list-group-flush">
                  {advisories.map((advisory) => (
                    <div className="list-group-item border-0 px-0" key={advisory.title}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="fw-semibold mb-1">{advisory.title}</p>
                          <p className="mb-2 text-muted small">{advisory.content}</p>
                          <span className="badge bg-light text-secondary">{advisory.channel}</span>
                        </div>
                        <span className="badge bg-success-subtle text-success-emphasis">{advisory.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <BellRing size={20} className="text-primary" />
                    <h5 className="mb-0">Alert preferences</h5>
                  </div>
                  <span className="badge bg-primary-subtle text-primary-emphasis">SMS / Push</span>
                </div>
                <div className="d-flex flex-wrap gap-3 mb-3">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="smsToggle" checked={alertPrefs.sms} onChange={() => updateAlertPref('sms')} />
                    <label className="form-check-label" htmlFor="smsToggle">SMS alerts</label>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="pushToggle" checked={alertPrefs.push} onChange={() => updateAlertPref('push')} />
                    <label className="form-check-label" htmlFor="pushToggle">Push notifications</label>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="emailToggle" checked={alertPrefs.email} onChange={() => updateAlertPref('email')} />
                    <label className="form-check-label" htmlFor="emailToggle">Email backup</label>
                  </div>
                </div>
                <div className="row g-2 mb-2">
                  <div className="col-12 col-md-6">
                    <label className="form-label small text-muted">Quiet hours</label>
                    <input type="text" className="form-control" value={alertPrefs.quietHours} onChange={(e) => setAlertPrefs((p) => ({ ...p, quietHours: e.target.value }))} />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small text-muted">Preferred language</label>
                    <select className="form-select">
                      <option>English</option>
                      <option>हिन्दी</option>
                      <option>मराठी</option>
                    </select>
                  </div>
                </div>
                <div className="p-3 rounded-3 bg-light d-flex align-items-center gap-3">
                  <Smartphone className="text-success" size={28} />
                  <div>
                    <p className="fw-semibold mb-0">Delivery rails ready</p>
                    <p className="small text-muted mb-0">Messages throttle inside quiet hours; push tokens validated nightly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <Clock size={20} className="text-secondary" />
                    <h5 className="mb-0">Notification scheduler</h5>
                  </div>
                  <span className="badge bg-secondary-subtle text-secondary-emphasis">Queue</span>
                </div>
                <ul className="list-group list-group-flush">
                  {notificationQueue.map((item) => (
                    <li className="list-group-item border-0 px-0" key={item.id}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="fw-semibold mb-1">{item.message}</p>
                          <p className="small text-muted mb-1">Window: {item.window}</p>
                          <span className={`badge ${item.type === 'SMS' ? 'bg-success-subtle text-success-emphasis' : 'bg-primary-subtle text-primary-emphasis'}`}>{item.type}</span>
                        </div>
                        <div className="text-end">
                          <span className={`badge ${item.priority === 'High' ? 'bg-danger-subtle text-danger-emphasis' : 'bg-light text-secondary'}`}>
                            {item.priority}
                          </span>
                          <p className="small text-muted mb-0">Ready to send</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body d-flex flex-wrap align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <CheckCircle2 size={20} className="text-success" />
              <div>
                <p className="fw-semibold mb-0">API health</p>
                <p className="small text-muted mb-0">Weather + satellite ingest running; pest models scheduled.</p>
              </div>
            </div>
            <div className="ms-auto d-flex flex-wrap gap-2">
              <span className="badge bg-success-subtle text-success-emphasis d-inline-flex align-items-center gap-1"><CloudSun size={16} /> Weather</span>
              <span className="badge bg-danger-subtle text-danger-emphasis d-inline-flex align-items-center gap-1"><Bug size={16} /> Pest</span>
              <span className="badge bg-success-subtle text-success-emphasis d-inline-flex align-items-center gap-1"><Satellite size={16} /> NDVI</span>
              <span className="badge bg-primary-subtle text-primary-emphasis d-inline-flex align-items-center gap-1"><Bell size={16} /> Alerts</span>
            </div>
            <button className="btn btn-success ms-auto d-flex align-items-center gap-2">
              View farmer dashboard <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
