import Sharp, { FormatEnum } from 'sharp';
import Dimension from '../../types/dimension';

export type ResizableFormat = keyof FormatEnum;

class ResizeService {
  run(
    src: Buffer,
    dstDimension: Dimension,
    dstFormat: ResizableFormat
  ): Promise<Buffer> {
    return Sharp(src)
      .resize(dstDimension.width, dstDimension.height)
      .toFormat(dstFormat)
      .toBuffer();
  }
}

export default new ResizeService();
