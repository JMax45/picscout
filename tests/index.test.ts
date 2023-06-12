import PicScout from '../src/index';
import axiosGet from '../src/methods/axiosGet';

describe('Test PicScout', () => {
  it('Test search method', async () => {
    return PicScout.search('cats').then((res) => {
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
  });
  it('Test "safe" option', async () => {
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
