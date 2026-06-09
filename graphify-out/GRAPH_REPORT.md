# Graph Report - c:/Users/saiet/Classone  (2026-05-18)

## Corpus Check
- 28 files · ~83,267 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 91 nodes · 139 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 68% EXTRACTED · 25% INFERRED · 7% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Content Collections|Content Collections]]
- [[_COMMUNITY_Package Metadata|Package Metadata]]
- [[_COMMUNITY_Brand and Media Assets|Brand and Media Assets]]
- [[_COMMUNITY_Routing Helpers|Routing Helpers]]
- [[_COMMUNITY_Product Catalog Assets|Product Catalog Assets]]
- [[_COMMUNITY_Resource Media|Resource Media]]
- [[_COMMUNITY_Bootstrap Assets|Bootstrap Assets]]
- [[_COMMUNITY_Hero Slides|Hero Slides]]

## God Nodes (most connected - your core abstractions)
1. `Placeholder imagery` - 26 edges
2. `productCatalog` - 8 edges
3. `resourceCards` - 7 edges
4. `resolveRoute()` - 5 edges
5. `homeSlides` - 5 edges
6. `scripts` - 4 edges
7. `contact` - 4 edges
8. `softwareDetailCatalog` - 4 edges
9. `ClassOneSystem replica` - 4 edges
10. `normalizePath()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Hero placeholder asset` --conceptually_related_to--> `Placeholder imagery`  [AMBIGUOUS]
  src/assets/hero.png → README.md
- `JavaScript logo` --conceptually_related_to--> `Placeholder imagery`  [AMBIGUOUS]
  src/assets/javascript.svg → README.md
- `Vite logo` --conceptually_related_to--> `Placeholder imagery`  [AMBIGUOUS]
  src/assets/vite.svg → README.md
- `PalmSens device image 58` --conceptually_related_to--> `Placeholder imagery`  [INFERRED]
  review-images/01-58.png → README.md
- `PalmSens device image 59` --conceptually_related_to--> `Placeholder imagery`  [INFERRED]
  review-images/02-59.png → README.md

## Hyperedges (group relationships)
- **Product imagery set** — img_01_58, img_02_59, img_03_60, img_04_61, img_05_62 [INFERRED 0.90]
- **Resource media set** — img_06_business_video_call_laptop_1024x683, img_08_screenshot_2025_07_19_112807_1024x574, img_09_screenshot_2025_07_19_113048, img_10_screenshot_2025_07_19_113200, img_11_screenshot_2025_07_21_184542 [INFERRED 0.90]
- **Brand and contact imagery set** — img_07_classone_logo, img_12_whatsapp_image_2025_07_22_at_12_07_37_pm_e1760390529261, img_13_palmsens_canva, img_14_whatsapp_image_2025_12_15_at_3_46_45_pm [INFERRED 0.90]

## Communities (11 total, 1 thin omitted)

### Community 1 - "Content Collections"
Cohesion: 0.12
Nodes (17): ClassOneSystem replica, ClassOneSystem replica README, aboutTeam, applicationCards, biosensorAreas, biosensorProducts, businessSegments, certificateSlides (+9 more)

### Community 2 - "Package Metadata"
Cohesion: 0.14
Nodes (13): dependencies, react, react-dom, devDependencies, vite, name, private, scripts (+5 more)

### Community 3 - "Brand and Media Assets"
Cohesion: 0.28
Nodes (9): Class One Systems logo, Software preview screenshot, Director portrait, EmStat4T promotional poster, Site favicon, Icon sprite, Placeholder imagery, contact (+1 more)

### Community 4 - "Routing Helpers"
Cohesion: 0.33
Nodes (6): App(), capitalizeSlug(), findByAlias(), Header(), normalizePath(), resolveRoute()

### Community 5 - "Product Catalog Assets"
Cohesion: 0.33
Nodes (6): PalmSens device image 58, PalmSens device image 59, PalmSens device image 60, PalmSens device image 61, PalmSens device image 62, productCatalog

### Community 6 - "Resource Media"
Cohesion: 0.4
Nodes (5): Remote demo and tutorial image, Webinar screenshot, Unboxing screenshot, Product explainer screenshot, resourceCards

### Community 8 - "Hero Slides"
Cohesion: 0.67
Nodes (3): PalmSens touch-screen device poster, Hero placeholder asset, homeSlides

## Ambiguous Edges - Review These
- `App.jsx` → `Site favicon`  [AMBIGUOUS]
  public/favicon.svg · relation: conceptually_related_to
- `App.jsx` → `Icon sprite`  [AMBIGUOUS]
  public/icons.svg · relation: conceptually_related_to
- `homeSlides` → `Hero placeholder asset`  [AMBIGUOUS]
  src/assets/hero.png · relation: conceptually_related_to
- `main.jsx` → `JavaScript logo`  [AMBIGUOUS]
  src/assets/javascript.svg · relation: conceptually_related_to
- `main.jsx` → `Vite logo`  [AMBIGUOUS]
  src/assets/vite.svg · relation: conceptually_related_to
- `Placeholder imagery` → `Hero placeholder asset`  [AMBIGUOUS]
  src/assets/hero.png · relation: conceptually_related_to
- `Placeholder imagery` → `JavaScript logo`  [AMBIGUOUS]
  src/assets/javascript.svg · relation: conceptually_related_to
- `Placeholder imagery` → `Vite logo`  [AMBIGUOUS]
  src/assets/vite.svg · relation: conceptually_related_to
- `Placeholder imagery` → `Site favicon`  [AMBIGUOUS]
  public/favicon.svg · relation: conceptually_related_to
- `Placeholder imagery` → `Icon sprite`  [AMBIGUOUS]
  public/icons.svg · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `name`, `version`, `private`, `type`, `dev` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `App.jsx` and `Site favicon`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `App.jsx` and `Icon sprite`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `homeSlides` and `Hero placeholder asset`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `main.jsx` and `JavaScript logo`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `main.jsx` and `Vite logo`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Placeholder imagery` and `Hero placeholder asset`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Placeholder imagery` and `JavaScript logo`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._