---
description: Ritual WAJIB di awal setiap sesi baru — memastikan AI punya konteks lengkap
---

## Start Session Workflow

Setiap kali memulai conversation baru untuk project ini, WAJIB lakukan langkah berikut:

// turbo-all

1. Baca file `docs/ACTIVE_TASK.md` untuk tahu task yang sedang dikerjakan dan progress terakhir
2. Baca file `docs/BACKLOG.md` untuk tahu ada request/ide yang pending dari user
3. Baca file `docs/BUG_TRACKER.md` bagian "Open Bugs" untuk tahu bug yang belum di-fix
4. Baca file `docs/DECISION_LOG.md` (5 entry terakhir) untuk tahu keputusan terbaru
5. Konfirmasi ke user dengan format:

```
📋 Session Context:
- Phase aktif: [nama phase]
- Sub-task: [sub-task aktif]
- Status: [progress]
- Open bugs: [jumlah]
- Backlog pending: [jumlah]

Mau lanjut dari terakhir, atau ada yang lain?
```

### Rules
- JANGAN mulai coding sebelum baca minimal ACTIVE_TASK dan BUG_TRACKER
- Jika user langsung kasih instruksi spesifik, tetap baca ACTIVE_TASK dulu (bisa parallel)
- Jika ada open bugs severity HIGH/CRITICAL, tanya user apakah mau fix dulu
