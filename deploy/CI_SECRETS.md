Required GitHub secrets for CI/CD
================================

Add the following repository secrets (Settings → Secrets → Actions):

- AZURE_CREDENTIALS — JSON for a service principal with Contributor (or lesser) rights:
  {"clientId":"<id>","clientSecret":"<secret>","subscriptionId":"<sub-id>","tenantId":"<tenant-id>"}
- ACR_NAME — your Azure Container Registry short name (no .azurecr.io)
- AZURE_RESOURCE_GROUP — the resource group name to create resources in
- AZURE_ML_WORKSPACE — the Azure ML workspace name to create/use
- AZURE_LOCATION — Azure region (e.g., eastus)

Optional: you can also provide custom settings like IMAGE_NAME via workflow env.

After adding these secrets, the GitHub Actions workflow `.github/workflows/deploy-to-azure-ml.yml` will be able to build the Docker image, push to ACR, and deploy the image as an Azure ML online endpoint.
