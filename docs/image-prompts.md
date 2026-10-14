# Image Generation Prompts — Dr. Herlon Moura

Prompts for every section of the site, including the hero support elements.
Written to be pasted directly into an image generator (Midjourney / DALL·E /
Firefly / Flux).

## Global style block

Prepend this to every prompt for a consistent set. It encodes the brand's
light-mode palette (deep navy `#0A2540`, vascular blue `#206095`, champagne
gold `#C5A880`) and the glassmorphism language from the references.

```
soft frosted-glass medical aesthetic, deep navy #0A2540 and vascular blue
#206095 with champagne gold #C5A880 accents, clean off-white background,
diffused studio lighting from top-left, shallow depth of field, subtle
specular highlights on glass edges, minimal and premium, no text, no
watermark, 3:2 aspect ratio, photorealistic render
```

For the dark-mode variants, swap the first line to:

```
dark frosted-glass medical aesthetic, near-black #121A21 canvas, deep navy
#1A242F glass panels, vascular blue and champagne gold accent lighting,
rim light on glass edges, moody and premium, no text, 3:2
```

---

## 1. Hero — main visual

**Currently:** `/images/brand/banner-meiohome.jpg` (real photo of the doctor
performing an Eco-Doppler exam).

**Prompt (keep the real photo if possible; this is for a higher-quality
reshoot or a stylised alternative):**

```
Warm documentary photograph of a Brazilian male vascular surgeon in his late
40s wearing a white lab coat over a light blue shirt, seated at a portable
ultrasound machine, holding an ultrasound probe against a seated female
patient's leg, both focused on the screen, modern bright clinic consultation
room with light wood shelving and bamboo blinds, natural window light from
the right, shallow depth of field with the patient and doctor in sharp focus,
patient positioned left of frame and doctor right of frame with clear negative
space above them, soft frosted-glass medical aesthetic, deep navy #0A2540 and
vascular blue #206095 with champagne gold accents, no text, 3:2
```

## 2. Hero — support elements (floating glass cards)

These are the small floating cards the reference design uses to break up a
centred hero. Generate each as a **transparent-background PNG** (or on flat
white, then cut out).

**2a. Credibility chip — "15+ anos"**
```
Minimal 3D glass pill badge floating in space, fully transparent frosted
glass with a crisp 1px white refractive edge and a specular highlight along
the top rim, a small solid emerald-green status dot glowing softly on the
left, champagne gold micro-accents, soft ambient drop shadow beneath, no text
placeholder area on the right, isolated on pure white background, 1:1
```

**2b. Metric card — "Anos de prática"**
```
Minimal 3D glass metric tile, transparent frosted panel with 1px white edge
highlight, a large embossed champagne gold numeral rendered in a geometric
sans-serif occupying the upper area, a thin horizontal progress bar in
vascular blue beneath it at 70% fill, deep navy #0A2540 tint, soft layered
drop shadow, floating at a slight perspective angle, isolated on pure white,
4:3
```

**2c. Accreditation badge — CRM / RQE**
```
Minimal 3D glass shield badge, transparent frosted glass with a crisp white
refractive rim, a polished champagne gold medical cross embossed in the
centre, subtle vascular-blue inner glow, sharp specular highlight on the top
edge, soft contact shadow, floating, isolated on pure white background, 1:1
```

**2d. Trust avatars cluster**
```
Row of five overlapping circular profile avatars of diverse Brazilian
patients, soft studio lighting, rendered on a translucent frosted-glass strip
with a 1px white edge, tiny champagne gold ring around the leftmost avatar,
subtle drop shadow, isolated on pure white, 3:1
```

---

## 3. Trust & credibility ticker

**Currently:** plain text stat cards.

**Prompt:**
```
Set of four minimal 3D glass stat tiles arranged in a row, each a transparent
frosted panel with a 1px white refractive edge and top-edge specular
highlight, each containing one large embossed geometric numeral in champagne
gold, vascular blue #206095 subtle inner tint, soft layered drop shadows
beneath each tile, evenly spaced, isolated on pure white background, 16:9
```

---

## 4. "Por que escolher meu atendimento?" — four pillars

**Currently:** lucide icons in tinted squares.

**Prompt (one image, four panels):**
```
Four minimal 3D glass icon tiles in a 2x2 grid, each a rounded transparent
frosted-glass square with a crisp white refractive rim and top specular
highlight, each holding a single polished champagne gold 3D medical icon:
a scalpel, a heart with a pulse line, a comfortable armchair, and a shield
with a checkmark, vascular blue #206095 soft inner glow, consistent lighting
from top-left, soft drop shadows, isolated on pure white background, 1:1
```

---

## 5. Procedures section — background accent

**Currently:** faded `banner-segundasecao.jpg`.

**Prompt:**
```
Elegant medical illustration of the human circulatory system of the legs and
torso, rendered as fine champagne gold and vascular blue line work on a very
pale off-white background, anatomical and precise but highly stylised,
flowing vein and artery network, low contrast so it reads as a subtle
background texture, generous empty space on the left for text overlay,
no text, 16:9
```

---

## 6. Individual procedure icons

**Note:** the site now uses the **original cliniq-theme glyphs** from
herlonmoura.com.br (vendored at `public/fonts/cliniq/`), so no images are
needed here. If a richer 3D set is ever wanted, generate one per procedure:

```
Minimal 3D glass icon of [SUBJECT], transparent frosted glass body with a
crisp white refractive rim and a sharp specular highlight along the top edge,
polished champagne gold #C5A880 primary form with vascular blue #206095
accents, consistent top-left lighting, soft contact shadow, floating,
isolated on pure white background, 1:1, no text
```

Subjects, one per procedure: `an ultrasound probe emitting waves` ·
`a laser beam targeting a vein` · `a syringe injecting foam into a vessel` ·
`microsurgical scissors and a fine incision` · `a subcutaneous implantable
port` · `a long-term dialysis catheter` · `an artery joined to a vein` ·
`a blood clot dissolving inside a vein` · `a blood clot inside an artery` ·
`a narrowed artery being widened` · `a balloon catheter opening a leg artery` ·
`the carotid artery in the neck` · `an aortic stent graft` ·
`a torn aortic wall being repaired` · `a visceral artery aneurysm`

---

## 7. Mid-page banner — Eco-Doppler

**Currently:** real photo `banner-meiohome.jpg`, reused from the hero.

**Prompt (a distinct second image so the two sections don't repeat):**
```
Close-up photograph of a modern colour Doppler ultrasound screen in a bright
clinic, showing a clear vascular scan of a leg artery with red and blue flow
mapping, a vascular surgeon's hand resting on the machine controls at the
edge of frame, screen sharply in focus and background softly blurred, cool
clinical lighting with a champagne gold reflection on the screen bezel, soft
frosted-glass medical aesthetic, no readable text on screen, 16:9
```

---

## 8. Doctor bio section — portrait

**Currently:** `/images/brand/dr-photoroom.png` (cut-out portrait).

**Prompt (transparent cut-out, to replace or refresh the current one):**
```
Professional studio portrait of a Brazilian male vascular surgeon in his late
40s, short dark hair, warm confident expression, wearing a crisp white lab
coat over a light blue shirt, arms relaxed, shot from mid-thigh up, even soft
key light from the front-left with a subtle champagne gold rim light on the
right shoulder, plain background to be removed, photorealistic, high
resolution, 2:3, no text
```

---

## 9. Symptom mapping — two anatomical cards

**Prompt (two images):**

**9a. Arms and legs**
```
Clean medical illustration of human arms and legs showing the superficial
venous network, fine vascular blue and champagne gold line work on a pale
off-white background, with soft highlighted zones marking where symptoms
occur, stylised and calm rather than clinical or gory, generous negative
space, no text, 3:4
```

**9b. Trunk and neck**
```
Clean medical illustration of the human torso and neck showing the carotid
arteries and central vessels, fine vascular blue and champagne gold line work
on a pale off-white background, soft highlighted zones marking the neck and
chest, stylised and calm, generous negative space, no text, 3:4
```

---

## 10. DVT calculator section — supporting visual

**Prompt:**
```
Abstract 3D render of a blood vessel cross-section with a forming clot,
rendered as translucent frosted glass, the healthy vessel wall in vascular
blue #206095 and the clot in warm amber, a soft champagne gold glow
illuminating the vessel interior, clean off-white background, centred
composition with space around it, premium medical visualisation, no text, 1:1
```

---

## 11. Final CTA section

**Prompt:**
```
Minimal 3D scene of a smartphone displaying a chat interface, floating at a
slight angle above a translucent frosted-glass surface, a soft emerald-green
glow emanating from behind the phone, champagne gold accents on the glass
edges, clean off-white background with a very soft radial gradient, soft
layered shadows, premium and calm, no readable text, 16:9
```

---

## 12. Blog / article thumbnails

**Prompt template:**
```
Minimal 3D glass illustration representing [TOPIC], transparent frosted glass
forms with crisp white refractive edges, champagne gold and vascular blue
palette, clean off-white background, soft studio lighting from top-left,
generous negative space, premium editorial medical illustration, no text, 16:9
```

Topics: `varicose veins` · `deep vein thrombosis` · `vascular Doppler exam` ·
`prevention for patients over 50` · `spider veins` · `arterial disease`

---

## Generation notes

- **Consistency:** keep the lighting direction (top-left) identical across all
  images. Inconsistent light is the fastest way to make a set look assembled
  rather than designed.
- **Negative prompts:** add `text, letters, words, watermark, signature, logo,
  blurry, low contrast, cluttered, cartoonish, oversaturated` to every prompt.
- **Transparent assets:** for the hero support elements and the doctor
  portrait, generate on flat white and cut out, or use a generator with native
  alpha output.
- **Do not generate:** anything depicting a real identifiable patient, or any
  image implying a specific medical outcome. Keep illustrations anatomical and
  stylised.
- **Aspect ratios** are noted per prompt; the hero and mid-page banners are the
  only wide-format images, everything else is square or portrait so it fits
  the card grid without cropping.
