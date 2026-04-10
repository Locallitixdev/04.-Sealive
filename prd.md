# Product Requirements Document (PRD)
# Sealive - Maritime Monitoring Platform
**Version:** 1.0  
**Date:** April 2026  
**Status:** Draft
---
## 1. Introduction
### 1.1 Overview
Sealive adalah platform pemantauan maritim terintegrasi yang dirancang untuk memberikan visibilitas menyeluruh terhadap kondisi perairan melalui visualisasi peta interaktif, monitoring vessel berbasis AIS, analisis anomali, dan manajemen kasus secara terpusat.
### 1.2 Tujuan Produk
- Menyediakan visualisasi real-time kondisi perairan melalui peta interaktif (globe/2D)
- Memantau pergerakan vessel melalui platform AIS
- Menyediakan dashboard ringkasan untuk mendeteksi anomali dan kejadian
- Memberikan situational awareness melalui integrasi data sosial media dan berita
- Mengelola penugasan dan kasus terkait insiden maritim
### 1.3 Referensi Kompetitor
- **Glassocean** - Maritime monitoring dashboard dengan visualisasi globe
- **Datalastic** - AIS API provider untuk data vessel tracking, historical data, port data
---
## 2. User Personas
### 2.1 Maritime Operator
- Memantau traffic vessel di area operasi
- Mengidentifikasi vessel yang mencurigakan
- Mengelola dan menugaskan tim lapangan
### 2.2 Coast Guard / Maritime Authority
- Melakukan pengawasan wilayah perairan
- Merespons insiden dan anomali
- Mengkoordinasikan operasi pencarian dan pertolongan
### 2.3 Shipping Company / Logistics
- Melacak armada vessel perusahaan
- Memantau ETA dan route kapal
- Mengidentifikasi potensi penundaan atau risiko
### 2.4 Port Authority
- Mengelola traffic di pelabuhan
- Mengkoordinasikan movements kapal
- Memantau kepatuhan regulasi
---
## 3. Feature Specifications
### 3.1 Maps View
#### 3.1.1 Core Functionality
- **Peta Interaktif** - Tampilan peta perairan dengan dua mode:
  - Mode Globe (3D spherical view)
  - Mode 2D (flat map view)
- **Navigasi** - Zoom, pan, rotate, dan reset view
- **Multiple Projection Support** - Mercator, Equirectangular, Stereographic
#### 3.1.2 Layer System
- **Base Layer**
  - Satellite imagery
  - Nautical chart
  - Terrain/dem
- **AIS Layer**
  - Real-time vessel positions
  - Vessel icons differentiated by type (cargo, tanker, fishing, passenger, etc.)
  - Vessel trail/path history
  - Vessel information popup on click
- **Additional Layers**
  - Port facilities
  - Maritime boundaries (territorial waters, EEZ)
  - Weather overlay (waves, wind, currents)
  - Traffic separation schemes
  - Navigation aids (buoys, lighthouses)
#### 3.1.3 Vessel Monitoring
- **Search & Filter**
  - Search by vessel name, IMO, MMSI
  - Filter by vessel type, flag, status
  - Filter by area (bounding box)
- **Vessel Details Panel**
  - Vessel name & type
  - IMO/MMSI numbers
  - Flag state
  - Destination & ETA
  - Speed & heading
  - Current status (underway, anchored, moored)
  - Last update timestamp
  - Voyage history
- **Vessel Tracking**
  - Follow selected vessel
  - Set geofence alerts
  - Track path playback
#### 3.1.4 UI/UX Requirements
- Responsive design (desktop, tablet, mobile)
- Dark/Light theme support
- Smooth animations and transitions
- Fast rendering for large vessel counts (1000+ markers)
---
### 3.2 Consecutive Dashboard
#### 3.2.1 Overview Dashboard
- **Summary Cards**
  - Total vessels in area
  - Active alerts count
  - Vessels at anchor
  - Vessels underway
  - Vessels in port
- **Real-time Statistics**
  - Traffic density heatmap
  - Vessel type distribution (pie chart)
  - Flag state distribution
  - Average speed in area
#### 3.2.2 Anomaly Detection
- **Anomaly Types**
  - Speed anomaly (too slow/fast for vessel type)
  - Route deviation
  - Zone entry/exit violations
  - AIS transmission gaps
  - Suspicious behavior patterns
- **Alert System**
  - Real-time notifications (push, email)
  - Alert severity levels (Critical, High, Medium, Low)
  - Alert acknowledgment workflow
  - Alert history and analytics
- **Alert Details Panel**
  - Timestamp of detection
  - Vessel information
  - Anomaly description
  - Evidence/data points
  - Recommended action
  - Status (New, Acknowledged, Resolved, Dismissed)
#### 3.2.3 Timeline View
- Chronological display of events
- Filter by date range, event type, vessel
- Event detail expansion
---
### 3.3 Situational Awareness
#### 3.3.1 Local Conditions
- **Weather Data**
  - Wind speed & direction
  - Wave height
  - Visibility
  - Precipitation
  - Sea surface temperature
- **Maritime Conditions**
  - Sea state
  - Current direction & speed
  - Tide information
#### 3.3.2 Global Conditions
- **News Aggregation**
  - Maritime news feed
  - Filter by region, category
  - Source attribution
  - Related vessel/incident links
- **Social Media Integration**
  - Monitor relevant maritime hashtags
  - Geotagged posts in operational area
  - Sentiment analysis
- **Trend Analysis**
  - Historical traffic patterns
  - Seasonal trends
  - Anomaly frequency trends
#### 3.3.3 Intelligence Dashboard
- Customizable widgets
- Draggable layout
- Multiple dashboard templates
- Export capabilities
---
### 3.4 Case Management
#### 3.4.1 Case Types
- **Incident Reports**
  - Collision
  - Grounding
  - Pollution
  - Search and rescue
  - Piracy/hijacking
  - Equipment failure
- **Anomaly Follow-up**
  - Suspicious vessel
  - Route deviation
  - Illegal fishing
  - Unreported incidents
- **Routine Tasks**
  - Patrol scheduling
  - Inspection assignments
  - Documentation
#### 3.4.2 Case Lifecycle
- **Creation**
  - Manual creation
  - Auto-creation from alerts
  - Import from external systems
- **Assignment**
  - Assign to team/person
  - Set priority
  - Set deadline
  - Add required resources
- **Tracking**
  - Status updates
  - Progress notes
  - Evidence attachment
  - Location tracking
- **Resolution**
  - Add resolution notes
  - Mark as resolved/closed
  - Generate report
#### 3.4.3 Case Details
- Case ID and title
- Case type and category
- Priority level
- Status
- Assigned personnel
- Timeline/history
- Related vessels
- Location (map)
- Attachments
- Linked alerts
#### 3.4.4 Reporting
- Case statistics
- Response time metrics
- Resolution rate
- Export to PDF/CSV
---
## 4. Technical Requirements
### 4.1 Data Sources
- **AIS Data Provider** - API integration (e.g., Datalastic, MarineTraffic)
- **Weather Data** - Meteorological API integration
- **News/Social Media** - RSS feeds, social media APIs
- **Internal Database** - Case management, user data
### 4.2 Performance
- Map rendering < 2 seconds
- AIS data refresh < 30 seconds
- Dashboard load time < 3 seconds
- Support 10,000+ concurrent users
### 4.3 Security
- Role-based access control
- Data encryption in transit
- Audit logging
- API authentication
### 4.4 Integration
- RESTful API for third-party integration
- Webhook support for alerts
- Data export formats (CSV, JSON, PDF)
---
## 5. Non-Functional Requirements
### 5.1 Usability
- Intuitive navigation
- Consistent UI patterns
- Accessible (WCAG 2.1 Level AA)
- Multi-language support (initial: English, Indonesian)
### 5.2 Reliability
- 99.9% uptime
- Data backup strategy
- Error handling and recovery
### 5.3 Scalability
- Horizontal scaling capability
- Cloud-native deployment
- Container orchestration ready
---
## 6. User Flows
### 6.1 Monitor Vessel
1. User opens Maps View
2. Navigate to desired area
3. Select vessel from map or search
4. View vessel details in panel
5. Optionally track vessel or set alert
### 6.2 Respond to Alert
1. Alert appears in dashboard
2. User clicks to view details
3. Acknowledge alert
4. Investigate using map/tools
5. Create case if needed
6. Resolve and document
### 6.3 Create Case
1. Navigate to Case Management
2. Click "New Case"
3. Fill case details
4. Assign to team member
5. Set priority and deadline
6. Track progress until resolution
---
## 7. Success Metrics
- **User Adoption** - Active users, session duration
- **Performance** - Page load time, error rate
- **Engagement** - Features used, frequency
- **Business Goals** - Incidents resolved, response time
---
## 8. Out of Scope (v1.0)
- Mobile native apps
- Offline mode
- Payment/billing features
- Third-party API marketplace
- Advanced analytics/ML features
---
## 9. Timeline & Milestones
| Phase | Description | Duration |
|-------|-------------|----------|
| Discovery | Research, requirements gathering | 2 weeks |
| Design | UX/UI design, prototypes | 3 weeks |
| Development | Implementation | 8 weeks |
| Testing | QA, UAT | 3 weeks |
| Deployment | Launch | 1 week |
---
## 10. Appendix
### 10.1 Glossary
- **AIS** - Automatic Identification System
- **MMSI** - Maritime Mobile Service Identity
- **IMO** - International Maritime Organization
- **EEZ** - Exclusive Economic Zone
- **ETA** - Estimated Time of Arrival
- **Vessel Trail** - Historical path of vessel movement
### 10.2 References
- Glassocean: https://glassocean.site/
- Datalastic: https://datalastic.com/
- AIS Data Standards: ITU-R M.1371
---
*Document Version: 1.0*  
*Last Updated: April 2026*