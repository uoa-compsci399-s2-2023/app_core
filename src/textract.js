import { TextractClient, DetectDocumentTextCommand } from "@aws-sdk/client-textract";

async function detectDocumentText({ data, credentials }) {
  const client = new TextractClient({
    region: 'ap-southeast-2',
    credentials,
  });
  const command = new DetectDocumentTextCommand({
    Document: {
      Bytes: data,
    }
  });
  return await client.send(command);
}

export default {
  detectDocumentText,
}