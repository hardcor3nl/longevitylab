// copy referenced assets from the old repo public/, write webp siblings
import fs from 'node:fs'; import path from 'node:path'; import sharp from 'sharp';
const OLD='C:/Users/michael/Projects/Websites/gtasixguide/public';
const site=path.resolve(import.meta.dirname,'../../../../sites/gtasixguide');
const urls=JSON.parse(fs.readFileSync(site+'/migrate/asset-urls.json','utf8')).filter(u=>!u.startsWith('/data/launch'));
const extra=['/favicon.svg','/favicon.png','/icon-192.png','/logo-512.png','/apple-touch-icon.png','/og-image.jpg','/assets/gtamap.jpg','/assets/leonida-community-map-v051.jpg','/data/markers.json','/data/trailer-1-analysis.md','/data/trailer-2-analysis.md'];
let n=0,w=0,bytes=0,wbytes=0;
for (const u of new Set([...urls,...extra])) {
  const src=OLD+u.split('?')[0]; if(!fs.existsSync(src)) {console.log('missing',u);continue;}
  const dst=site+'/public'+u.split('?')[0]; fs.mkdirSync(path.dirname(dst),{recursive:true}); fs.copyFileSync(src,dst); n++; bytes+=fs.statSync(src).size;
  if (/\.(jpe?g|png)$/i.test(u) && !/(favicon|icon-|logo-|apple-touch|og-image)/.test(u)) {
    const out=dst.replace(/\.(jpe?g|png)$/i,'.webp');
    await sharp(src).resize({width:1600,withoutEnlargement:true}).webp({quality:78}).toFile(out); w++; wbytes+=fs.statSync(out).size;
    for (const width of [640, 960]) { const o2=out.replace(/\.webp$/,'-'+width+'.webp'); await sharp(src).resize({width,withoutEnlargement:true}).webp({quality:72}).toFile(o2); wbytes+=fs.statSync(o2).size; }
  }
}
console.log({copied:n,webp:w,origMB:(bytes/1e6).toFixed(1),webpMB:(wbytes/1e6).toFixed(1)});
