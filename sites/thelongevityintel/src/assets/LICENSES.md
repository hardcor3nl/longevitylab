# Image licences

`heroes/photo-*.jpg` are the article hero photographs the old site hotlinked from images.unsplash.com. They are now
downloaded once and self-hosted (resized to 1200 px wide) so pages no longer depend on a third party at load time.
They are used under the [Unsplash licence](https://unsplash.com/license) (free to use, no permission or attribution
required). The file name is the Unsplash photo id: `https://unsplash.com/photos/<id without the "photo-" prefix and hash>`;
the original URL for each is recorded in `src/data/heroes.json`.

The old site's four portraits in `public/experts/` had no licence on record and were **not** carried over.
They are replaced (29 Sept 2026) by Creative Commons portraits from Wikimedia Commons, credited on every card and on
each protocol page (credit data in `src/data/protocols.json` → `expertImageCredit`):

- `public/experts/bryan-johnson.jpg`: "Bryan Johnson 2026" by M Robertson, CC BY 4.0, https://commons.wikimedia.org/wiki/File:Bryan_Johnson_2026.jpg (resized)
- `public/experts/andrew-huberman.jpg`: "Andrew D. Huberman, Ph.D." by Jamesbrianbounds, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Andrew_D._Huberman,_Ph.D..jpg (resized; this derivative is shared under CC BY-SA 4.0)
- `public/experts/david-sinclair.jpg`: "UN AI for Good Summit 2025 - David Sinclair 01" by Xuthoria, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:UN_AI_for_Good_Summit_2025_-_David_Sinclair_01.jpg (cropped to head and shoulders; this derivative is shared under CC BY-SA 4.0)

Portraits are editorial illustration of public figures whose published protocols the page summarises; they imply no endorsement.

Added in the design pass (same Unsplash licence, downloaded at 1200 px wide): `photo-1532187863486-abf9dbad1b69.jpg` (home hero, Bryan Johnson protocol) and `photo-1582719478250-c89cae4dc85b.jpg` (Sinclair protocol). The old site's `logo.png` and `og-default.png` were made by the site owner and are carried over as `public/og-default.png`.
