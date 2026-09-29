import * as cheerio from 'cheerio'; import fs from 'fs';
const $=cheerio.load(fs.readFileSync('../../sites/gtasixguide/migrate/live/index.html','utf8'));
$('svg').replaceWith('<svg/>');
const m=$('#root main').first();
m.children().each((i,c)=>console.log(i,c.tagName,($(c).attr('class')||'').slice(0,80),'|',$(c).text().replace(/\s+/g,' ').slice(0,90)));
console.log($.html(m.children().first()).replace(/></g,'>\n<').slice(0,3800));
