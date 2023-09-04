import * as SecureStore from 'expo-secure-store';
import { getCalendars } from 'expo-localization';

async function getDefaultTaskList() {
  const accessToken = await SecureStore.getItemAsync('accessToken');
  const response = await fetch(`https://graph.microsoft.com/v1.0/me/todo/lists`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data.value.find(d => d.wellknownListName === 'defaultList');
}


// taskListId: 'AQMkADAwATM3ZmYAZS1mZWNkLTgxMzItMDACLTAwCgAuAAADH-_1vWlUsEiMaPnK7V_5egEA9v-3kVg4IkOLZfdYCUTneQAAAgESAAAA',
// title: 'Test Task',
// dateTime: '2023-09-05T22:00:00',
async function createTask({ taskListId, title, dateTime }) {
  const accessToken = await SecureStore.getItemAsync('accessToken');
  const response = await fetch(`https://graph.microsoft.com/v1.0/me/todo/lists/${taskListId}/tasks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      dueDateTime: {
        timeZone: getCalendars()[0].timeZone,
        dateTime,
      },
    }),
  });
  console.log(JSON.stringify(await response.json()));
}

export default {
  getDefaultTaskList,
  createTask,
}