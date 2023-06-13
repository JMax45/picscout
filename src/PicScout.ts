import Engine from './interfaces/Engine';
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
  engine?: Engine;
  _axiosGet: typeof axiosGet;
}

const PicScout: PicScout = {
  search: (...args: Parameters<PicScout['search']>) =>
    search(PicScout, ...args),
  userAgent: undefined,
  safe: false,
  engine: 'google',
  _axiosGet: axiosGet,
};

export default PicScout;
