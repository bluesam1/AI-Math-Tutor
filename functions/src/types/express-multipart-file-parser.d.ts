/**
 * Type declarations for express-multipart-file-parser
 */
declare module 'express-multipart-file-parser' {
  import { RequestHandler } from 'express';

  interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  }

  declare global {
    namespace Express {
      interface Request {
        files?: UploadedFile[];
      }
    }
  }

  const fileParser: RequestHandler;
  export default fileParser;
}
