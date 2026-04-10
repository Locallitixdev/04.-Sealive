"use client";

import React, { useRef, useCallback, useState, useEffect, useMemo, Fragment } from "react";
import Map, { Source, Layer, NavigationControl, ScaleControl, Popup } from "react-map-gl/maplibre";
import { X } from "lucide-react";
import type { MapRef, LayerProps } from "react-map-gl/maplibre";
import type { FeatureCollection } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import { SHIPPING_ROUTES, EEZ_ZONES, PORTS, ANOMALY_ZONES, MAP_LAYERS } from "./mapData";

interface MapViewProps {
  onVesselSelect?: (vessel: VesselProperties | null) => void;
  selectedVesselId?: string | null;
  layerVisibility?: Record<string, boolean>;
  onLayerChange?: (layerId: string, visible: boolean) => void;
  centerTrigger?: number;
  playbackState?: { 
    vesselId: string, 
    coord: [number, number], 
    nextCoord?: [number, number], 
    heading: number,
    speed?: number
  } | null;
  playbackTrack?: any[];
  livePositions?: Record<string, { latitude: number, longitude: number, heading: number, speed: number, timestamp: string, mmsi: string }>;
  sourceFilter?: string;
}

// ─── Base Map Styles (OpenFreeMap) ───
const BASE_MAP_STYLES = [
  { id: "dark", label: "Dark", url: "https://tiles.openfreemap.org/styles/dark" },
  { id: "positron", label: "Light", url: "https://tiles.openfreemap.org/styles/positron" },
  { id: "bright", label: "Bright", url: "https://tiles.openfreemap.org/styles/liberty" },
];

// ─── Initial viewport: Indonesia maritime region ───
const INITIAL_VIEW = {
  longitude: 117.5,
  latitude: -2.5,
  zoom: 4.5,
  pitch: 0,
  bearing: 0,
};

// ─── Vessel Types & Colors ───
const VESSEL_COLORS: Record<string, string> = {
  Cargo: "#E67E22",
  Tanker: "#3B82F6",
  Fishing: "#059669",
  Passenger: "#8B5CF6",
  Tug: "#06B6D4",
  Yacht: "#10B981",
  "Superyacht & Megayacht": "#F59E0B",
  "Luxury Cruise Ship": "#EC4899",
  default: "#6B7280",
};

const ACTIVE_VESSEL_LAYERS = Object.keys(VESSEL_COLORS)
  .filter(type => type !== "default")
  .map(type => `vessels-marker-${type.replace(/[^a-zA-Z0-9]/g, '-')}`);

const EMPTY_LAYERS: string[] = [];

import mockVesselsData from "./mockVessels.json";

// ─── Mock Vessel GeoJSON Data ───
export const MOCK_VESSEL_GEOJSON = mockVesselsData as FeatureCollection;

// ─── Vessel Layer Style (triangle marker) ───
const vesselMarkerLayer: LayerProps = {
  id: "vessels-marker",
  type: "symbol",
  layout: {
    "icon-image": "triangle-marker",
    "icon-size": [
      "interpolate", ["linear"], ["zoom"],
      3, 0.4,
      6, 0.7,
      10, 1,
    ],
    "icon-rotate": ["get", "heading"],
    "icon-rotation-alignment": "map",
    "icon-allow-overlap": true,
  },
  paint: {
    "icon-color": [
      "match", ["get", "type"],
      "Cargo", VESSEL_COLORS.Cargo,
      "Tanker", VESSEL_COLORS.Tanker,
      "Fishing", VESSEL_COLORS.Fishing,
      "Passenger", VESSEL_COLORS.Passenger,
      "Tug", VESSEL_COLORS.Tug,
      "Yacht", VESSEL_COLORS.Yacht,
      "Superyacht & Megayacht", VESSEL_COLORS["Superyacht & Megayacht"],
      "Luxury Cruise Ship", VESSEL_COLORS["Luxury Cruise Ship"],
      VESSEL_COLORS.default,
    ],
  },
};

// ─── Vessel Label Layer ───
const vesselLabelLayer: LayerProps = {
  id: "vessels-label",
  type: "symbol",
  minzoom: 7,
  layout: {
    "text-field": ["get", "name"],
    "text-size": 10,
    "text-offset": [0, 1.5],
    "text-anchor": "top",
    "text-font": ["Open Sans Regular"],
  },
  paint: {
    "text-color": "#D1D5DB",
    "text-halo-color": "#0C0E14",
    "text-halo-width": 1,
  },
};

// ─── Vessel Feature type ───
interface VesselProperties {
  id: string;
  name: string;
  flag: string;
  type: string;
  status: string;
  speed: number;
  heading: number;
  mmsi: string;
  imo: string;
  lastUpdate: string;
  lastUpdateUtc?: string;
  signalQuality?: string;
  origin?: string;
  destination?: string;
  eta?: string;
  track?: any[];
  historyLog?: string;
  source?: string;
  riskStatus?: string;
}


export default function MapView({ onVesselSelect, selectedVesselId, layerVisibility = {}, onLayerChange, centerTrigger, playbackState, playbackTrack, livePositions = {}, sourceFilter = "ALL" }: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const [cursor, setCursor] = useState("grab");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapStyleLoaded, setMapStyleLoaded] = useState(false);
  const [mapStyleId, setMapStyleId] = useState("positron");
  
  const [animatedCoord, setAnimatedCoord] = useState<[number, number] | null>(null);

  // Handle smooth linear interpolation between coordinates
  useEffect(() => {
    if (!playbackState?.nextCoord || !playbackState?.speed) {
      setAnimatedCoord(null);
      return;
    }

    let frameId: number;
    let startTime = performance.now();
    const durationMs = 4000 / playbackState.speed;
    const [startLon, startLat] = playbackState.coord;
    const [endLon, endLat] = playbackState.nextCoord;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      const currentLon = startLon + (endLon - startLon) * progress;
      const currentLat = startLat + (endLat - startLat) * progress;

      setAnimatedCoord([currentLon, currentLat]);
      
      // Pan camera continuously and ultra-smooth without Mapbox internal animation
      if (mapRef.current) {
        mapRef.current.panTo([currentLon, currentLat], { duration: 0 });
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [playbackState]);

  const geojsonData = useMemo(() => {
    let baseFeatures = (MOCK_VESSEL_GEOJSON.features as any[]).map((f, i) => {
      return {
        ...f,
        properties: {
          ...f.properties,
          source: i % 4 === 0 ? "SATELLITE" : "AIS"
        }
      };
    });

    if (sourceFilter !== "ALL") {
      baseFeatures = baseFeatures.filter((f: any) => f.properties.source === sourceFilter);
    }

    if (Object.keys(livePositions).length > 0 && !playbackState) {
      return {
        ...MOCK_VESSEL_GEOJSON,
        features: baseFeatures.map((f: any) => {
          const livePos = livePositions[f.properties?.mmsi];
          if (livePos) {
            return {
              ...f,
              geometry: {
                ...f.geometry,
                type: "Point",
                coordinates: [livePos.longitude, livePos.latitude],
              },
              properties: {
                ...f.properties,
                speed: livePos.speed,
                heading: livePos.heading,
                lastUpdate: livePos.timestamp,
              },
            };
          }
          return f;
        }),
      } as FeatureCollection;
    }
    
    if (!playbackState) return { ...MOCK_VESSEL_GEOJSON, features: baseFeatures } as any;
    
    return {
      ...MOCK_VESSEL_GEOJSON,
      features: baseFeatures.map((f: any) => {
        if (f.properties?.id === playbackState.vesselId) {
          return {
            ...f,
            geometry: {
              ...f.geometry,
              type: "Point",
              coordinates: animatedCoord || playbackState.coord
            },
            properties: {
              ...f.properties,
              heading: playbackState.heading
            }
          };
        }
        return f;
      })
    } as any;
  }, [playbackState, animatedCoord, livePositions, sourceFilter]);
  
  // Initialize layers from props
  const [layers, setLayers] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    MAP_LAYERS.forEach((l) => {
      initial[l.id] = l.defaultVisible;
    });
    return initial;
  });

  // Sync layerVisibility prop to internal state (after map loads and style ready)
  useEffect(() => {
    if (mapLoaded && mapStyleLoaded && Object.keys(layerVisibility).length > 0) {
      setLayers(layerVisibility);
    }
  }, [layerVisibility, mapLoaded, mapStyleLoaded]);

  // Sync selected vessel state with camera & popup
  useEffect(() => {
    if (!mapLoaded || !mapStyleLoaded || !mapRef.current) return;

    if (playbackState && !playbackState.nextCoord) {
       // if there is no next coord (e.g. paused / jumping to a frame), just position
       mapRef.current.panTo(playbackState.coord, { duration: 400 });
    } else if (selectedVesselId && !playbackState) {
      const feature = MOCK_VESSEL_GEOJSON.features.find((f) => f.properties?.id === selectedVesselId);
      if (feature && feature.geometry.type === "Point") {
        const [longitude, latitude] = feature.geometry.coordinates;
        
        mapRef.current.flyTo({
          center: [longitude, latitude],
          zoom: Math.max(mapRef.current.getZoom(), 12), // Focus closer to vessel
          duration: 1200, // Smooth 1.2s travel
        });
      }
    } else {
      // Center map
      mapRef.current.flyTo({
        center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude],
        zoom: INITIAL_VIEW.zoom,
        duration: 1200,
      });
    }
  }, [selectedVesselId, mapLoaded, centerTrigger, playbackState]);

  // Handle layer toggle from panel
  const toggleLayer = useCallback((layerId: string) => {
    const nextVisibility = !layers[layerId];
    setLayers((prev) => ({ ...prev, [layerId]: nextVisibility }));
    onLayerChange?.(layerId, nextVisibility);
  }, [layers, onLayerChange]);

  const onMouseEnter = useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = useCallback(() => setCursor("grab"), []);



  const visibleVessels = useMemo(() => {
    if (!selectedVesselId) return null;
    if (selectedVesselId === 'STS-01' || selectedVesselId === 'STS-02') return ['STS-01', 'STS-02'];
    return [selectedVesselId];
  }, [selectedVesselId]);

  return (
    <Map
      ref={mapRef}
      initialViewState={INITIAL_VIEW}
      style={{ width: "100%", height: "100%" }}
      mapStyle={BASE_MAP_STYLES.find(s => s.id === mapStyleId)?.url || BASE_MAP_STYLES[0].url}
      cursor={cursor}
      renderWorldCopies={false}
      interactiveLayerIds={(mapLoaded && mapStyleLoaded && layers["vessels"]) ? ACTIVE_VESSEL_LAYERS : EMPTY_LAYERS}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onLoad={(e) => {
        setMapLoaded(true);
        const map = e.target;

        // Silence warnings for missing icons from the base style (e.g. circle-11)
        map.on("styleimagemissing", (e) => {
          const id = e.id; // e.g., "circle-11"
          const img = new Image(1, 1);
          img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // 1x1 transparent
          if (!map.hasImage(id)) {
             map.addImage(id, img);
          }
        });
      }}
      onStyleData={(e) => {
        // When style changes, MapLibre often deletes custom injected images.
        // Re-inject if they are missing.
        const map = e.target;
        const colors = [...Object.values(VESSEL_COLORS), "#FFFFFF"];
        
        let addedCount = 0;
        let neededAdding = false;

        if (!map.hasImage("globe-marker")) {
          neededAdding = true;
          const globeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
          const globeUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(globeSvg)}`;
          const globeImg = new Image();
          globeImg.onload = () => {
             if (!map.hasImage("globe-marker")) {
                map.addImage("globe-marker", globeImg);
             }
          };
          globeImg.src = globeUrl;
        }

        colors.forEach((color, i) => {
          const imgId = `triangle-${color.replace("#", "")}`;
          if (!map.hasImage(imgId)) {
            neededAdding = true;
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M16 2 L28 28 L16 22 L4 28 Z" fill="${color}" stroke="#0C0E14" stroke-width="1"/></svg>`;
            const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
            const img = new Image();
            img.onload = () => {
              if (!map.hasImage(imgId)) {
                 map.addImage(imgId, img);
              }
              addedCount++;
              if (addedCount === colors.length) setMapStyleLoaded(true);
            };
            img.src = url;
          } else {
             addedCount++;
          }
        });
        
        if (!neededAdding) setMapStyleLoaded(true);
      }}
      onClick={(e) => {
        // Check if clicked on vessel
        const activeVesselLayers = mapStyleLoaded && layers["vessels"] ? ACTIVE_VESSEL_LAYERS : EMPTY_LAYERS;
        const features = activeVesselLayers.length > 0 ? mapRef.current?.queryRenderedFeatures(e.point, {
          layers: activeVesselLayers,
        }) : [];
        if (features && features.length > 0) {
          const feature = features[0];
          if (feature.geometry.type === "Point") {
            const vessel = feature.properties as unknown as VesselProperties;
            onVesselSelect?.(vessel);
          }
        } else {
          onVesselSelect?.(null);
        }
      }}
      attributionControl={false}
    >
      {/* Navigation Controls - moved to avoid overlap */}
      <NavigationControl position="bottom-left" showCompass showZoom />
      <ScaleControl position="bottom-right" unit="nautical" />

      {/* Vessel Data */}
      {mapLoaded && mapStyleLoaded && layers["vessels"] && (
        <Source id="vessels" type="geojson" data={geojsonData}>
          {Object.entries(VESSEL_COLORS).filter(([k]) => k !== "default").map(([type, color]) => (
            <Layer
              key={type}
              id={`vessels-marker-${type.replace(/[^a-zA-Z0-9]/g, '-')}`}
              type="symbol"
              filter={(
                visibleVessels
                  ? ["all", ["==", ["get", "type"], type], ["any", ...visibleVessels.map(vId => ["==", ["get", "id"], vId])]]
                  : ["==", ["get", "type"], type]
              ) as any}
              layout={{
                "icon-image": [
                  "match", ["get", "source"],
                  "SATELLITE", "triangle-FFFFFF",
                  `triangle-${color.replace("#", "")}`
                ],
                "icon-size": [
                  "interpolate", ["linear"], ["zoom"],
                  3, 0.4, 6, 0.7, 10, 1,
                ],
                "icon-rotate": ["get", "heading"],
                "icon-rotation-alignment": "map",
                "icon-allow-overlap": true,
              }}
              paint={{
                "icon-halo-color": [
                   "match", ["get", "source"],
                   "SATELLITE", "#8B5CF6",
                   "transparent"
                ],
                "icon-halo-width": [
                   "match", ["get", "source"],
                   "SATELLITE", 2,
                   0
                ],
                "icon-halo-blur": 1
              }}
            />
          ))}
          {layers["vessel-labels"] && (
            <Layer 
              {...{
                ...vesselLabelLayer,
                filter: (
                  visibleVessels 
                    ? ["any", ...visibleVessels.map(vId => ["==", ["get", "id"], vId])]
                    : ["has", "name"]
                ),
              } as LayerProps}
            />
          )}
        </Source>
      )}

      {/* Selected Vessel Active Track */}
      {mapLoaded && mapStyleLoaded && visibleVessels && visibleVessels.map(vId => {
         const currentVessel = MOCK_VESSEL_GEOJSON.features.find(f => f.properties?.id === vId);
         if (!currentVessel || !currentVessel.properties?.track) return null;
         
         const isPrimary = vId === selectedVesselId;
         const vesselColor = VESSEL_COLORS[currentVessel.properties!.type] || VESSEL_COLORS.default;
         
         const trk = (isPrimary && playbackTrack ? playbackTrack : currentVessel.properties!.track as any[]) || [];
         const lineCoords = trk.map(t => t.coord || t);
         
         if (isPrimary && playbackState && animatedCoord) {
           lineCoords.push(animatedCoord);
         } else if ((!isPrimary || !playbackState) && currentVessel.geometry.type === 'Point') {
           lineCoords.push(currentVessel.geometry.coordinates);
         }

         return (
           <Fragment key={`track-${vId}`}>
             <Source 
                id={`active-vessel-track-${vId}`}
                type="geojson" 
                data={{
                   type: 'Feature',
                   geometry: { 
                     type: 'LineString', 
                     coordinates: lineCoords 
                   },
                   properties: {}
                } as any}
             >
               <Layer 
                  id={`active-vessel-track-line-${vId}`}
                  type="line"
                  layout={{ "line-join": "round", "line-cap": "round" }}
                  paint={{ "line-color": vesselColor, "line-width": 2.5, "line-dasharray": [1.5, 1.5], "line-opacity": 0.9 }}
               />
             </Source>

             <Source
                id={`active-vessel-track-labels-${vId}`}
                type="geojson"
                data={{
                   type: 'FeatureCollection',
                   features: trk
                     .filter(t => t.timestamp) 
                     .map(t => ({
                       type: 'Feature',
                       geometry: { type: 'Point', coordinates: t.coord },
                       properties: { timestamp: t.timestamp }
                     }))
                } as any}
             >
                <Layer 
                   id={`active-vessel-track-point-${vId}`}
                   type="circle"
                   paint={{
                      "circle-radius": 4,
                      "circle-color": vesselColor,
                      "circle-stroke-width": 1.5,
                      "circle-stroke-color": "#0B111D"
                   }}
                />
                <Layer
                   id={`active-vessel-track-label-text-${vId}`}
                   type="symbol"
                   layout={{
                     "text-field": ["get", "timestamp"],
                     "text-size": 10,
                     "text-offset": [1.2, 0],
                     "text-anchor": "left",
                     "symbol-placement": "point",
                     "text-font": ["Open Sans Regular"],
                   }}
                   paint={{
                     "text-color": "#F3F4F6",
                     "text-halo-color": "#0B111D",
                     "text-halo-width": 2
                   }}
                />
             </Source>
           </Fragment>
         );
      })}

      {/* Shipping Routes */}
      {mapLoaded && mapStyleLoaded && layers["shipping-routes"] && (
        <Source id="shipping-routes" type="geojson" data={SHIPPING_ROUTES}>
          <Layer
            id="shipping-routes-line"
            type="line"
            paint={{
              "line-color": "#3B82F6",
              "line-width": 1.5,
              "line-opacity": 0.6,
              "line-dasharray": [2, 1],
            }}
          />
        </Source>
      )}

      {/* EEZ Zones */}
      {mapLoaded && mapStyleLoaded && layers["eez"] && (
        <Source id="eez" type="geojson" data="/data/eez_indonesia.geojson">
          <Layer
            id="eez-fill"
            type="fill"
            paint={{
              "fill-color": "#8B5CF6",
              "fill-opacity": 0.08,
            }}
          />
          <Layer
            id="eez-line"
            type="line"
            paint={{
              "line-color": "#8B5CF6",
              "line-width": 1.5,
              "line-opacity": 0.8,
              "line-dasharray": [4, 2],
            }}
          />
        </Source>
      )}

      {/* Ports */}
      {mapLoaded && mapStyleLoaded && layers["ports"] && (
        <Source id="ports" type="geojson" data={PORTS}>
          <Layer
            id="ports-circle"
            type="circle"
            paint={{
              "circle-radius": [
                "interpolate", ["linear"], ["zoom"],
                3, 3, 6, 5, 10, 8,
              ],
              "circle-color": "#06B6D4",
              "circle-stroke-color": "#0C0E14",
              "circle-stroke-width": 1,
              "circle-opacity": 0.9,
            }}
          />
          {layers["port-labels"] && (
            <Layer
              id="ports-label"
              type="symbol"
              minzoom={5}
              layout={{
                "text-field": ["get", "name"],
                "text-size": 9,
                "text-offset": [0, 1.2],
                "text-anchor": "top",
              }}
              paint={{
                "text-color": "#D1D5DB",
                "text-halo-color": "#0C0E14",
                "text-halo-width": 1,
              }}
            />
          )}
        </Source>
      )}

      {/* Anomaly Zones */}
      {mapLoaded && mapStyleLoaded && layers["anomaly-zones"] && (
        <Source id="anomaly-zones" type="geojson" data={ANOMALY_ZONES}>
          <Layer
            id="anomaly-zone-circle"
            type="circle"
            paint={{
              "circle-radius": [
                "interpolate", ["linear"], ["zoom"],
                3, 8, 6, 15, 10, 25,
              ],
              "circle-color": [
                "match", ["get", "level"],
                "critical", "#DC2626",
                "high", "#EF4444",
                "medium", "#F59E0B",
                "#6B7280",
              ],
              "circle-stroke-color": "#0C0E14",
              "circle-stroke-width": 2,
              "circle-opacity": 0.4,
            }}
          />
          {layers["anomaly-labels"] && (
            <Layer
              id="anomaly-label"
              type="symbol"
              minzoom={4}
              layout={{
                "text-field": ["get", "name"],
                "text-size": 10,
                "text-offset": [0, 2],
                "text-anchor": "top",
              }}
              paint={{
                "text-color": "#DC2626",
                "text-halo-color": "#0C0E14",
                "text-halo-width": 1,
              }}
            />
          )}
          {/* OSINT Specific Marker */}
          <Layer
            id="osint-anomaly-marker"
            type="symbol"
            filter={["==", ["get", "source"], "OSINT"]}
            layout={{
              "icon-image": "globe-marker",
              "icon-size": [
                "interpolate", ["linear"], ["zoom"],
                3, 0.6, 6, 1, 10, 1.5,
              ],
              "icon-allow-overlap": true,
            }}
          />
        </Source>
      )}

      {/* Vessel Detail Popup */}
      {selectedVesselId && (() => {
        const vFeature = MOCK_VESSEL_GEOJSON.features.find(f => f.properties?.id === selectedVesselId);
        if (!vFeature || vFeature.geometry.type !== "Point") return null;
        const v = vFeature.properties as unknown as VesselProperties;
        const lon = playbackState && playbackState.vesselId === selectedVesselId && animatedCoord ? animatedCoord[0] : vFeature.geometry.coordinates[0];
        const lat = playbackState && playbackState.vesselId === selectedVesselId && animatedCoord ? animatedCoord[1] : vFeature.geometry.coordinates[1];
        
        return (
          <Popup
            longitude={lon}
            latitude={lat}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            offset={20}
            className="vessel-popup"
            style={{ zIndex: 50, maxWidth: "none" }}
          >
            <div className="bg-white rounded-lg shadow-2xl w-[280px] overflow-hidden flex flex-col font-sans border border-gray-200" style={{ transform: "translateY(-10px)" }}>
              {/* Header */}
              <div className="flex items-start justify-between p-2 pb-1 bg-white">
                <div className="flex gap-2">
                  <div className="flex items-center justify-center p-1 bg-[#1976D2] rounded shrink-0">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  </div>
                  <div className="flex flex-col">
                     <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold border border-gray-300 rounded-[2px] px-1 leading-[1.2] text-gray-700 bg-gray-50">{v.flag}</span>
                        <span className="text-[13px] font-bold text-gray-900 leading-[1.1] uppercase">{v.name}</span>
                     </div>
                     <span className="text-[10px] text-gray-500 font-medium leading-none mt-0.5">{v.type}</span>
                  </div>
                </div>
                <div className="flex gap-1 pt-0.5">
                   <button className="text-gray-400 hover:text-gray-700 transition-colors">
                     <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
                   </button>
                   <button onClick={() => onVesselSelect?.(null)} className="text-gray-400 hover:text-gray-700 transition-colors"><X className="w-5 h-5"/></button>
                </div>
              </div>

              {/* Image */}
              <div className="h-[130px] relative w-full overflow-hidden bg-gray-100">
                <img src="https://images.unsplash.com/photo-1572097561858-a5b591b65e9f?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2 left-2 flex items-center justify-center p-1 bg-white/20 backdrop-blur-sm rounded opacity-80">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                </div>
              </div>

              {/* Actions */}
              <div className="p-2.5 flex gap-2">
                <button className="px-2 py-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </button>
                <button className="flex-1 py-1.5 border border-[#1976D2] rounded text-[11px] font-bold text-[#1976D2] bg-white hover:bg-[#1976D2]/5 transition-colors uppercase tracking-wide">Add to fleet</button>
                <a href={`/vessel/${selectedVesselId}`} className="flex-1 flex items-center justify-center py-1.5 rounded text-[11px] font-bold text-white bg-[#1976D2] hover:bg-[#1565C0] transition-colors shadow-sm uppercase tracking-wide">Vessel details</a>
              </div>

              {/* ID + ETA */}
              <div className="px-3 pb-2 pt-1 border-b border-gray-100">
                <div className="flex justify-between items-baseline mb-2">
                    <div className="flex gap-1.5 items-baseline">
                      <span className="text-[10px] text-gray-500 font-bold">ID</span>
                      <span className="text-xl text-gray-900 tracking-wide font-black">{v.flag === "ID" ? "BXT" : "SGP"}</span>
                    </div>
                    <span className="text-[11px] text-gray-600 font-bold uppercase tracking-wider">{v.destination || "WEST SENO FIELD"}</span>
                </div>
                
                <div className="flex justify-between items-center bg-gray-50/80 border border-gray-100 p-2.5 rounded relative mb-3">
                    <div className="flex flex-col">
                       <span className="text-[9px] text-gray-500 font-bold uppercase">ATD:</span>
                       <span className="text-[10px] text-gray-900 font-bold">{v.lastUpdateUtc || "2025-06-03 17:53"}</span>
                    </div>
                    <div className="flex flex-col items-end mr-6">
                      <span className="text-[9px] text-gray-500 font-bold uppercase">Reported ETA:</span>
                      <span className="text-[10px] text-gray-900 font-bold">{v.eta || "2026-09-09 09:00"}</span>
                    </div>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 bg-white rounded-full w-[18px] h-[18px] flex items-center justify-center font-bold border border-gray-200 shadow-sm text-[10px] italic hover:bg-gray-100">i</button>
                </div>

                {/* Progress line */}
                <div className="py-2 mb-3 relative flex items-center px-1">
                    <div className="absolute left-1 right-1 h-[2px] bg-gray-200 rounded-full" />
                    <div className="absolute left-1 w-[45%] h-[2px] bg-[#2E7D32] rounded-l-full" />
                    <div className="absolute left-0 w-2.5 h-2.5 bg-[#2E7D32] border-[1.5px] border-white rounded-full shadow-sm z-10" />
                    <svg className="absolute left-[45%] -translate-x-[40%] text-[#2E7D32] w-3 h-3 z-10 fill-current drop-shadow-sm" viewBox="0 0 24 24"><path d="M3 12l18-12-7 12 7 12z"/></svg>
                    <div className="absolute right-0 w-2 h-2 bg-gray-400 rounded-full border border-white z-10 shadow-sm" />
                </div>

                {/* Tracks & routes */}
                <div className="flex gap-2 items-center">
                    <button className="flex-1 py-1.5 rounded-[4px] text-[10px] font-bold text-white bg-[#1E293B] flex items-center justify-center gap-1.5 hover:bg-gray-800 transition-colors"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 3L14.5 21a2 2 0 0 1-3.6 0L8 14 2 13a2 2 0 0 1 0-3.6L21 3z"/></svg> Past track</button>
                    <button className="flex-1 py-1.5 border border-gray-300 rounded-[4px] text-[10px] font-bold text-gray-700 hover:bg-gray-50 bg-white transition-colors">Use route tool</button>
                    <button className="text-gray-500 bg-white rounded-full w-5 h-5 flex items-center justify-center font-bold border border-gray-200 shadow-sm text-[10px] italic hover:bg-gray-100 shrink-0 transition-colors">i</button>
                </div>
              </div>

              {/* Table bottom */}
              <div className="grid grid-cols-[1fr_85px_60px] divide-x divide-gray-200 bg-gray-50 border-b border-gray-200">
                <div className="px-3 py-2 flex flex-col justify-center bg-white">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Navigational status</span>
                  <span className="text-[10px] text-gray-900 font-bold">{v.status === 'Underway' ? 'Under Way Using Engine' : v.status}</span>
                </div>
                <div className="px-2 py-2 flex flex-col justify-center bg-white items-center">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Speed/Course</span>
                  <span className="text-[10px] text-gray-900 font-bold">{v.speed}kn / {Math.round(v.heading)}°</span>
                </div>
                <div className="px-2 py-2 flex flex-col justify-center bg-white items-center">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Draught</span>
                  <span className="text-[10px] text-gray-900 font-bold">2.8m</span>
                </div>
              </div>
              
              <div className="px-3 py-2.5 bg-gray-50 border-t border-white">
                  <p className="text-[9px] text-gray-500 leading-tight">
                    Received: <span className="font-bold text-gray-800">{v.lastUpdate}</span> (AIS source: <span className="underline decoration-dotted text-gray-700">Roaming</span>) <button className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full border border-gray-300 text-[8px] italic ml-0.5 bg-white">i</button>
                  </p>
              </div>
            </div>
          </Popup>
        );
      })()}

      {/* Map Control Toolbar */}
      <MapControlsToolbar 
         layers={layers} 
         onToggleLayer={toggleLayer} 
         mapStyleId={mapStyleId} 
         setMapStyleId={setMapStyleId} 
      />
    </Map>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[8px] text-[#6B7280] uppercase tracking-wider font-[family-name:var(--font-display)]">{label}</span>
      <span className="text-[9px] text-[#D1D5DB] font-[family-name:var(--font-mono)]">{value}</span>
    </div>
  );
}

function MapControlsToolbar({ 
  layers, 
  onToggleLayer, 
  mapStyleId, 
  setMapStyleId 
}: { 
  layers: Record<string, boolean>; 
  onToggleLayer: (id: string) => void;
  mapStyleId: string;
  setMapStyleId: (id: string) => void;
}) {
  const [activePanel, setActivePanel] = useState<"layers" | "legend" | null>("legend");

  return (
    <div className="absolute top-14 right-4 z-20 flex flex-col gap-3 pointer-events-none">
      {/* Top Group: Layers & Legend */}
      <div className="bg-[#10141C]/90 backdrop-blur-sm border border-[#2A3441] rounded w-9 shadow-xl flex flex-col pointer-events-auto items-center">
        <button
          onClick={() => setActivePanel(p => p === "layers" ? null : "layers")}
          className={`w-full h-9 flex items-center justify-center border-b border-[#2A3441] hover:text-white transition-colors ${activePanel === "layers" ? "text-white bg-[#1A1E28]" : "text-[#9CA3AF]"}`}
          title="Layers"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 12 12 17 22 12"/>
            <polyline points="2 17 12 22 22 17"/>
          </svg>
        </button>
        <button
          onClick={() => setActivePanel(p => p === "legend" ? null : "legend")}
          className={`w-full h-9 flex items-center justify-center hover:text-white transition-colors ${activePanel === "legend" ? "text-white bg-[#1A1E28]" : "text-[#9CA3AF]"}`}
          title="Legend"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="6" r="2.5" />
            <rect x="10" y="4.5" width="12" height="3" rx="1" />
            <circle cx="5" cy="12" r="2.5" />
            <rect x="10" y="10.5" width="12" height="3" rx="1" />
            <circle cx="5" cy="18" r="2.5" />
            <rect x="10" y="16.5" width="12" height="3" rx="1"/>
          </svg>
        </button>
      </div>

      {/* Bottom Group: More */}
      <div className="bg-[#10141C]/90 backdrop-blur-sm border border-[#2A3441] rounded w-9 shadow-xl flex flex-col pointer-events-auto items-center">
        <button className="w-full h-9 flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors" title="More Options">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2.5" />
            <circle cx="12" cy="12" r="2.5" />
            <circle cx="19" cy="12" r="2.5" />
          </svg>
        </button>
      </div>

      {/* Flyout Panels */}
      {activePanel === "layers" && (
        <div className="absolute top-0 right-12 w-56 pointer-events-auto z-30">
          <LayersFlyout 
             layers={layers} 
             onToggle={onToggleLayer} 
             onClose={() => setActivePanel(null)} 
             mapStyleId={mapStyleId} 
             setMapStyleId={setMapStyleId} 
          />
        </div>
      )}
      {activePanel === "legend" && (
        <div className="absolute top-0 right-12 w-56 pointer-events-auto z-30">
          <LegendFlyout onClose={() => setActivePanel(null)} />
        </div>
      )}
    </div>
  );
}

function LegendFlyout({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-[#131820]/95 backdrop-blur-sm border border-[#2A3441] rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right-2 duration-200">
      <div className="px-3 py-2.5 bg-[#0C0E14] border-b border-[#2A3441] flex items-center justify-between">
        <span className="text-[11px] font-bold text-white font-[family-name:var(--font-display)]">
          Legend
        </span>
        <button onClick={onClose} className="w-5 h-5 bg-[#1A1E28] rounded flex items-center justify-center hover:bg-[#2A3441] transition-colors text-[#D1D5DB]">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="p-3 space-y-3 bg-[#131820]/90">
        {Object.entries(VESSEL_COLORS).filter(([type]) => type !== "default").map(([type, color]) => (
          <div key={type} className="flex items-center gap-3 group">
            <svg width="14" height="14" viewBox="0 0 32 32" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-transform">
              <path d="M16 2 L28 28 L16 22 L4 28 Z" fill={color} stroke="#0C0E14" strokeWidth="1.5"/>
            </svg>
            <span className="text-[10px] text-[#D1D5DB] group-hover:text-white transition-colors font-[family-name:var(--font-display)]">
              {type} Vessel
            </span>
          </div>
        ))}
        <div className="flex items-center gap-3 group pt-1 mt-1 border-t border-[#2A3441]/50">
          <svg width="14" height="14" viewBox="0 0 32 32" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] opacity-80">
            <path d="M16 2 L28 28 L16 22 L4 28 Z" fill={VESSEL_COLORS.default} stroke="#0C0E14" strokeWidth="1.5"/>
          </svg>
          <span className="text-[10px] text-[#6B7280] group-hover:text-[#9CA3AF] transition-colors font-[family-name:var(--font-display)]">
            Unspecified Vessel
          </span>
        </div>
      </div>
    </div>
  );
}

function LayersFlyout({ 
  layers, 
  onToggle, 
  onClose,
  mapStyleId,
  setMapStyleId 
}: { 
  layers: Record<string, boolean>; 
  onToggle: (id: string) => void; 
  onClose: () => void;
  mapStyleId: string;
  setMapStyleId: (id: string) => void;
}) {
  const groupedLayers = MAP_LAYERS.reduce((acc, layer) => {
    if (!acc[layer.group]) acc[layer.group] = [];
    acc[layer.group].push(layer);
    return acc;
  }, {} as Record<string, typeof MAP_LAYERS>);

  return (
    <div className="bg-[#131820]/95 backdrop-blur-sm border border-[#2A3441] rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right-2 duration-200">
      <div className="px-3 py-2.5 bg-[#0C0E14] border-b border-[#2A3441] flex items-center justify-between">
        <span className="text-[11px] font-bold text-white font-[family-name:var(--font-display)]">
          Map Layers
        </span>
        <button onClick={onClose} className="w-5 h-5 bg-[#1A1E28] rounded flex items-center justify-center hover:bg-[#2A3441] transition-colors text-[#D1D5DB]">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="max-h-[50vh] overflow-y-auto">
        {/* === BASE MAP SWITCHER === */}
        <div className="border-b border-[#1E252F]">
          <div className="px-3 py-1.5 bg-[#0C0E14]/50">
            <span className="text-[8px] uppercase tracking-wider text-[#4A5568] font-[family-name:var(--font-display)]">
              Base Map
            </span>
          </div>
          <div className="p-2 grid grid-cols-3 gap-1.5">
            {BASE_MAP_STYLES.map(style => (
               <button 
                 key={style.id}
                 onClick={() => setMapStyleId(style.id)}
                 className={`py-1.5 rounded text-[8.5px] font-bold tracking-wider uppercase font-[family-name:var(--font-display)] transition-colors btn-press ${mapStyleId === style.id ? 'bg-[#E67E22] text-white shadow-md' : 'bg-[#1A1E28] text-[#6B7280] hover:bg-[#2A3441] hover:text-[#D1D5DB]'}`}
               >
                 {style.label}
               </button>
            ))}
          </div>
        </div>

        {/* === TOGGLE LAYERS === */}
        {Object.entries(groupedLayers).map(([group, items]) => (
          <div key={group} className="border-b border-[#1E252F] last:border-b-0">
            <div className="px-3 py-1.5 bg-[#0C0E14]/50">
              <span className="text-[8px] uppercase tracking-wider text-[#4A5568] font-[family-name:var(--font-display)]">
                {group}
              </span>
            </div>
            {items.map((layer) => (
              <div
                key={layer.id}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-[#1A1E28] cursor-pointer"
                onClick={() => onToggle(layer.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: layer.color }} />
                  <span className="text-[10px] text-[#D1D5DB] font-[family-name:var(--font-display)]">
                    {layer.label}
                  </span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${layers[layer.id] ? "bg-[#E67E22]" : "bg-[#2A3441]"}`}>
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${layers[layer.id] ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Re-export for use in other components
export { VESSEL_COLORS };
export type { VesselProperties };
