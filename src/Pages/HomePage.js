import React from 'react';
import {
  Activity,
  BarChart3,
  BellRing,
  CheckCircle2,
  Clock,
  Cloud,
  Database,
  Gauge,
  Map,
  Server,
  ToggleLeft,
  TrendingUp,
} from 'lucide-react';

const pipelineRows = [
  {
    title: 'मंडी / Market arrivals',
    cadence: 'Hourly ETL',
    freshness: '12m lag',
    status: 'healthy',
    notes: 'Auto-ingests mandi arrivals + price bands; deduplicates by mandi + commodity + date.',
  },
  {
    title: 'Wholesale & retail prices',
    cadence: 'Nightly ETL',
    freshness: 'Last run 1:00 AM',
    status: 'attention',
    notes: 'Merges mandi+retail feeds, normalizes UoM, triggers feature store refresh.',
  },
  {
    title: 'Imports / ports feed',
    cadence: 'Daily ETL',
    freshness: 'Last run 7:10 AM',
    status: 'healthy',
    notes: 'Customs feed → HS code → commodity map; pushes landed-cost features.',
  },
  {
    title: 'Forecast retraining',
    cadence: 'Weekly (Sun)',
    freshness: 'Next run in 2d',
    status: 'scheduled',
    notes: 'Prophet/LSTM refresh; exports horizon-wise metrics and alert bands.',
  },
];

const collectionCards = [
  {
    title: 'time_series_raw',
    icon: <Database size={24} className="text-success" />,
    meta: '65M rows | partitioned by state/date',
    detail: 'Raw mandi, retail, import and weather observations with source lineage.',
  },
  {
    title: 'feature_store',
    icon: <Gauge size={24} className="text-primary" />,
    meta: '11 feature groups',
    detail: 'Lag/rolling features for demand, arrivals, prices and cross-market spreads.',
  },
  {
    title: 'model_outputs',
    icon: <TrendingUp size={24} className="text-warning" />,
    meta: 'Forecasts + confidence bands',
    detail: '7, 14, 28-day horizons with P50/P90 bands and scenario deltas.',
  },
  {
    title: 'alerts',
    icon: <BellRing size={24} className="text-danger" />,
    meta: 'Threshold breaches',
    detail: 'Spike/drop detection with region tags, auto-routed to SMS/WhatsApp.',
  },
];

const endpointRows = [
  {
    label: 'GET /api/agg/price-curve',
    stack: 'FastAPI',
    desc: 'Median, P10, P90 price curves by commodity, mandi, and date range.',
  },
  {
    label: 'GET /api/agg/arrivals',
    stack: 'Django',
    desc: 'Tonnage arrivals aggregated by district/state with YoY deltas.',
  },
  {
    label: 'GET /api/model/forecast',
    stack: 'FastAPI',
    desc: 'Returns forecast vectors + confidence intervals + feature attributions.',
  },
  {
    label: 'POST /api/alerts/evaluate',
    stack: 'FastAPI',
    desc: 'Evaluates thresholds for mandi/commodity combos and creates alert tickets.',
  },
];

const dashboardWidgets = [
  {
    title: 'Price trajectory',
    description: 'Multi-commodity chart with mandi toggles and short/long horizon switch.',
    icon: <BarChart3 size={22} />,
  },
  {
    title: 'Scenario testing',
    description: 'Apply import shocks, rainfall deltas, or MSP changes; compare outcomes.',
    icon: <ToggleLeft size={22} />,
  },
  {
    title: 'Geo heatmap',
    description: 'Leaflet map overlays for arrivals, spreads, and alert clusters.',
    icon: <Map size={22} />,
  },
  {
    title: 'Alert thresholds',
    description: 'Set P90/P10 bands, volatility triggers, and regional override rules.',
    icon: <BellRing size={22} />,
  },
];

export default function HomePage() {
  return (
    <div className="bg-light py-4">
      <div className="container">
        <div className="mb-4 p-4 rounded-4 shadow-sm bg-white d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3 justify-content-between home-hero">
          <div>
            <div className="badge bg-success-subtle text-success fw-semibold mb-2">Agri Market Intelligence</div>
            <h1 className="fw-bold mb-2">Mandi ETL, Forecasting, and Dashboards</h1>
            <p className="text-muted mb-0">
              Unified view of mandi/market/import ETL pipelines, MongoDB collections, model outputs, API gateways, and React dashboards.
            </p>
          </div>
          <div className="d-flex gap-3 flex-wrap">
            <div className="stat-chip">
              <Activity className="text-success" size={20} />
              <div>
                <div className="small text-muted">Pipelines</div>
                <div className="fw-bold">4 ETL tracks</div>
              </div>
            </div>
            <div className="stat-chip">
              <Database className="text-primary" size={20} />
              <div>
                <div className="small text-muted">MongoDB</div>
                <div className="fw-bold">4 core collections</div>
              </div>
            </div>
            <div className="stat-chip">
              <Server className="text-warning" size={20} />
              <div>
                <div className="small text-muted">APIs</div>
                <div className="fw-bold">FastAPI + Django</div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-7">
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0 text-success">ETL & Training Pipelines</h5>
                  <Clock size={18} className="text-muted" />
                </div>
                <p className="text-muted small mb-3">
                  Ingestion across mandi arrivals, retail/wholesale prices, import manifests; weekly retraining refreshes forecasting models.
                </p>

                <div className="list-group list-group-flush">
                  {pipelineRows.map((row) => (
                    <div key={row.title} className="list-group-item px-0">
                      <div className="d-flex align-items-start justify-content-between">
                        <div>
                          <div className="fw-semibold">{row.title}</div>
                          <div className="text-muted small">{row.notes}</div>
                          <div className="d-flex gap-2 align-items-center mt-2">
                            <span className="badge bg-light text-success border">{row.cadence}</span>
                            <span className="badge bg-light text-muted border">{row.freshness}</span>
                            <span className={`status-pill status-${row.status}`}>{row.status}</span>
                          </div>
                        </div>
                        <div className="text-success">
                          <TrendingUp size={18} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0 text-success">API Surfaces</h5>
                  <Server size={18} className="text-muted" />
                </div>
                <p className="text-muted small mb-3">
                  FastAPI serves model & alert orchestration; Django aggregates historical stats for dashboards.
                </p>
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr className="text-muted small">
                        <th scope="col">Endpoint</th>
                        <th scope="col">Stack</th>
                        <th scope="col">What it returns</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpointRows.map((ep) => (
                        <tr key={ep.label}>
                          <td className="fw-semibold">{ep.label}</td>
                          <td>
                            <span className="badge bg-dark-subtle text-dark">{ep.stack}</span>
                          </td>
                          <td className="text-muted small">{ep.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0 text-success">MongoDB Collections</h5>
                  <Database size={18} className="text-muted" />
                </div>
                <p className="text-muted small mb-3">Time series, feature store, model outputs, and alert payloads.</p>
                <div className="row g-2">
                  {collectionCards.map((card) => (
                    <div className="col-12" key={card.title}>
                      <div className="collection-card p-3 border rounded-3 h-100">
                        <div className="d-flex align-items-start gap-3">
                          <div className="icon-circle">{card.icon}</div>
                          <div>
                            <div className="fw-semibold">{card.title}</div>
                            <div className="small text-muted">{card.meta}</div>
                            <div className="text-muted small mt-1">{card.detail}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0 text-success">Dashboards & UX</h5>
                  <Cloud size={18} className="text-muted" />
                </div>
                <p className="text-muted small mb-3">
                  React dashboards stitch together price curves, scenario toggles, alerts, and map views.
                </p>
                <div className="row g-2">
                  {dashboardWidgets.map((widget) => (
                    <div className="col-12" key={widget.title}>
                      <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-success-subtle text-success">
                        <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
                          {widget.icon}
                        </div>
                        <div>
                          <div className="fw-semibold text-success-emphasis">{widget.title}</div>
                          <div className="small text-success-emphasis">{widget.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0 text-success">Reliability signals</h5>
                  <CheckCircle2 size={18} className="text-muted" />
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  {["SLA monitoring", "Retry & DLQ", "Backfill ready", "Data quality rules"].map((item) => (
                    <span key={item} className="badge bg-light text-success border">{item}</span>
                  ))}
                </div>
                <p className="text-muted small mt-2 mb-0">
                  Pipelines emit metrics to Prometheus; alerts route via SMS/WhatsApp/email with incident IDs for on-call teams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
