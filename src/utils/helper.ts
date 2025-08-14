import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PaginationResponse } from 'src/common/dto/pagination-response.dto';

export class Helper {
  /**
   *this method decrypt the token using crypto library
   * @param token user token provided as string
   * @returns decrypt token as string
   */
  public static decrypt(encryptedToken: string): string {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(process.env.ENCRYPTION_SECRET),
      Buffer.from(process.env.ENCRYPTION_IV),
    );
    let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   *this method encrypt the token using crypto library
   * @param token user token provided as string
   * @returns encrypted token as string
   */
  public static encryption(token: string): string {
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(process.env.ENCRYPTION_SECRET, 'base64'),
      Buffer.from(process.env.ENCRYPTION_IV, 'base64'),
    );
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   *this method encode the password using bcrypt library
   * @param password user password provided as string
   * @returns
   */
  public static async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  /**
   *this method match the password using bcrypt library
   * @param password user password provided as string
   * @param userPassword encrypted password stored in database
   * @returns
   */
  public static async comparePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    if (!password || !userPassword) {
      return false;
    }
    const compare = bcrypt.compareSync(password, userPassword);
    return compare;
  }

  /**
   * this method will paginate the data
   * @param data array of data with array indexes
   * @param page number of page to paginate
   * @param limit number of items to show per page
   * @returns array of paginated data along with metadata
   */
  public static paginateResponse<T>({
    data,
    page,
    limit,
  }: {
    data: [T[], number];
    page: number;
    limit: number;
  }): PaginationResponse<T> {
    const [result, totalRecords] = data; // Assuming data is the array of users
    const totalPages = Math.ceil(totalRecords / limit);
    const nextPage = page + 1 > totalPages ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: result,
      metaInfo: {
        totalRecords,
        itemsPerPage: result.length,
        currentPage: page,
        nextPage: nextPage,
        prevPage: prevPage,
        totalPages: totalPages,
      },
    };
  }

  public static convertIntoUTCTime(dataString: number): Date {
    const timestamp = dataString * 1000; // Convert to milliseconds
    const date = new Date(timestamp);
    return date;
  }

  /**
   * Generates a random 6-digit OTP (One-Time Password).
   *
   * @returns The generated OTP as a string.
   */
  public static generateOTP(length = 4): string {
    // Generate a random number with specified digits
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const otp = Math.floor(min + Math.random() * (max - min + 1)).toString();
    return otp;
  }
  // generateRandomPassword
  public static generateRandomPassword(length = 8): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  /**
   * Builds a TypeORM order object based on sorting parameters
   * @param sortBy Field to sort by
   * @param sortOrder Order direction (ASC or DESC)
   * @param allowedFields Array of allowed field names to prevent SQL injection
   * @param defaultField Default field to sort by if sortBy is invalid
   * @returns Order configuration object for TypeORM
   */
  public static buildSortingOrder(
    sortBy: string | undefined,
    sortOrder: 'ASC' | 'DESC',
    allowedFields: string[],
    defaultField: string = 'id',
  ): Record<string, 'ASC' | 'DESC'> {
    const order: Record<string, 'ASC' | 'DESC'> = {};

    if (sortBy && allowedFields.includes(sortBy)) {
      order[sortBy] = sortOrder;
    } else {
      order[defaultField] = sortOrder;
    }

    return order;
  }

  public static generateSlug(title: string): string {
    // Remove special characters and spaces, convert to lowercase, and replace spaces with hyphens
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
}
