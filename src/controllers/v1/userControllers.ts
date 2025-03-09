import { prisma } from "../../db";
import { ApiResponse } from "../../utils/APIResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { name, email },
  });

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id } });

  res
    .status(200)
    .json(new ApiResponse(200, undefined, "User deleted successfully"));
});


