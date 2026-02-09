import fs from 'fs';
import path from 'path';

export const getFonts = async () => {
  const fontPathRegular = path.join(process.cwd(), 'fonts', 'Sarabun-Regular.ttf');
  const fontPathBold = path.join(process.cwd(), 'fonts', 'Sarabun-Bold.ttf');

  const regularParams = {
    data: fs.readFileSync(fontPathRegular),
    fallback: true,
  };

  const boldParams = {
    data: fs.readFileSync(fontPathBold),
    fallback: false,
  };

  return {
    Sarabun: {
      data: regularParams.data,
      fallback: true,
    },
    SarabunBold: {
        data: boldParams.data,
        fallback: false
    }
  };
};

export const getFontsBase64 = async () => { 
    const fontPathRegular = path.join(process.cwd(), 'fonts', 'Sarabun-Regular.ttf');
    const fontPathBold = path.join(process.cwd(), 'fonts', 'Sarabun-Bold.ttf');

    const regularBase64 = fs.readFileSync(fontPathRegular).toString('base64');
    const boldBase64 = fs.readFileSync(fontPathBold).toString('base64');

    return {
        Sarabun: {
            data: regularBase64,
            fallback: true
        },
        SarabunBold: {
            data: boldBase64,
            fallback: false
        }
    }
}
