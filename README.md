# 🧠 AI Session Memory Template

> Template sistem dokumentasi untuk menjaga konteks AI assistant antar conversation session.

## Quick Start

1. Copy folder `_project-template/` ke root project baru
2. Rename dan pindahkan:
   ```
   _project-template/.agents/    →  .agents/
   _project-template/docs/       →  docs/
   ```
3. Edit `docs/PROJECT_STATUS.md` — isi info project kamu
4. Mulai conversation pertama dengan `/start-session`

## Cara Pakai

| Kapan | Perintah |
|-------|----------|
| Awal sesi | `/start-session` |
| Akhir sesi | `/end-session` |
| Lanjut kerja | `lanjut` |
| Cek posisi | `status` |
| Report bug | `bug: [deskripsi]` |
| Tambah ide | `ide: [deskripsi]` |

## Struktur File

```
project/
├── .agents/workflows/
│   ├── start-session.md     ← Ritual awal sesi
│   └── end-session.md       ← Ritual akhir sesi
│
└── docs/
    ├── ACTIVE_TASK.md        ← ⭐ Working memory (baca setiap sesi)
    ├── BACKLOG.md            ← Feature request inbox
    ├── BUG_TRACKER.md        ← Bug tracking
    ├── CHANGELOG.md          ← History perubahan
    ├── DECISION_LOG.md       ← Keputusan arsitektur
    ├── PROJECT_STATUS.md     ← Master status & roadmap
    ├── API_CONTRACTS.md      ← Dokumentasi API (opsional)
    ├── DB_SCHEMA.md          ← Struktur database (opsional)
    ├── TESTING_GUIDE.md      ← Panduan testing (opsional)
    ├── QUICK_COMMANDS.md     ← Cheat sheet perintah
    └── plans/                ← Detail plan per phase
```

## Design Philosophy

- **ACTIVE_TASK** kecil (~50 lines) → dibaca SETIAP sesi
- **PROJECT_STATUS** besar (ratusan lines) → dibaca SAAT PERLU
- **CHANGELOG** append-only → tidak pernah diedit, hanya ditambah
- **DECISION_LOG** → mencegah AI bikin keputusan yang bertentangan dengan keputusan sebelumnya
