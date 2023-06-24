import BASE_URL from '../src/constants/BASE_URL';
import BING_BASE_URL from '../src/constants/BING_BASE_URL';
import DUCK_DUCK_GO_BASE_URL from '../src/constants/DUCK_DUCK_GO_BASE_URL';
import PicScout from '../src/index';
import Engine from '../src/interfaces/Engine';
import axiosGet from '../src/methods/axiosGet';
import search from '../src/methods/search';
import isSameDomain from '../src/methods/isSameDomain';

const engines: { engine: Engine; domain: string }[] = [
  { engine: 'google', domain: BASE_URL },
  { engine: 'bing', domain: BING_BASE_URL },
  { engine: 'duckduckgo', domain: DUCK_DUCK_GO_BASE_URL },
];

describe('Test PicScout', () => {
  it.each(engines)(
    'Test search method with engine: "$engine"',
    async (element) => {
      const mockMethod = jest.fn(search);
      PicScout.search = (...args) => mockMethod(PicScout, ...args);
      const mockAxiosMethod = jest.fn(PicScout._axiosGet);
      PicScout._axiosGet = mockAxiosMethod;
      const { engine, domain } = element;
      return PicScout.search('cats', {
        engine,
      }).then((res) => {
        expect(res.length).toBeGreaterThan(0);

        expect(mockMethod).toHaveBeenCalledTimes(1);
        const additionalParams = mockMethod.mock.calls[0][2];
        expect(additionalParams).not.toBeUndefined();
        expect(additionalParams?.engine).toBe(engine);

        const [axiosUrl] = mockAxiosMethod.mock.calls[0];
        expect(isSameDomain(axiosUrl, domain)).toBe(true);

        res.forEach((obj) => {
          expect(typeof obj).toBe('object');
          expect(obj).toHaveProperty('url');
          expect(typeof (obj as any).url).toBe('string');
          expect(obj).toHaveProperty('width');
          expect(typeof (obj as any).width).toBe('number');
          expect(obj).toHaveProperty('height');
          expect(typeof (obj as any).height).toBe('number');
        });
      });
    }
  );
  it('Test "safe" option with "google" engine', async () => {
    const mockMethod = jest.fn(axiosGet);
    PicScout._axiosGet = mockMethod;

    return PicScout.search('cats', { safe: true }).then((res) => {
      expect(mockMethod).toHaveBeenCalledTimes(1);
      const [param1] = mockMethod.mock.calls[0];

      const parsedUrl = new URL(param1);
      const { searchParams } = parsedUrl;

      expect(searchParams.get('safe')).toBe('on');
    });
  });
  it('Test "safe" option with "bing" engine', async () => {
    const mockMethod = jest.fn(axiosGet);
    PicScout._axiosGet = mockMethod;

    return PicScout.search('cats', { safe: true, engine: 'bing' }).then(() => {
      expect(mockMethod).toHaveBeenCalledTimes(1);
      const [_param1, param2] = mockMethod.mock.calls[0];

      expect(param2).not.toBeUndefined();
      if (!param2 || !param2.headers)
        return fail('param2 or param2.headers undefined');

      expect(param2.headers.Cookie).toContain('SRCHHPGUSR=ADLT=DEMOTE');
    });
  });
  it('Test "safe" option with "duckduckgo" engine', async () => {
    const mockMethod = jest.fn(axiosGet);
    PicScout._axiosGet = mockMethod;

    return PicScout.search('cats', { safe: true, engine: 'duckduckgo' }).then(
      () => {
        // 2 times because we first make a request to extract the vqd token
        expect(mockMethod).toHaveBeenCalledTimes(2);
        const [param1] = mockMethod.mock.calls[0];

        const parsedUrl = new URL(param1);
        const { searchParams } = parsedUrl;

        expect(searchParams.get('p')).toBe('1');
      }
    );
  });
  it('Test "additionalQueryParams" option', async () => {
    const mockMethod = jest.fn(axiosGet);
    PicScout._axiosGet = mockMethod;

    // This should produce a URL like this:
    // http://images.google.com/search?tbm=isch&q=cats&testparam=test
    const urlParams = new URLSearchParams();
    urlParams.set('testparam', 'test');

    return PicScout.search('cats', {
      additionalQueryParams: urlParams,
    }).then(() => {
      expect(mockMethod).toHaveBeenCalledTimes(1);
      const [param1] = mockMethod.mock.calls[0];

      const parsedUrl = new URL(param1);
      const { searchParams } = parsedUrl;

      expect(searchParams.get('testparam')).toBe('test');
    });
  });
});
