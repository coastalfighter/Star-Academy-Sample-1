# 08 — Photography

## Current state: temporary stock photography

All 17 photo slots currently show royalty-free photos from **Pexels**. They're chosen to match each slot's content, so every service page shows that discipline (a letter card for speech, block stacking for OT, supported first steps for PT, a breathing treatment for nursing).

**License:** [Pexels License](https://www.pexels.com/license/): free for commercial use, modification allowed, no attribution required. Photos can't be sold unaltered, and identifiable people can't be shown in a way that's offensive or implies they endorse something.

**Honesty rules we follow:**
- Alt text describes what's in the photo, never "STARS staff" or "a STARS classroom". A unit test enforces this.
- Stock photos aren't used where they would imply real people: leadership portraits remain placeholders, and the About/Careers "team" slots show generic staff-at-work scenes rather than a fake team photo.

> The client brief asked to avoid generic stock photography. These images are a **stand-in for the pitch or preview**. We recommend replacing them with a one- or two-day documentary shoot at STARS before launch (with signed releases). Each slot's original shot brief is still in the code as the shot list.

## Photo map

| Where | Key | Alt text | Source |
|---|---|---|---|
| Home hero | `story-time-close` | A teacher leans in to share a picture book with two young children, who smile as they look at the page. | [Pexels 8613091](https://www.pexels.com/photo/8613091/) |
| Home hero (inset) | `ball-pit-play` | A smiling toddler sits in a colorful ball pit during sensory play. | [Pexels 27175469](https://www.pexels.com/photo/27175469/) |
| Home — A day at STARS | `classroom-play` | Preschoolers play with colorful balls and a toy train on a classroom rug while two teachers join in on the floor. | [Pexels 8422204](https://www.pexels.com/photo/8422204/) |
| Services hub | `guided-play` | An adult guides two young children through a hands-on matching game on the floor. | [Pexels 8535583](https://www.pexels.com/photo/8535583/) |
| Developmental Classrooms | `floor-play` | A teacher sits on the floor with three toddlers, building with wooden pegs, blocks and balls. | [Pexels 8422253](https://www.pexels.com/photo/8422253/) |
| Speech Therapy | `letter-cards` | An educator holds up a letter A card as two young children watch and listen. | [Pexels 8087859](https://www.pexels.com/photo/8087859/) |
| Occupational Therapy | `block-stacking` | A toddler concentrates on carefully stacking colorful wooden blocks. | [Pexels 3662635](https://www.pexels.com/photo/3662635/) |
| Physical Therapy | `supported-steps` | An adult holds a baby's hands to support their first steps across the floor. | [Pexels 7491095](https://www.pexels.com/photo/7491095/) |
| Nursing Care | `breathing-treatment` | A nurse in a white coat helps a young girl with a breathing treatment mouthpiece. | [Pexels 7447004](https://www.pexels.com/photo/7447004/) |
| Our Approach (hero) | `teacher-hugs` | Two teachers kneel to hug a group of happy young children in a bright classroom. | [Pexels 8613085](https://www.pexels.com/photo/8613085/) |
| Our Approach — For our team | `colleagues-laughing` | Three colleagues laugh together around a table with notebooks and coffee mugs. | [Pexels 2041390](https://www.pexels.com/photo/2041390/) |
| Getting Started | `family-meeting` | Parents sit on a sofa with their daughter, who holds a teddy bear, as they talk with a professional. | [Pexels 7447259](https://www.pexels.com/photo/7447259/) |
| Careers (hero) | `easel-support` | An educator sits beside a young boy as he draws on a chalkboard easel. | [Pexels 8613090](https://www.pexels.com/photo/8613090/) |
| Careers — Life at STARS | `colleagues-planning` | Colleagues smile and talk while working together at a shared table. | [Pexels 2041386](https://www.pexels.com/photo/2041386/) |
| Home — Careers | `floor-game` | An educator kneels on the floor at children's eye level, playing a picture-matching game with three preschoolers. | [Pexels 8535574](https://www.pexels.com/photo/8535574/) |
| Home — Visit | `parent-child-walk` | A parent and young child walk hand in hand across a sunny park lawn. | [Pexels 7880775](https://www.pexels.com/photo/7880775/) |
| About (hero) | `story-time-group` | A teacher reads aloud to a group of preschoolers gathered around her in a bright classroom. | [Pexels 8613089](https://www.pexels.com/photo/8613089/) |

## How it works

- Registry: `src/lib/photos.json` stores the Pexels ID, alt text, focal point (`position`) and dimensions.
- `npm run photos` downloads each photo and writes responsive WebP files at 480, 800, 1200 and 1600px wide to `public/photos/` (4.6 MB total; browsers download only the size they need via `srcset`).
- `<Photo image="key" … />` renders the image. Its `brief` stays as the shot description for the future photo shoot.

## Replacing with real STARS photos

1. Put the new photo's details in `photos.json` (or use `src` + `alt` directly on the `Photo` component, or the CMS photo field on service pages).
2. Write alt text that describes the scene. Now it *can* mention STARS.
3. Adjust `position` so faces stay in frame at every crop.
4. Delete the unused stock entry. The test suite flags unused or missing photos.
