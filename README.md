<h1><img src="icon-512.png" alt="Logo" width="56" align="middle">&nbsp; Daftar l-Gym</h1>

A small phone app to track the gym and food. It works offline, and all data stays on your own phone.

**Link:** https://houssam20-m.github.io/daftar-gym/

## How to install it

1. Open the link in Chrome on your phone (once, with internet).
2. The three dots at the top, "Install app" or "Add to Home screen".
3. From then on you open it from the icon, even with no internet.

## What it does

| Tab | What it does |
|---|---|
| Today | The session of the day (A, B, C or a light day). Tick the exercises, type the kg and the reps. It has a 5-minute warm-up, a rest timer (60/90/120 seconds), a streak of days in a row, a "Rest today" button that pauses the rotation without breaking it, and "Change exercise" when a machine is taken or something hurts. |
| Week | The weekly check-in: weight, sleep, energy, food. At the top: a recap of the last 7 days (weight, sessions, food, sleep) with a "Share" button, and a calorie nudge when the weight is not moving or is dropping too fast. |
| Progress | The weight chart, weekly or monthly, last 12 weeks or everything, a dashed line for the expected pace (0.75 kg a week), and the exercise progression: every exercise with its last kg x reps and a hint (add 2.5 kg / more reps / go lighter). |
| Food | Add what you ate and see calories and protein against the daily target. It has the 5 plan meals in one tap, your own food buttons (ones you save yourself), and the water counter (12 glasses = 3 L). |
| More | Settings (theme: auto, light or dark; language: English or Darija), the report for your coach, the plan (height, goal, calories), the backup, and body photos (once a month). |

The app's main language is **English**; Darija is an option (from the top bar or from More).

The theme and the language also have buttons in the app's top bar, so you do not have to go to More.

## The programme

Full body, every day split in two: legs and walking in the morning, upper body in the evening.
Order: A, B, C, A, B, C, a light day, then repeat.

| Day | Morning | Evening |
|---|---|---|
| A | Leg press, plank, walk | Chest press, lat pulldown, lateral raises |
| B | Romanian deadlift, leg curl, walk | Seated row, shoulder press, biceps curl |
| C | Goblet squat, calf raises, walk | Incline dumbbell press, cable row, triceps pushdown |
| Light | Bike or treadmill, 30 minutes | Stretching, plank |

## The data

- Everything is stored in the browser's `localStorage` on the phone. Nothing goes to any server.
- If you clear Chrome's data or change phone, it is lost. Make an "Export backup" in the More tab once a week. If 7 days pass without a backup, the app shows a banner at the top.
- "Copy report" gives you a text with the weight, the exercise weights and the food, ready to paste to your coach.
- Body photos are kept in `IndexedDB` on this phone (compressed), not in `localStorage` and not in the backup. If you change phone the photos are lost, but everything else is in the backup.
- The calorie nudge only works when there are 2 weigh-ins within 14 days. Once you accept the change, it stays quiet for 14 days.

## The files

| File | What it is |
|---|---|
| `index.html` | The HTML skeleton and structure |
| `styles.css` | All styling and dark/light themes |
| `js/` | Application modules (storage, language, UI, session, food, stats, etc.) |
| `sw.js` | Service worker: it is what makes the app work offline |
| `manifest.webmanifest` | Name, colours and icons for the install |
| `icon-192.png`, `icon-512.png` | The logo |

## How to change something

1. Edit `index.html`.
2. In `sw.js`, bump the number in `CACHE` (for example `daftar-gym-v2`). Without it, the phone keeps the old version.
3. `git commit` and `git push`. The phone picks up the new version the next time you open the app with internet.

The calorie numbers in the app are estimates.
