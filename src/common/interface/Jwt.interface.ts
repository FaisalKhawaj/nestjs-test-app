export interface JwtPayload {
  id: string | number;
  email?: string;
  username?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
