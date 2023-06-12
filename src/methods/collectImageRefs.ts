import IMAGE_EXTENSIONS from '../constants/IMAGE_EXTENSIONS';
import PicScoutRes from '../interfaces/PicScoutRes';
import isValidUrl from './isValidUrl';

const EXTENSION_REGEX = new RegExp(`(${IMAGE_EXTENSIONS.join('|')})$`, 'i');

const collectImageRefs = (content: string) => {
  const refs: PicScoutRes[] = [];
  const regex = /\["(http.+?)",(\d+),(\d+)\]/g;
  let result;
  while ((result = regex.exec(content)) !== null) {
    if (
      result.length > 3 &&
      isValidUrl(result[1]) &&
      EXTENSION_REGEX.test(result[1])
    ) {
      refs.push({
        url: result[1],
        width: parseInt(result[3]),
        height: parseInt(result[2]),
      });
    }
  }
  return refs;
};

export default collectImageRefs;
