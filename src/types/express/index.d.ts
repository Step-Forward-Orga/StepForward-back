import { JwtPayload } from '../../authentication/contracts/JwtPayload.interface';

declare global {
  namespace Express {
    export interface Request {
      user: JwtPayload;
    }
  }
}
