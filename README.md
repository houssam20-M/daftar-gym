<h1><img src="icon-512.png" alt="Logo" width="56" align="middle">&nbsp; Daftar l-Gym</h1>

App sghira dyal telephone bach ttebbe3 l-gym o l-makla. Katkhdem bla internet, o l-ma3lomat kayb9aw f telephone dyalek bo7do.

**L-lien:** https://houssam20-m.github.io/daftar-gym/

## Kifach trekkebha

1. 7ell l-lien f Chrome dyal telephone (merra wa7da, b internet).
2. 3 n9at l-fo9, "Installer l'application" wla "Ajouter à l'écran d'accueil".
3. Mn b3d katdkhol mn l-icône nichan, 7ta bla internet.

## Ach fiha

| Tab | Ach kaydir |
|---|---|
| Lyoum | Seance d nhar (A, B, C wla nhar khfif). Kat3ellem 3la l-exercices, katkteb l-kg o r-reps. Fiha warm-up dyal 5 d9ay9, timer dyal l-ra7a (60/90/120 tanya), 3adad dyal nhar mtaba3, bouton "Lyoum rya7a" li kayweqqef l-rotation bla ma tkhtlef, o "Beddel l-exercice" ila l-machine ma kaynach wla kayn wja3. |
| Simana | Istibyan d kol simana: wazn, n3ass, ta9a, makla. F l-foug: recap dyal 7 iyam (wazn, seances, makla, n3ass) + bouton "Sift", o tanbih dyal l-calories ila l-wazn ma kaynqes bzerba3a wla kaynqes b bezzaf. |
| T9eddom | Graphique dyal l-wazn b simana wla b chher, 12 simana wla kolchi, khet mkhettet dyal l-iqa3 l-mtwq3 (0.75 kg f simana), o liste dyal l-progression: kola exercice b akhir kg × reps o nasiha (zid 2.5 kg / zid reps / n9es chwiya). |
| Makla | Katzid li kliti o kat7seb l-calories o l-protein 3la l-hadaf dyal nhar. Fiha l-5 wejbat dyal l-plan b dghya wa7da, makla dyalek (boutons li katsjjel b yeddik), o 3adad dyal l-ma (12 kas = 3 L). |
| Kter | I3dadat (lon: auto, bid wla k7el; lugha: English wla Darija), ta9rir l l-coach, l-plan (toul, hadaf, calories), nskha i7tiyatiya, o tsawer dyal l-jism (merra f chher). |

L-lugha l-asasiya dyal l-app hiya **l-English**; Darija khiyar (mn l-foug wla mn Kter).

L-lon o l-lugha 3ndhom 7ta boutons f l-foug dyal l-app, bla ma tmchi l Kter.

## L-programme

Full body, kol nhar m9soum 3la jouj: rjlin o mchi f sba7, l-fou9 f l-3chiya.
Tertib: A, B, C, A, B, C, nhar khfif, o t3awed.

| Nhar | Sba7 | 3chiya |
|---|---|---|
| A | Leg press, plank, mchi | Chest press, lat pulldown, lateral raises |
| B | Romanian deadlift, leg curl, mchi | Seated row, shoulder press, biceps curl |
| C | Goblet squat, calf raises, mchi | Développé incliné, tirage horizontal, triceps pushdown |
| Khfif | Vélo wla tapis 30 d9i9a | Étirements, plank |

## L-ma3lomat

- Kolchi kayt7fed f `localStorage` dyal l-mtsaffe7 f telephone. Walou ma kaymchi l chi serveur.
- Ila ms7ti l-ma3lomat dyal Chrome wla beddelti telephone, kaydi3o. Dir "Khrej nskha" f tab Kter merra f simana. Ila 3ad 7 nhar bla nskha, l-app kat3ayet lik b banner f l-foug.
- "Nskh t-ta9rir" kay3tik ness fih l-wazn, l-awzan dyal l-exercices o l-makla, bach tlse9o l l-coach.
- Tsawer dyal l-jism kayt7efdo f `IndexedDB` dyal had telephone (msseghrin), machi f `localStorage` o machi f n-nskha. Ila beddelti telephone, tsawer kayd3o walakin l-baqi kayb9a f n-nskha.
- Tanbih dyal l-calories kaykhdem ghir ila kayn 2 twzenat f 14 nhar. Mnin tsejjel t-tbeddil, kayb9a sekout 14 nhar.

## L-fichiers

| Fichier | Ach howa |
|---|---|
| `index.html` | L-app kamla: HTML, CSS o JavaScript f fichier wa7ed |
| `sw.js` | Service worker: howa li kaykhelliha tkhdem bla internet |
| `manifest.webmanifest` | Smiya, l-alwan o l-icônes dyal t-terkib |
| `icon-192.png`, `icon-512.png` | L-logo |

## Bach tbeddel chi 7aja

1. Beddel `index.html`.
2. F `sw.js`, zid ra9m f `CACHE` (matalan `daftar-gym-v2`). Bla hadi, telephone kayb9a 3la n-nskha l-9dima.
3. `git commit` o `git push`. Telephone kayakhod n-nskha jdida mnin t7ell l-app b internet.

L-ar9am dyal l-calories f l-app ta9ribiya.
