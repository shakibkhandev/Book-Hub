
import express from "express";
import { createAPIKey, deleteApiKeyByApiKey, deleteApiKeys, getApis } from "../../controllers/v1/apiKeyControllers";



export const apiKeyRoutes = express.Router();


apiKeyRoutes.post("/", createAPIKey)
apiKeyRoutes.get("/", getApis) 
apiKeyRoutes.get("/single", getApis) 
apiKeyRoutes.delete("/", deleteApiKeys)
apiKeyRoutes.delete("/single", deleteApiKeyByApiKey)