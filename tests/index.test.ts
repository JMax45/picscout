import PicScout from '../src/index';

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
});
