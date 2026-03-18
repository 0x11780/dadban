export async function handleSlackNotification(
  webhookUrl: string,
  notification: object,
): Promise<void> {
  await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notification),
  });
}
