import PicScoutRes from './interfaces/PicScoutRes';
import axiosGet from './methods/axiosGet';
import search from './methods/search';

interface PicScout {
  search: (
    ...args: Parameters<typeof search> extends [any, ...infer RestParams]
      ? RestParams
      : never
  ) => Promise<PicScoutRes[]>;
  userAgent?: string;
  safe?: boolean;
  _axiosGet: typeof axiosGet;
}

const PicScout: PicScout = {
  search: (...args: Parameters<PicScout['search']>) =>
    search(PicScout, ...args),
  userAgent: undefined,
  safe: false,
  _axiosGet: axiosGet,
};

export default PicScout;
