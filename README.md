# vlovichot/gta6-trophy-guide-01-entry

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/vlovichot/gta6-trophy-guide-01-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/vlovichot/gta6-trophy-guide-01-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline trophy guide and tracker for Grand Theft Auto VI on PlayStation 5: all 55 trophies with their official names, descriptions and grades, an original cited guide for each one, a roadmap to the platinum with every missable flagged, and a checklist whose progress is saved in the browser and can be exported and imported. Everything runs from the static files in app/ with the network off.

## How it works

The app (`app/index.html`, `app/app.js`, `app/roadmap.js`, `app/style.css`) loads its data from `app/data/trophies.json` and nothing else — no build step, no network requests, so it works with the network off. The checklist shows every trophy with its official name, description and grade; ticking a trophy saves progress to `localStorage`, and the header tracks the total plus per-grade counts. Filter chips narrow the list by kind (story, missable, collectibles, activities, online), a grade select and a search box refine it further, and the spoiler shield hides the names and descriptions of unearned story trophies until they are earned. Clicking any trophy opens its guide: what to do, how and when, in our own words, with the sources it rests on listed as links. The Roadmap view lays out the five stages to the platinum in the order this guide recommends — story first with the one missable (the Chapter 1 meditation for Positive Mental Attitude) watched, then strangers and partner feats, the counted grinds, free-roam feats and the money loop, and finally the 100% completion sweep. Progress can be exported to a JSON file and imported back on any machine. Views are shareable by URL: `?view=roadmap`, `?filter=missable`, `?trophy=28` and `?spoiler=1` set the opening state.

## Sources

Trophy names, descriptions and grades are the official PlayStation list exactly as published, as listed by Exophase and PSNProfiles and cross-checked at [Planet GTA 6](https://www.planetgta6.com/en/gta-6-trophies/). The guides are original text written for this entry, built from the official descriptions and from the launch guides they cite — principally the [PowerPyx GTA 6 Trophy Guide & Roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/) (one playthrough, no mission replay, a lenient 100% checklist, the Chapter 1 meditation missable) and [Output Lag's trophy list](https://outputlag.com/guides/gta-6-trophy-list/). Every trophy's panel lists its own sources; where launch reporting had not yet confirmed a trigger, the guide says so rather than inventing one.

## Run it

```sh
node serve.ts   # then open http://localhost:8080
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=pct4ejqv&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
