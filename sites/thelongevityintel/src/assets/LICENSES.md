# Image licences

`heroes/photo-*.jpg` are the article hero photographs the old site hotlinked from images.unsplash.com. They are now
downloaded once and self-hosted (resized to 1200 px wide) so pages no longer depend on a third party at load time.
They are used under the [Unsplash licence](https://unsplash.com/license) (free to use, no permission or attribution
required). The file name is the Unsplash photo id: `https://unsplash.com/photos/<id without the "photo-" prefix and hash>`;
the original URL for each is recorded in `src/data/heroes.json`.

The four portraits the old site kept in `public/experts/` (real people) were **not** carried over: no likeness licence
is on record. Expert protocol pages use initials monograms instead.

Added in the design pass (same Unsplash licence, downloaded at 1200 px wide): `photo-1532187863486-abf9dbad1b69.jpg` (home hero, Bryan Johnson protocol) and `photo-1582719478250-c89cae4dc85b.jpg` (Sinclair protocol). The old site's `logo.png` and `og-default.png` were made by the site owner and are carried over as `public/og-default.png`.
