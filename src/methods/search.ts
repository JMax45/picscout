import * as cheerio from 'cheerio';
import flatten from 'lodash.flatten';
import collectImageRefs from './collectImageRefs';
import PicScout from '../PicScout';
import getRandomUa from './getRandomUa';
import IMAGE_EXTENSIONS from '../constants/IMAGE_EXTENSIONS';
import BASE_URL from '../constants/BASE_URL';

const containsImageExtension = (s: string) =>
  IMAGE_EXTENSIONS.some((ext) => s.toLowerCase().includes(ext));

interface additionalParams {
  userAgent?: string;
  safe?: boolean;
}

const search = async (
  ctx: typeof PicScout,
  query: string,
  additionalParams?: additionalParams
) => {
  const urlParams = new URLSearchParams();
  urlParams.set('tbm', 'isch');
  urlParams.set('q', query);

  if (additionalParams?.safe || ctx.safe) {
    urlParams.set('safe', 'on');
  }

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

export default search;
export { additionalParams };
