import * as cheerio from 'cheerio';
import flatten from 'lodash.flatten';
import collectImageRefs from './collectImageRefs';
import PicScout from '../PicScout';
import getRandomUa from './getRandomUa';
import IMAGE_EXTENSIONS from '../constants/IMAGE_EXTENSIONS';
import BASE_URL from '../constants/BASE_URL';
import Engine from '../interfaces/Engine';
import PicScoutRes from '../interfaces/PicScoutRes';
import BING_BASE_URL from '../constants/BING_BASE_URL';
import DUCK_DUCK_GO_BASE_URL from '../constants/DUCK_DUCK_GO_BASE_URL';

const containsImageExtension = (s: string) =>
  IMAGE_EXTENSIONS.some((ext) => s.toLowerCase().includes(ext));

interface additionalParams {
  userAgent?: string;
  safe?: boolean;
  additionalQueryParams?: URLSearchParams;
  engine?: Engine;
}

const googleSearch = async (...args: Parameters<typeof search>) => {
  const [ctx, query, additionalParams] = args;
  const urlParams = new URLSearchParams();
  urlParams.set('tbm', 'isch');
  urlParams.set('q', query);

  if (additionalParams?.safe || ctx.safe) {
    urlParams.set('safe', 'on');
  }
  if (additionalParams?.additionalQueryParams)
    additionalParams.additionalQueryParams.forEach((val, key) =>
      urlParams.set(key, val)
    );

  const url = new URL(BASE_URL);
  url.search = urlParams.toString();

  const res = await ctx._axiosGet(url.href, {
    headers: {
      'User-Agent':
        additionalParams?.userAgent || ctx.userAgent || getRandomUa(),
    },
  });

  const body = res.data;
  const $ = cheerio.load(body);
  const scripts = $('script');
  const scriptContents = [];
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].children.length > 0) {
      const content = (scripts[i].children[0] as any).data;
      if (containsImageExtension(content)) {
        scriptContents.push(content);
      }
    }
  }

  return flatten(scriptContents.map(collectImageRefs));
};

const bingSearch = async (...args: Parameters<typeof search>) => {
  const [ctx, query, additionalParams] = args;
  const urlParams = new URLSearchParams();
  urlParams.set('q', query);

  if (additionalParams?.additionalQueryParams)
    additionalParams.additionalQueryParams.forEach((val, key) =>
      urlParams.set(key, val)
    );

  const url = new URL(BING_BASE_URL);
  url.search = urlParams.toString();

  const res = await ctx._axiosGet(url.href, {
    headers: {
      'User-Agent':
        additionalParams?.userAgent || ctx.userAgent || getRandomUa(),
      ...(additionalParams?.safe || ctx.safe
        ? { Cookie: 'SRCHHPGUSR=ADLT=DEMOTE;' }
        : { Cookie: 'SRCHHPGUSR=ADLT=OFF;' }),
    },
  });

  const body = res.data;
  const $ = cheerio.load(body);
  const images = $('a.iusc');
  const imagesContents: PicScoutRes[] = [];
  for (let i = 0; i < images.length; i++) {
    try {
      const parsed = JSON.parse(images[i].attribs.m);
      const parsedUrl = new URL(BING_BASE_URL + images[i].attribs.href);
      const { searchParams } = parsedUrl;
      imagesContents.push({
        url: parsed.murl,
        width: parseInt(searchParams.get('expw') || '0'),
        height: parseInt(searchParams.get('exph') || '0'),
      });
    } catch (err) {}
  }
  return imagesContents;
};

const duckDuckGoSearch = async (...args: Parameters<typeof search>) => {
  const [ctx, query, additionalParams] = args;
  let urlParams = new URLSearchParams();
  urlParams.set('q', query);
  urlParams.set('iax', 'images');
  urlParams.set('ia', 'images');

  if (additionalParams?.safe || ctx.safe) {
    urlParams.set('p', '1');
  } else {
    urlParams.set('p', '-1');
  }

  if (additionalParams?.additionalQueryParams)
    additionalParams.additionalQueryParams.forEach((val, key) =>
      urlParams.set(key, val)
    );

  let url = new URL(DUCK_DUCK_GO_BASE_URL);
  url.search = urlParams.toString();

  // First we need to extract the "vqd"
  let res = await ctx._axiosGet(url.href, {
    headers: {
      'User-Agent':
        additionalParams?.userAgent || ctx.userAgent || getRandomUa(),
      ...(additionalParams?.safe || ctx.safe ? {} : {}),
    },
  });

  const vqdRegex = /vqd="([^"]+)"/;
  const match = res.data.toString().match(vqdRegex);
  const vqdValue = match ? match[1] : null;
  if (!vqdValue) throw new Error('Failed to extract vqd');

  url = new URL(DUCK_DUCK_GO_BASE_URL);
  url.pathname = '/i.js';
  urlParams = new URLSearchParams();
  urlParams.set('o', 'json');
  urlParams.set('q', query);
  urlParams.set('vqd', vqdValue);
  urlParams.set('f', ',,,,,');

  if (additionalParams?.safe || ctx.safe) {
    urlParams.set('p', '1');
  } else {
    urlParams.set('p', '-1');
  }

  if (additionalParams?.additionalQueryParams)
    additionalParams.additionalQueryParams.forEach((val, key) =>
      urlParams.set(key, val)
    );
  url.search = urlParams.toString();

  res = await ctx._axiosGet(url.href, {
    headers: {
      'User-Agent':
        additionalParams?.userAgent || ctx.userAgent || getRandomUa(),
      ...(additionalParams?.safe || ctx.safe ? {} : {}),
    },
  });

  return res.data.results.map((e: any) => ({
    url: e.image,
    width: e.width,
    height: e.height,
  }));
};

const search = async (
  ctx: typeof PicScout,
  query: string,
  additionalParams?: additionalParams
): Promise<PicScoutRes[]> => {
  const engine = additionalParams?.engine || ctx.engine;
  switch (engine) {
    case 'google':
      return googleSearch(ctx, query, additionalParams);
    case 'bing':
      return bingSearch(ctx, query, additionalParams);
    case 'duckduckgo':
      return duckDuckGoSearch(ctx, query, additionalParams);
    default:
      return googleSearch(ctx, query, additionalParams);
  }
};

export default search;
export { additionalParams };
