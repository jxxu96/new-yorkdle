# New Yorkdle 🗽

A daily Wordle-style guessing game about places in **Manhattan**, played on a blank map.
Read the clue, then name a place or drop a pin on an unlabeled outline of the island. You get six guesses to find the mystery spot. It could be the Empire State Building, or it could be a dive bar, a ghost subway station or a pocket park.

**Play:** https://jxxu96.github.io/new-yorkdle/

## How to play

- A new puzzle drops every day at midnight New York time. Puzzle #1 is 2026-10-31.
- Guess by **typing a place name** (fuzzy autocomplete that also matches aliases) or by **tapping the map** to drop a pin, then pressing "Guess this spot".
- You win by naming the place, or by dropping a pin within about 75 m (roughly one block). Big places like the Met or Times Square have a larger target, and linear ones like the High Line or the bridges count anywhere along their length.
- Each guess shows:
  - distance in miles plus approximate blocks (~20 north–south blocks per mile)
  - a compass arrow and a 16-point direction
  - **Manhattan grid directions** (uptown / downtown / crosstown), adjusted for the grid's ~29° tilt
  - a closeness % and a color: 🟨 < ¼ mi · 🟧 < 1 mi · 🟥 < 3 mi · 🟦 3+ mi · 🟩 got it
- Each miss unlocks another hint, in this order: clue 2 → clue 3 → neighborhood → first letter → a search-zone circle on the map.
- Share your result as an emoji grid. Stats and streaks are saved in your browser.
- **Practice** mode gives unlimited random rounds, filtered by Iconic, Local or Mixed.

The daily rotation mixes **iconic** landmarks (about 2 days in 5) with **local** favorites, spread evenly. No place repeats until every place has been used.

## Run it locally

The game is a plain static site: no build step, no dependencies, no API keys. It uses ES modules, so serve it over HTTP. Opening `index.html` straight from disk won't work.

```sh
# any static server works, e.g.
python -m http.server 8000
# then open http://localhost:8000/
```

Every path is relative, so it also works from a subpath like GitHub Pages (`/new-yorkdle/`). To deploy, push the repo and enable **Settings → Pages → Deploy from branch** (root).

## Tests

```sh
npm test          # same as: node tests/run.mjs
```

The tests use plain Node with no dependencies. They check:

- the dataset: size, unique ids, required fields, the iconic/local mix, every point inside both the Manhattan polygon and the bounding box, no clue that gives away its own name, and no two places close enough to win each other's puzzle
- distance, bearing and grid math
- daily seeding: NY-timezone dates, DST-safe countdown, determinism, no repeats within a cycle, a fair mix
- share text, stats and streaks, search, and that every asset path is relative

## Project layout

```
index.html          app shell
css/style.css       styles (mobile-first, taxi yellow + MTA bullet colors)
js/app.js           DOM controller: rendering, input, modals, persistence
js/map.js           SVG map: equirectangular projection, pan / wheel / pinch / button zoom, pins
js/game.js          pure game logic: daily seed + schedule, guess scoring, hints, share text, stats
js/geo.js           pure geometry: haversine, bearing, compass, grid directions, point-in-polygon
js/search.js        fuzzy name/alias search
js/copy.js          snappy New York copy ("Fuggedaboutit!")
js/confetti.js      win confetti
data/places.js      173 places (71 iconic, 102 local) with clues and fun facts
data/manhattan.js   Manhattan shoreline polygon (195 vertices)
tests/run.mjs       test runner
```

## Data notes

- **Shoreline:** the OpenStreetMap *Manhattan Island* multipolygon (relation 3954665), simplified with Douglas–Peucker at about 20 m tolerance. Outlines for Little Island (Pier 55) and Pier 86 (the Intrepid) were added. © OpenStreetMap contributors, [ODbL](https://www.openstreetmap.org/copyright).
- **Places:** coordinates were cross-checked against Wikipedia/Wikidata and OpenStreetMap. Bridge targets follow each bridge's Manhattan approach out to the shoreline.
- Every place is on Manhattan island itself. That means no Roosevelt Island, no Liberty Island, and no Marble Hill.
- The daily schedule is derived from the dataset, so adding or removing places reshuffles future puzzles. Players who already started today's puzzle keep it, because the saved round remembers its place id.
