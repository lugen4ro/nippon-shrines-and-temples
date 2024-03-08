import { NextResponse } from "next/server";

export function createErrorResponse(
    error:
        | {
              message?: string;
              code?: string;
              status?: number;
          }
        | any,
    custom_status?: number,
    custom_message?: string,
    custom_code?: string
) {
    return new NextResponse(
        JSON.stringify({
            error: {
                message: error.message || custom_message,
                code: error.code || custom_code,
            },
        }),
        {
            status: error.status || custom_status,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}
