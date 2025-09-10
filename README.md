# @savkit/readystore

> ⚠️ **Alpha Version Notice**  
> This package is currently in alpha and not ready for production use.  
> Beta and final releases are coming soon.

**ReadyStore Core** — dependency-aware state based on Angular Signals:
computes values only when all required data is ready.
If data is missing, computation is not performed.

- ✅ Signals-first API
- ✅ Dependency tracking
- ✅ Guarded / lazy evaluation (no compute until ready)
- ✅ TypeScript typings

## Install

```bash
npm i @savkit/readystore
