import type { FeatureCollection } from "geojson";

export const SHIPPING_ROUTES: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Jakarta - Surabaya", id: "SR001" },
      geometry: { type: "LineString", coordinates: [[106.8, -6.1], [112.7, -7.2], [112.6, -7.5]] },
    },
    {
      type: "Feature",
      properties: { name: "Singapore - Jakarta", id: "SR002" },
      geometry: { type: "LineString", coordinates: [[103.8, 1.28], [104.0, 1.25], [106.8, -6.1]] },
    },
    {
      type: "Feature",
      properties: { name: "Belawan - Jakarta", id: "SR003" },
      geometry: { type: "LineString", coordinates: [[98.5, 3.8], [100.5, 2.5], [106.8, -6.1]] },
    },
    {
      type: "Feature",
      properties: { name: "Makassar - Bitung", id: "SR004" },
      geometry: { type: "LineString", coordinates: [[119.4, -5.1], [123.0, 1.4], [125.6, -1.5]] },
    },
    {
      type: "Feature",
      properties: { name: "Jakarta - Bali", id: "SR005" },
      geometry: { type: "LineString", coordinates: [[106.8, -6.1], [110.4, -7.0], [115.2, -8.7]] },
    },
  ],
};

export const EEZ_ZONES: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Indonesia EEZ - North", code: "IDN-N" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [95.0, 5.0], [141.0, 5.0], [141.0, -6.0], [95.0, -6.0], [95.0, 5.0]
        ]],
      },
    },
    {
      type: "Feature",
      properties: { name: "Indonesia EEZ - East", code: "IDN-E" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [125.0, -6.0], [141.0, -6.0], [141.0, -12.0], [125.0, -12.0], [125.0, -6.0]
        ]],
      },
    },
    {
      type: "Feature",
      properties: { name: "Indonesia EEZ - South", code: "IDN-S" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [95.0, -12.0], [141.0, -12.0], [141.0, -18.0], [95.0, -18.0], [95.0, -12.0]
        ]],
      },
    },
  ],
};

export const PORTS: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Tanjung Priok", country: "Indonesia" }, geometry: { type: "Point", coordinates: [106.88, -6.1] } },
    { type: "Feature", properties: { name: "Tanjung Perak", country: "Indonesia" }, geometry: { type: "Point", coordinates: [112.73, -7.2] } },
    { type: "Feature", properties: { name: "Belawan", country: "Indonesia" }, geometry: { type: "Point", coordinates: [98.47, 3.78] } },
    { type: "Feature", properties: { name: "Ujung Pandang", country: "Indonesia" }, geometry: { type: "Point", coordinates: [119.41, -5.14] } },
    { type: "Feature", properties: { name: "Bitung", country: "Indonesia" }, geometry: { type: "Point", coordinates: [125.59, -1.45] } },
    { type: "Feature", properties: { name: "Singapore Port", country: "Singapore" }, geometry: { type: "Point", coordinates: [103.85, 1.29] } },
    { type: "Feature", properties: { name: "Port Klang", country: "Malaysia" }, geometry: { type: "Point", coordinates: [101.39, 2.99] } },
    { type: "Feature", properties: { name: "Tanjung Pelepas", country: "Malaysia" }, geometry: { type: "Point", coordinates: [103.55, 1.36] } },
    { type: "Feature", properties: { name: "Laem Chabang", country: "Thailand" }, geometry: { type: "Point", coordinates: [100.88, 13.08] } },
    { type: "Feature", properties: { name: "Hong Kong", country: "Hong Kong" }, geometry: { type: "Point", coordinates: [114.17, 22.32] } },
  ],
};

export const ANOMALY_ZONES: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Suspicious Activity A1", level: "critical", type: "Illegal Fishing" }, geometry: { type: "Point", coordinates: [104.5, 0.5] } },
    { type: "Feature", properties: { name: "Loitering Vessel B2", level: "high", type: "Loitering" }, geometry: { type: "Point", coordinates: [108.0, -3.0] } },
    { type: "Feature", properties: { name: "Unauthorized Zone C3", level: "medium", type: "Zone Breach" }, geometry: { type: "Point", coordinates: [115.0, -5.5] } },
    { type: "Feature", properties: { name: "Dark Vessel D4", level: "critical", type: "AIS Off" }, geometry: { type: "Point", coordinates: [120.0, -2.0] } },
    { type: "Feature", properties: { name: "Rapid Maneuver E5", level: "high", type: "Suspicious Move" }, geometry: { type: "Point", coordinates: [106.0, 1.0] } },
    { type: "Feature", properties: { name: "Port Congestion F6", level: "medium", type: "Traffic" }, geometry: { type: "Point", coordinates: [106.9, -6.1] } },
    { type: "Feature", properties: { name: "OSINT: Bongkar Malam", level: "critical", type: "Social Anomaly", source: "OSINT" }, geometry: { type: "Point", coordinates: [106.885, -6.095] } },
  ],
};

export const MAP_LAYERS = [
  { id: "vessels", label: "Vessels", group: "Maritime", color: "#E67E22", defaultVisible: true },
  { id: "vessel-labels", label: "Vessel Labels", group: "Maritime", color: "#E67E22", defaultVisible: false },
  { id: "shipping-routes", label: "Shipping Routes", group: "Routes", color: "#3B82F6", defaultVisible: false },
  { id: "eez", label: "EEZ Boundaries", group: "Zones", color: "#8B5CF6", defaultVisible: false },
  { id: "ports", label: "Ports", group: "Infrastructure", color: "#06B6D4", defaultVisible: true },
  { id: "port-labels", label: "Port Labels", group: "Infrastructure", color: "#06B6D4", defaultVisible: false },
  { id: "anomaly-zones", label: "Anomaly Zones", group: "Security", color: "#DC2626", defaultVisible: true },
  { id: "anomaly-labels", label: "Anomaly Labels", group: "Security", color: "#DC2626", defaultVisible: false },
  { id: "tactical-alerts", label: "Tactical Alerts", group: "Security", color: "#EF4444", defaultVisible: true },
];