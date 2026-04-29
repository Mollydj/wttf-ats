## Backend Search API

The `GET /api/jobs` endpoint supports the following optional query parameters for filtering jobs:

| Param | Type | Description |
|---|---|---|
| `title` | string | Case-insensitive partial match on job title |
| `office` | string | Case-insensitive partial match on office/location |
| `work_mode` | string | Exact match: `onsite`, `remote`, or `hybrid` |
| `contract_type` | string | Exact match: `FULL_TIME`, `PART_TIME`, `TEMPORARY`, `FREELANCE`, `INTERNSHIP` |
| `profession_id` | integer | Filter by profession ID |
| `status` | string | Filter by status. Defaults to `published`. Pass `all` to bypass. |

### Examples

```bash
# All published jobs
curl http://localhost:4000/api/jobs

# Search by title
curl "http://localhost:4000/api/jobs?title=engineer"

# Remote jobs only
curl "http://localhost:4000/api/jobs?work_mode=remote"

# Combined filters
curl "http://localhost:4000/api/jobs?title=backend&work_mode=remote&contract_type=FULL_TIME"
```

### Changes made

- `lib/ats/jobs.ex` — replaced `list_jobs/0` with `list_jobs/1` supporting composable query filters
- `lib/ats_web/controllers/api/job_controller.ex` — `index/2` now passes query params to `list_jobs/1`
- `lib/ats_web/controllers/api/job_json.ex` — job responses now include nested `profession` object
- `test/ats/jobs_test.exs` — added tests covering all filter combinations