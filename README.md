# Commission Vehicle Catalog

A standalone Vue 3 + Vite + TypeScript vehicle catalog page template.

This is not a VarunTools module. It is a separate commission-ready page that uses a similar authoring and prebuild philosophy:

- Google Sheet is the operator-facing data source.
- GitHub Actions reads the sheet through a service account.
- `public/data/vehicle-catalog.json` is the public app-facing data source.
- `/catalog` renders vehicle cards.
- `/catalog/:vehicleId` renders a generated detail page from the same JSON.
- Dummy SVG vehicles and icons are generated for layout verification.

## Local commands

```bash
npm install
npm run dev
npm run build
```

Local install is intentionally lightweight. `googleapis` is not installed during normal local setup. If Google Sheet secrets are missing, `npm run sync:vehicles` keeps the existing sample JSON unless `REQUIRE_GOOGLE_SHEET=1` is set.

When you want to test real Google Sheet sync locally, install the sheet dependency only for that session:

```bash
npm run setup:sheet-deps
npm run sync:vehicles
```

GitHub Actions automatically runs `npm run setup:sheet-deps` before build, so production deploys still sync from Google Sheet.

## Required GitHub Secrets

- `GOOGLE_SHEET_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`

Optional repository variable:

- `BASE_PATH` such as `/repo-name/` for project Pages deployment.

## Sheet tabs

### Vehicles_Public

`vehicle_id,status,title,vehicle_type,brand,model,year,mileage_km,fuel,transmission,color,short_desc,detail_desc,phone_label,phone_display,phone_raw,sort_order`

### VehicleImages_Public

`image_id,vehicle_id,kind,src,alt,sort_order`

`kind` must be `thumbnail` or `gallery`. Each vehicle must have exactly one thumbnail.

### VehicleVideos_Public

`video_id,vehicle_id,youtube_url,youtube_id,title`

Use `youtube_id` when available. If only `youtube_url` is provided, the sync script extracts the ID.

## Replacement rules

Dummy assets live in:

- `public/vehicles/vehicle-001/*.svg`
- `public/icons/*.svg`

Replace them later by changing the file and the matching Sheet path. The UI reads asset paths from `vehicle-catalog.json`.

## Security boundary

Do not put Google Sheet URLs or Google API keys in Vue code. Do not commit `service-account.json`, `.env`, or private keys.

Everything in `public/data/vehicle-catalog.json` is public.

## Git update scripts

This template includes local git helper scripts so the project can be initialized, committed, and pushed without remembering every git command.

### 1. Initialize and connect a remote

```bash
npm run git:setup -- --remote=https://github.com/USER/REPO.git
```

Optional branch override:

```bash
npm run git:setup -- --remote=https://github.com/USER/REPO.git --branch=main
```

If no remote is provided, the command only initializes the local repository.

### 2. Check current git state

```bash
npm run git:status
```

### 3. Build, commit, pull/rebase, and push

```bash
npm run git:update -- "update catalog page"
```

This command runs:

1. `npm run build`
2. `git add -A`
3. `git commit -m "..."`
4. `git pull --rebase origin <branch>` when the remote branch exists
5. `git push -u origin <branch>`

Useful options:

```bash
npm run git:update -- "copy update" --no-build
npm run git:update -- "copy update" --no-pull
npm run git:update -- --message="copy update" --branch=main
npm run git:update -- "test only" --dry-run
```

`git:publish` is an alias of `git:update`.

### Safety notes

- `dist/`, `node_modules/`, `.env`, `service-account.json`, private keys, and local editor files are ignored by `.gitignore`.
- Do not commit Google service account JSON files or private keys.
- The GitHub Pages workflow builds the site from source, so committing `dist/` is not required.
