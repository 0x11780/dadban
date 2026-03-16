import * as Minio from "minio";

const endpoint = process.env.MINIO_ENDPOINT ?? "localhost";
const port = Number(process.env.MINIO_PORT ?? 9000);
const useSSL = process.env.MINIO_USE_SSL === "true";
const accessKey = process.env.MINIO_ACCESS_KEY ?? "minioadmin";
const secretKey = process.env.MINIO_SECRET_KEY ?? "minioadmin";
const bucket = process.env.MINIO_BUCKET ?? "dadban-uploads";

export const minioConfig = {
  endPoint: endpoint.replace(/^https?:\/\//, "").split(":")[0],
  port: Number.isNaN(port) ? 9000 : port,
  useSSL,
  accessKey,
  secretKey,
  bucket,
};

export const minioClient = new Minio.Client({
  endPoint: minioConfig.endPoint,
  port: minioConfig.port,
  useSSL: minioConfig.useSSL,
  accessKey: minioConfig.accessKey,
  secretKey: minioConfig.secretKey,
});

export const UPLOAD_BUCKET = minioConfig.bucket;
