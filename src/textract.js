import { TextractClient, DetectDocumentTextCommand } from "@aws-sdk/client-textract";

const client = new TextractClient({
  region: 'ap-southeast-2',
});

async function detectDocumentText(data) {
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