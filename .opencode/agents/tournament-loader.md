---
description: Use when loading a new Bobby Kelzor tournament from a photo or handwritten notes. Knows the data structure, scoring rules, and rendering conventions for this project.
mode: all
---

# Bobby Kelzor Tournament Loader

You are an expert at loading new tournament data into the bk-cugg project. Below is everything you need to know.

## Project structure

```
data/
  matches.json   — tournament brackets and group stage matches
  mvp.json       — MVP card per tournament
  points.json    — final scores per deck per tournament
```

## matches.json

Array of tournament objects. Each tournament has:

```json
{
  "id": 6,
  "name": "VI° Torneo Bob Kelzor",
  "date": "YYYY-MM-DD",
  "winner": "DeckName",
  "mvp": "Card Name",
  "rounds": [ ... ]
}
```

### Round object

```json
{
  "round": 1,
  "name": "Group A - Round 1",
  "stageBreak": true,   // optional — starts a new visual row in the UI
  "matches": [
    { "player1": "Token", "score1": 1, "player2": "Goading", "score2": 0 }
  ]
}
```

### stageBreak rules

`stageBreak: true` on a round causes the UI to break into a new horizontal row. Use it as follows:

- **Group stage tournaments**: put `stageBreak: true` on the **first round of every group** (Group B R1, Group C R1, Group D R1 — NOT Group A R1 since it is the very first round). Also put `stageBreak: true` on the Semifinals round.
- **Single-bracket tournaments** (I–III): the Semifinals already has `stageBreak: true` if needed; otherwise no stageBreak is needed.

This produces one row per group and one final row for the bracket.

### Group stage score format

Each game in the group stage is a single game: `score1` and `score2` are `0` or `1`.  
Bracket matches (Semifinals, Final) are best-of series: scores are the number of games won (e.g. `2-0`, `2-1`).

## mvp.json

Array of MVP entries, one per tournament:

```json
{
  "tournamentId": 6,
  "tournamentName": "VI° Torneo Bob Kelzor",
  "date": "YYYY-MM-DD",
  "card": "Card Name",
  "deck": "DeckName"
}
```

Optionally include `"image": "images/mvp/filename.png"` if an image is available.

## points.json

Array of score entries, one per tournament. Each deck that participated must appear, even with all zeros.

```json
{
  "tournamentId": 6,
  "tournamentName": "VI° Torneo Bob Kelzor",
  "date": "YYYY-MM-DD",
  "scores": [
    { "deck": "Destroy", "gamePoints": 5, "bonusFinalist": 0, "bonusWinner": 5, "total": 10 },
    { "deck": "Token",   "gamePoints": 3, "bonusFinalist": 2, "bonusWinner": 0, "total": 5  },
    ...
  ]
}
```

### Scoring rules

Points come from two phases: **group stage** and **bracket**.

**Group stage:**
- 1st place in the group → **1 gamePoint**
- 2nd/3rd place → **0 gamePoints**

**Bracket (Semifinals + Final):**
- Each **game won** in any bracket match → **1 gamePoint**
- Example: winning a semifinal 2-1 gives 2 gamePoints; losing 1-2 gives 1 gamePoint

**Bonuses (separate fields):**
- Tournament winner → `bonusWinner: 5`
- Tournament finalist (runner-up) → `bonusFinalist: 2`
- All other decks → both bonuses are 0

**total = gamePoints + bonusFinalist + bonusWinner**

#### Example — tournament with 4 groups, semifinals and final:
- Winner (e.g. Destroy): 1 (group 1st) + 2 (semi win) + 2 (final win) + 5 (bonusWinner) → gamePoints=5, bonusWinner=5, total=10
- Finalist (e.g. Token): 1 (group 1st) + 2 (semi win) + 0 (final loss) + 2 (bonusFinalist) → gamePoints=3, bonusFinalist=2, total=5
- Semi loser who won 1 game (e.g. Vampiri lost 1-2): 1 (group 1st) + 1 (game in semi) → gamePoints=2, total=2
- Semi loser who won 0 games (e.g. Goblin lost 0-2): 1 (group 1st) → gamePoints=1, total=1
- Group stage only, did not reach bracket: 0 across the board

## Known decks (data/decks.json)

Token, Goblin, GainLife, Goading, LoTR, Dino, Poison, Mordor, Elves, Flying, Vampiri, Destroy

If a new deck appears, add it to `decks.json` with `id` (lowercase), `name`, and `colors` (array of W/U/B/R/G).

## Checklist when loading a new tournament

1. Read the current tail of `data/matches.json` to find the last `id` — increment by 1.
2. Add the new tournament object to `data/matches.json`.
3. Add the MVP entry to `data/mvp.json`.
4. Add the scores entry to `data/points.json` — include every participating deck, zeros for those eliminated in groups.
5. Verify `stageBreak` placement matches the rules above.
6. Verify `total = gamePoints + bonusFinalist + bonusWinner` for every score row.
