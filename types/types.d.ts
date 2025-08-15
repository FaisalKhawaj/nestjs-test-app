declare namespace Express {
  export interface User {
    id: string;
    email: string;
    iat: number;
    exp: number;
  }
  export interface Request {
    user?: User;
  }
}
