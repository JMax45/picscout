import PicScout from '../src/index';
import Engine from '../src/interfaces/Engine';
import axiosGet from '../src/methods/axiosGet';
import search from '../src/methods/search';

describe('Test PicScout', () => {
  it.each(['google', 'bing'] as Array<Engine>)(
    'Test search method with engine: "%s"',
    async (engine) => {
      const mockMethod = jest.fn(search);
      PicScout.search = (...args) => mockMethod(PicScout, ...args);
      return PicScout.search('cats', {
        engine,
      }).then((res) => {
        expect(mockMethod).toHaveBeenCalledTimes(1);
        const additionalParams = mockMethod.mock.calls[0][2];
        expect(additionalParams).not.toBeUndefined();
        expect(additionalParams?.engine).toBe(engine);

        expect(res.length).toBeGreaterThan(0);

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
