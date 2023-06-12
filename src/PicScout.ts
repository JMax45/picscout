import axiosGet from './methods/axiosGet';
import search, { additionalParams } from './methods/search';

interface PicScout {
  search: (
    query: string,
    additionalParams?: additionalParams
  ) => Promise<
    {
      url: string;
      width: number;
      height: number;
    }[]
  >;
  userAgent?: string;
  safe?: boolean;
  _axiosGet: typeof axiosGet;
}

const PicScout: PicScout = {
  search: (query: string, additionalParams?: additionalParams) =>
    search(PicScout, query, additionalParams),
  userAgent: undefined,
  safe: false,
  _axiosGet: axiosGet,
};

export default PicScout;
