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

export interface IProductAuthentication {
  create(
    data: IProductAuthenticationCreateData
  ): Promise<IProductAuthenticationVerifyReturnData>;
  verify(productId: string): Promise<IProductAuthenticationVerifyReturnData>;
}

export class ProductAuthentication implements IProductAuthentication {
  private options: IProductAuthenticationOptions;

  constructor(options: IProductAuthenticationOptions) {
    this.options = options;

    Object.setPrototypeOf(this, ProductAuthentication.prototype);
  }

  private getVerifyUrl = (username: string, productId: string): string => {
    const url = this.options.baseUrl.replace(/\/$/, "");
    return `${url}/v1/product/authentication/verify/${username}/${productId}`;
  };

  private getCreateUrl = (): string => {
    const url = this.options.baseUrl.replace(/\/$/, "");
    return `${url}/v1/product/authentication/create`;
  };

  private validateUsernameOptions = (): void => {
    if (!this.options.userName) {
      throw new Error("User Name is required");
    }
  };

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

  private validateApiKeyOptions = (): void => {
    if (!this.options.apiKey) {
      throw new Error("Api key is required");
    }
  };

  private apiCalling = async (
    axiosConfig: AxiosRequestConfig<any>
  ): Promise<any> => {
    const fetchData = await axios(axiosConfig);
    return fetchData;
  };

  private ErrorHandler = (errorCode: number): string => {
    if (errorCode === 101) {
      return "Product is not genuine";
    } else if (errorCode === 102) {
      return "Product verification maximum limit reached";
    }
    return "Unknown error";
  };

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
      returnData.message = "Product is genuine";
      returnData.data = fetchData.data;
      returnData.success = true;
    } catch (error: any) {
      returnData.success = false;
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
