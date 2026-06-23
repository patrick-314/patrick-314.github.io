# AGENTS.md

Static blog/docs site built with **Zensical** (an MkDocs-Material fork), not vanilla mkdocs.
Config is `zensical.toml` (TOML, not `mkdocs.yml`). Source content lives in `docs/`; build output is `site/`.

## Commands

- Install: `pip install zensical` (no requirements/lockfile; CI installs fresh each run)
- Build (verified, used by CI): `python scripts/gen-recent-posts.py && zensical build --clean`
- Local dev server: `zensical serve` (mkdocs-style; open the printed localhost URL). Run `python scripts/gen-recent-posts.py` first to regenerate `docs/data/recent-posts.json`.

## Architecture / gotchas

- **Two `overrides/` dirs exist.** The active one is `docs/overrides/` (set via `custom_dir = "docs/overrides"` in `zensical.toml`). The root-level `overrides/` is a stale duplicate — edit `docs/overrides/`, not root.
- **`site/` is git-tracked** even though it is a build artifact (there is no `.gitignore`). Don't blindly `git rm` it or commit a regenerated `site/` unless that's the intent; CI rebuilds it anyway.
- **Nav is hand-maintained** in `zensical.toml` (`[project] nav = [...]`). Adding a page under `docs/` without a nav entry means it won't be linked in the header/tabs. Add the entry alongside the file.
- **Recent posts are auto-generated.** `scripts/gen-recent-posts.py` scans `docs/blog/**/*.md` frontmatter for `data` (or `date`) + `title`, filters to last 30 days, writes `docs/data/recent-posts.json`. The homepage (`docs/index.md`) fetches this at runtime via `docs/javascripts/recent-posts.js`. Must run before `zensical build`. Posts without a `data`/`date` field or with `draft: true` are skipped.
- **Blog plugin** (`[project.plugins.blog]`): posts go in `docs/blog/posts/`, per-post images/assets in `docs/blog/posts/assets/<post-slug>/`. Config references `authors_file = "blog/.authors.yml"` and `[project.plugins.tags] tags_file = "tags.md"` — **both are currently absent**; create `docs/blog/.authors.yml` when adding authors and `docs/tags.md` when enabling tags, or those features will warn/fail.
- Content is primarily **Chinese**; `language = "zh"`, search langs `["zh","en"]`. Don't "translate" existing Chinese content unless asked.
- Math via **KaTeX** (`pymdownx.arithmatex` + `docs/javascripts/katex.js`); Mermaid via `pymdownx.superfences` custom fence; music player via APlayer + MetingJS wired in `extra_css`/`extra_javascript`. These are loaded from CDNs in `zensical.toml`.

## Deploy

- GitHub Pages via `.github/workflows/docs.yml`, triggered on push to `main` or `master`.
- Workflow runs `zensical build --clean`, uploads `site/`, deploys via `actions/deploy-pages`. No manual deploy step.
- Custom domain: `docs/CNAME` → `patricklab.top` (site_url `https://www.patricklab.top/`).

## Conventions

- Commit messages are bare version bumps (e.g. `1.1.2`) or short descriptions — no conventional-commits prefix. Match this style.
- Default branch: `main`.
