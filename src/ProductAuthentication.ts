import axios, { AxiosError, AxiosRequestConfig } from "axios";

/**
 * ProductAuthentication options
 *
 * @type interface
 */
export interface IProductAuthenticationOptions {
  userName?: string;
  apiKey?: string;
  baseUrl: string;
}

/**
 * ProductAuthentication inserted data blueprint
 *
 * @type interface
 */
export interface IProductAuthenticationCreateData {
  id: string;
  metadata?: {};
  verificationOptions?: {
    min: number;
    max: number;
    current: number;
  };
}

/**
 * ProductAuthentication response data blueprint
 *
 * @type interface
 */
export interface IProductAuthenticationVerifyReturnData {
  message: string;
  success: boolean;
  data: {};
}

/**
 * IProductAuthenticationCreate interface
 *
 * @type interface
 */
export interface IProductAuthenticationCreate {
  create(
    data: IProductAuthenticationCreateData
  ): Promise<IProductAuthenticationVerifyReturnData>;
}

/**
 * IProductAuthenticationVerify interface
 *
 * @type interface
 */
export interface IProductAuthenticationVerify {
  verify(productId: string): Promise<IProductAuthenticationVerifyReturnData>;
}

/**
 * ProductAuthentication class
 *
 * This is the main class for the ProductAuthentication module.
 * The main responsibility of this class is to -
 *  1. create API handler
 *  2. verify API handler
 *
 * @type class
 *
 * @param {IProductAuthenticationOptions} options
 */
export class ProductAuthentication
  implements IProductAuthenticationCreate, IProductAuthenticationVerify
{
  private options: IProductAuthenticationOptions;

  constructor(options: IProductAuthenticationOptions) {
    this.options = options;

    Object.setPrototypeOf(this, ProductAuthentication.prototype);
  }

  /**
   * Getting `Verify` endpoint url
   *
   * @param  username  name of the user
   * @param  productId id/sku of the product
   * @returns string
   *
   * */
  private getVerifyUrl = (username: string, productId: string): string => {
    const url = this.options.baseUrl.replace(/\/$/, "");
    return `${url}/v1/product/authentication/verify/${username}/${productId}`;
  };

  /**
   * Getting `Create` endpoint url
   *
   * @returns string
   *
   * */
  private getCreateUrl = (): string => {
    const url = this.options.baseUrl.replace(/\/$/, "");
    return `${url}/v1/product/authentication/create`;
  };

  /**
   * Validate options User Name is empty or not
   *
   * @returns void or throws error
   */
  private validateUsernameOptions = (): void => {
    if (!this.options.userName) {
      throw new Error("User Name is required");
    }
  };

  /**
   * Validate url
   *
   * @param url string
   * @returns boolean
   */
  private validURL = (str: string) => {
    var pattern = new RegExp(
      "^(https?:\\/\\/)" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  };

  /**
   * Validate options baseUrl is empty or not
   *
   * @returns void or throws error
   */
  private validateBaseUrlOptions = (): void => {
    if (!this.options.baseUrl) {
      throw new Error("Base Url is required");
    }
    if (!this.validURL(this.options.baseUrl)) {
      throw new Error(
        "Base Url is not valid. Example: https://example.com/prod"
      );
    }
  };

  /**
   * Validate options api key is empty or not
   *
   * @returns void or throws error
   */
  private validateApiKeyOptions = (): void => {
    if (!this.options.apiKey) {
      throw new Error("Api key is required");
    }
  };

  /**
   * Api Calling
   *
   * @returns Promise
   */
  private apiCalling = async (
    axiosConfig: AxiosRequestConfig<any>
  ): Promise<any> => {
    const fetchData = await axios(axiosConfig);
    return fetchData;
  };

  /**
   * Handling error message based on the error code
   *
   * @param errorCode number
   * @returns string
   * */
  private ErrorHandler = (errorCode: number): string => {
    if (errorCode === 101) {
      return "Product is not genuine";
    } else if (errorCode === 102) {
      return "Product verification maximum limit reached";
    }
    return "Unknown error";
  };

  /**
   * The responsibility of this function is to verify product
   *
   * @param productId string
   * @returns Promise
   * */
  public verify = async (
    productId: string
  ): Promise<IProductAuthenticationVerifyReturnData> => {
    this.validateUsernameOptions(); // validate username
    this.validateBaseUrlOptions(); // validate base url

    // default return values of function
    const returnData: IProductAuthenticationVerifyReturnData = {
      success: true,
      message: "",
      data: {},
    };

    try {
      const userName = this.options.userName || ""; // get user name
      const getUrl = this.getVerifyUrl(userName, productId); // get verify url

      // set axios config
      const axiosConfig = {
        method: "GET",
        url: getUrl,
      };
      // calling api
      const fetchData = await this.apiCalling(axiosConfig);

      // return data
      returnData.message = "Product is genuine";
      returnData.data = fetchData.data;
      returnData.success = true;
    } catch (error: any) {
      returnData.success = false;

      // check is error type is AxiosError
      if (error instanceof AxiosError) {
        const { response } = error;
        if (response?.data) {
          returnData.message = this.ErrorHandler(response?.data?.errorCode);
        } else {
          returnData.message = error?.message;
        }
        returnData.data = response?.data;
      } else {
        returnData.message = error?.message;
        returnData.data = {};
      }
    }

    return returnData;
  };

  /**
   * The responsibility of this function is to create a product
   *
   * @param userInput IProductAuthenticationCreateData
   * @returns Promise
   * */
  public create = async (
    userInput: IProductAuthenticationCreateData
  ): Promise<IProductAuthenticationVerifyReturnData> => {
    this.validateApiKeyOptions(); // validate api key
    const getUrl = this.getCreateUrl(); // get create url
    let returnData: IProductAuthenticationVerifyReturnData = {
      success: true,
      message: "",
      data: {},
    };

    try {
      const data = JSON.stringify({ ...userInput });
      const axiosConfig = {
        method: "post",
        url: getUrl,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.options.apiKey as string,
        },
        data: data,
      };
      // calling api
      const fetchData = await axios(axiosConfig);
      returnData.message = "Product created successfully";
      returnData.data = fetchData.data;
      returnData.success = true;
    } catch (error) {
      returnData.success = false;
      if (error instanceof AxiosError) {
        const { response } = error;
        returnData.message = response?.data?.message;
      } else {
        returnData.message = "Unknown error";
      }
    }

    return returnData;
  };
}
