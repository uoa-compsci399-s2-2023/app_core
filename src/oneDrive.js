import * as SecureStore from 'expo-secure-store';

async function fileExists(path) {
  const accessToken = await SecureStore.getItemAsync('accessToken');
  if(path.startsWith('/')) {
    path = path.substring(1);
  }
  const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${path}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
  });
  if(response.status === 200) {
    return true;
  }
  return false;
}

async function uploadFile({ body, path }) {
  const accessToken = await SecureStore.getItemAsync('accessToken');
  if(path.startsWith('/')) {
    path = path.substring(1);
  }
  await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/root:/${path}:/content`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': `Bearer ${accessToken}`
    },
    body,
  });
}

export default {
  uploadFile,
  fileExists,
}