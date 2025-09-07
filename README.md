# @readystore/core

**ReadyStore Core** — dependency-aware state на базі Angular Signals:
обчислює значення лише тоді, коли всі потрібні дані **готові** (ready).
Якщо даних бракує — обчислення не виконується.

- ✅ Signals-first API
- ✅ Dependency tracking
- ✅ Guarded / lazy evaluation (no compute until ready)
- ✅ TypeScript typings

## Install
```bash
npm i @readystore/core
