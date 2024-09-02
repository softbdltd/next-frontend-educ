import Konva from 'konva';
import {ImageConfig, ShapeType} from '../interfaces/Shape';
import {Template} from './../interfaces/StageConfig';
import {readBlobAsDataURL} from './imageUtil';

export async function toTemplateJSON(template: Template) {
  const images = new Map<string, string>();

  await Promise.all(
    template.elements.map(async (element) => {
      const props = element.props as ImageConfig;

      if (
        element.type === ShapeType.Image &&
        props.image instanceof Image &&
        props.image.src.startsWith('blob:')
      ) {
        const response = await fetch(new Request(props.image.src));
        const dataSrc = await readBlobAsDataURL(await response.blob());
        images.set(props.image.src, dataSrc);
      }
      if (element.type === ShapeType.QrImage) {
      }
    }),
  );

  return JSON.stringify(template, (_, value) => {
    if (value === Konva.Filters.Blur) {
      return 'blur';
    }

    if (value instanceof Image) {
      return images.get(value.src) || value.src;
    }
    return value;
  });
}

export async function loadTemplateImages(template: Template) {
  await Promise.all(
    template.elements.map(async (element) => {
      return new Promise<void>((resolve, reject) => {
        if ('image' in element.props) {
          const image = new Image();

          image.src = element.props.image;
          const onLoad = () => {
            image.removeEventListener('load', onLoad);
            image.removeEventListener('error', reject);
            element.props.image = image;
            resolve();
          };

          image.addEventListener('load', onLoad);
          image.addEventListener('error', reject);
        } else {
          resolve();
        }
      });
    }),
  );
}
