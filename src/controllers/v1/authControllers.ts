import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
import { Request, Response } from "express";
import { prisma } from "../../db/index"; // Assuming Prisma Client is set up
import { SignInSchema, SignUpSchema } from "../../schema/authSchema";
import { APIError } from "../../utils/APIError";
import { ApiResponse } from "../../utils/APIResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  generateAccessAndRefreshToken,
  generateTemporaryToken,
} from "../../utils/generate.tokens";
import { emailVerificationMailgenContent, sendEmail } from "../../utils/mail";

const cloudinaryImageUploadOptions = {
  use_filename: true,
  unique_filename: false,
  overwrite: true,
  folder: "Book Hub",
};

// SignIn Function (login)
export const SignInFunction = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    const parsedBody = SignInSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res
        .status(400)
        .json({ success: false, error: parsedBody.error.errors });
    }

    // Find the user by email from the database
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        password: true,
        role: true,
        apiKeys: {
          where: {
            isExpired: false,
          },
          select: {
            apiKey: true,
            keyType: true,
          },
        },
      },
    });

    console.log(user);

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user.id
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options) // set the access token in the cookie
      .cookie("refreshToken", refreshToken, options) // set the refresh token in the cookie
      .json(
        new ApiResponse(
          200,
          {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              avatar: user.avatar,
              role: user.role,
              apiKeys: user.apiKeys,
            },
            accessToken: accessToken,
            refreshToken: refreshToken,
          }, // send access and refresh token in response if client decides to save them by themselves
          "User logged in successfully"
        )
      );
  }
);

export const SignUpFunction = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { email, password, name } = req.body;

    const parsedBody = SignUpSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res
        .status(400)
        .json({ success: false, error: parsedBody.error.errors });
    }

    // // Validate input
    // if (!email || !password || !name) {
    //   throw new APIError(400, "Name, email, password, and avatar are required");
    // }

    // // Validate email format
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   throw new APIError(400, "Invalid email format");
    // }

    // // Validate password strength (at least 6 characters)
    // if (password.length < 6) {
    //   throw new APIError(400, "Password must be at least 6 characters long");
    // }

    // Check if the email already exists in the database
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new APIError(400, "User already exists");
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload avatar to Cloudinary
    const avatar = req.file;

    let avatarUrl = "";
    if (avatar) {
      const result = await cloudinary.v2.uploader.upload(
        avatar.path,
        cloudinaryImageUploadOptions
      );
      avatarUrl = result.secure_url;
    }

    // Passed Image With Stream
    if (avatar) {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              if (result) {
                avatarUrl = result.secure_url;
              }
              resolve(result);
            }
          }
        );
        uploadStream.end(avatar.buffer);
      });
    }else{
      const nameParts = name.split(" "); // Split the name into words
      const firstNameInitial = nameParts[0].charAt(0); // Get the first letter of the first word
      const lastNameInitial = nameParts[nameParts.length - 1].charAt(0); // Get the first letter of the last word
      
      const nameShort = firstNameInitial + lastNameInitial;
      const urlString = `https://placehold.co/600x400?text=${nameShort}`
      avatarUrl = urlString;
    }

    const { hashedToken, tokenExpiry, unHashedToken } =
      generateTemporaryToken();

    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatar: avatarUrl,
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: new Date(tokenExpiry),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    });

    await sendEmail({
      email: newUser?.email,
      subject: "Please verify your email",
      mailgenContent: emailVerificationMailgenContent(
        newUser.name,
        `${req.protocol}://${req.get(
          "host"
        )}/api/v1/public/users/verify-email/${unHashedToken}`
      ),
    });
    // // Generate JWT token for the new user
    // const token = generateToken(newUser);

    const user = await prisma.user.findUnique({
      where: { email: newUser.email, id: newUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new APIError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { user },
          "Users registered successfully and verification email has been sent on your email."
        )
      );
  }
);

// SignOut Function (logout)
export const SignOutFunction = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    // await prisma.user.update({
    //   where: { id: req.query.id as string },
    //   data: {
    //     refreshToken: "",
    //   },
    // });

    // No actual sign-out process on the server side if using JWT, just inform the client to delete the token
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  }
);
