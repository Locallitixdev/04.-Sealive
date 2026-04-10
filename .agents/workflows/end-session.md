---
description: Ritual WAJIB sebelum mengakhiri sesi — save semua state ke docs
---

## End Session Workflow

Sebelum mengakhiri conversation, WAJIB lakukan langkah berikut:

1. Update `docs/ACTIVE_TASK.md`:
   - Mark completed items `[x]`
   - Mark in-progress items `[/]`
   - Update "Context Notes" dengan:
     - File terakhir yang diedit + line number
     - Dependencies atau yang perlu diinstall
     - Bug yang ditemukan tapi belum fix
   - Update "Queue" jika ada perubahan urutan

2. Update `docs/BUG_TRACKER.md`:
   - Tambah bug baru yang ditemukan ke "Open Bugs"
   - Pindahkan bug yang di-fix ke "Fixed Bugs" dengan root cause + fix detail

3. Append ke `docs/CHANGELOG.md`:
   - Tambah entry baru dengan tanggal hari ini
   - List semua files yang dimodifikasi
   - List bugs yang di-fix
   - List keputusan yang dibuat

4. Update `docs/BACKLOG.md`:
   - Tambah request user yang belum dikerjakan
   - Tambah mid-session additions
   - Update status items yang sudah dikerjakan

5. Update `docs/PROJECT_STATUS.md` (HANYA jika phase/milestone selesai):
   - Update progress percentage
   - Mark phase sebagai completed

6. Konfirmasi ke user:

```
💾 Session State Saved:
- Tasks completed: [jumlah]
- Bugs fixed: [jumlah]
- New bugs found: [jumlah]
- Backlog items added: [jumlah]

State tersimpan di docs/. Sesi berikutnya akan otomatis load konteks ini.
```
