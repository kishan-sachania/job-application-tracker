import { Response } from "express";

class ApiResponse {
  static success(res: Response, message: String, statusCode: number=200,data?: any){
    return res.status(statusCode).json({
        success:true,
        statusCode,
        message,
        data,
    })
  }

  static error(res: Response, message: String, statusCode: number=500   ){
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
  }
}

export default ApiResponse;
