# Elden Companion

A desktop companion app for Elden Ring players. 
---

## What It Does

Elden Companion sits as a lightweight, always-on-top window while you play. It helps you track your progress through the game's regions, reference your build, and consult an AI companion that responds in character — aware of your level, your build, and your chosen tone.

**Core features:**

- Region-by-region progress tracking with checkboxes that persist between sessions
- Build reference window (draggable, collapsible) with item checklist and YouTube guide link
- AI companion chat powered by your choice of Google Gemini, OpenAI, or Anthropic Claude
- Three companion tones: *Remembrancer* (wise), *Scion of Grace* (heroic), *Grace-Abandoned* (discouraged)
- In-game notes pad that saves automatically
- Optional full walkthrough display per region
- Global hotkey (`Ctrl+Alt+Z`) to toggle the window without leaving your game

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop window | [pywebview](https://pywebview.flowrl.com/) |
| UI | HTML / CSS / Vanilla JS |
| AI providers | Google Gemini (via LangChain), OpenAI, Anthropic |
| Hotkey | AutoHotkey v2 |
| Data pipeline | BeautifulSoup4, OpenAI API (notebooks) |

---

## Requirements

- Python 3.10+
- [AutoHotkey v2.0](https://www.autohotkey.com/) — required for the global hotkey feature. Install it and ensure it is available on your system. The app launches the hotkey script automatically on startup.
- An API key from at least one of: Google AI Studio, OpenAI, or Anthropic

---

## Installation

```bash
git clone https://github.com/yourusername/elden-companion.git
cd elden-companion
pip install -r requirements.txt
python app.py
```

---

## Project Structure

```
elden-companion/
├── app.py                  # Entry point, pywebview setup, AI logic, Python–JS API
├── elden_companion.ahk     # Global hotkey script (auto-launched by app.py)
├── ui/
│   ├── index.html          # Full app UI
│   ├── style.css           # Elden Ring-inspired dark theme
│   └── ui.js               # JS ↔ Python bridge logic, DOM interactions
├── data/
│   ├── bigdata.json        # Region walkthrough data (user-supplied)
│   └── bigbuild.json       # Build data (user-supplied)
├── saves/
│   ├── settings.json       # App and AI settings
│   ├── apisettings.json    # API keys (gitignored)
│   ├── playerstate.json    # Level, region, build, notes
│   └── regionprogress.json # Per-region checkbox states
└── notebooks/
    ├── data_extract.ipynb  # Scrape and extract region walkthrough data
    ├── build_extract.ipynb # Scrape and extract build data
    └── data_format.ipynb   # Format extracted data into app-ready JSON using an LLM
```

---

## Supplying Your Own Data

**The app ships without game data.** This is intentional — walkthrough and build content belongs to its respective creators and is not redistributed here.

The `notebooks/` folder provides a full pipeline to scrape, extract, and format your own data from any compatible web source:

1. **`data_extract.ipynb`** — Save your target walkthrough page as an HTML file and run this notebook to extract region names, recommended levels, steps, and walkthrough paragraphs into `bigdata.json`.
2. **`build_extract.ipynb`** — Save your target builds page as an HTML file and run this notebook to extract build names, YouTube IDs, item lists, and descriptions into `bigbuild.json`.
3. **`data_format.ipynb`** — Uses the OpenAI API to reformat the raw extracted data into the HTML structure expected by `index.html`.

> The notebooks are written for a specific site's HTML structure as a worked example. You will need to inspect your target page and adjust the CSS selectors (`class_name`, `label_name`, index ranges) to match. The notebooks are commented to guide you through this.

---

## API Setup

On first launch, navigate to **Settings** inside the app:

1. Choose your provider (Google, OpenAI, or Anthropic)
2. Enter your API key
3. Select a model
4. Choose a companion tone

Keys are saved locally to `saves/apisettings.json`. **This file is gitignored and never leaves your machine.**

---

## Using as a Template for Other Games

The app is designed to be game-agnostic at its core. To adapt it for another RPG:

1. Replace `bigdata.json` with your game's region/area progression data
2. Replace `bigbuild.json` with character builds or class guides relevant to your game
3. Update the AI prompt in `app.py` (`get_message`) to reference your game's lore and context
4. Update tone names and roles in `get_tone()` to fit your game's aesthetic
5. Adjust `regionprogress.json` to match your game's area list
6. Restyle `style.css` to match your game's visual identity

The Python–JS bridge pattern, save system, and AI integration require no changes.

---

## Known Limitations

- The walkthrough toggle (`Full Walkthrough` / hidden) only shows/hides, it does not filter content dynamically
- No error feedback in the UI if an API call fails — errors surface in the terminal only
- The hotkey script requires AutoHotkey to be installed; the app starts regardless if it is missing
- `data_format.ipynb` references `gpt-5.2` in one cell — update this to your preferred available model before running

---

## Acknowledgements

Inspired by community-created Elden Ring guides. No guide content is included in this repository. All game assets, names, and lore belong to FromSoftware / Bandai Namco. 

> **Portfolio context:** This project is not intended to be a commercial product or a complete out-of-the-box solution. It demonstrates app architecture, Python–JavaScript communication, AI agent integration, and a reusable template pattern for RPG companion tools.


---

## License

MIT — free to use, adapt, and build on. Attribution appreciated but not required.