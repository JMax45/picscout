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
}

const PicScout: PicScout = {
  search: (query: string, additionalParams?: additionalParams) =>
    search(PicScout, query, additionalParams),
  userAgent: undefined,
};

export default PicScout;
