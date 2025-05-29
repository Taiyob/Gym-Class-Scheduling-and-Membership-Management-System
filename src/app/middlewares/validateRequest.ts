import { NextFunction, Request, Response, RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";

const validateRequest = (schema: ZodSchema<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: "Validation error occurred.",
          errorDetails:
            formattedErrors.length === 1 ? formattedErrors[0] : formattedErrors,
        });
        return;
      }

      next(error);
    }
  };
};

export default validateRequest;
