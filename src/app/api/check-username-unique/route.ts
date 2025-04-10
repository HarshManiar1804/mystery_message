import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UserNameQuerySchema = z.object({
  username: usernameValidation,
});
export async function GET(request: Request) {
  await dbConnect();
  // localhost:300/api/cuu?username=harsh
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = { username: searchParams.get("username") };

    // validate with zod
    const result = UserNameQuerySchema.safeParse(queryParams);
    // console.log(result)

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifyUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifyUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error checking ", error);
    return Response.json(
      {
        success: false,
        message: "Error while checking username",
      },
      { status: 500 }
    );
  }
}
