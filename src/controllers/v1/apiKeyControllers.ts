import { prisma } from "../../db";
import { CustomRequest } from "../../types";
import { ApiResponse } from "../../utils/APIResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const createAPIKey = asyncHandler(async (req: CustomRequest, res) => {
  const { keyType } = req.body;
  const ownerId = req.user.id;

  console.log(req.user.id);

  let totalRequests = 0;
  if (keyType === "BRONZE") {
    totalRequests = 1000;
  } else if (keyType === "SILVER") {
    totalRequests = 2000;
  } else if (keyType === "GOLD") {
    totalRequests = 5000;
  } else {
    return res.status(400).json(new ApiResponse(400, null, "Invalid key type"));
  }

  const apiKey = await prisma.apiKey.create({
    data: {
      keyType: keyType,
      ownerId: ownerId,
      totalRequests: totalRequests,
      remainingRequests: totalRequests,
    },
  });

  res
    .status(201)
    .json(new ApiResponse(201, apiKey, "API key created successfully"));
});

export const getApis = asyncHandler(async (req: CustomRequest, res) => {
  const apis = await prisma.apiKey.findMany({
    where: { ownerId: req.user.id },
  });

  res.status(200).json(new ApiResponse(200, apis, "API keys retrieved"));
});

export const getApiKeyByKey = asyncHandler(async (req: CustomRequest, res) => {
  const ownerId = req.user.id;
  const {apiKey} = req.body
  
  const getApiKey = await prisma.apiKey.findUnique({
    where: { apiKey: apiKey, ownerId },
  });
  res.status(200).json(new ApiResponse(200, getApiKey, "API key retrieved"));
});

export const deleteApiKeys = asyncHandler(async (req: CustomRequest, res) => {
  const ownerId = req.user.id;
  await prisma.apiKey.deleteMany({
    where: { ownerId },
  });
  res.status(200).json(new ApiResponse(200, undefined, "API keys deleted"));
});

export const deleteApiKeyByApiKey = asyncHandler(
  async (req: CustomRequest, res) => {
    const ownerId = req.user.id;
    const { apiKey } = req.body;

    await prisma.apiKey.delete({
      where: { apiKey: apiKey, ownerId },
    });

    res.status(200).json(new ApiResponse(200, undefined, "API key deleted"));
  }
);
