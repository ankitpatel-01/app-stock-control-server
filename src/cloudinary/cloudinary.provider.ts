import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants/constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: 'ddp9ies5o',
      api_key: '787556844472313',
      api_secret: '2GoX639VAsvdaCNKJTAucN_zclE',
    });
  },
};
