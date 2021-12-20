import {
  env,
  initSQS,
  sendToDeadLetterQueue,
  handleQueueMessage,
} from "./helpers";

import { Consumer } from "sqs-consumer";

const sqs = initSQS();

const app = Consumer.create({
  queueUrl: env("URL_SQS", ""),
  handleMessage: (message) => handleQueueMessage(message, sqs, app),
  sqs,
});

app.on("error", async (err) => {
  console.error("queue error", err.message);
  await sendToDeadLetterQueue();
});

app.on("processing_error", async (err) => {
  console.error("processing_error", err.message);
  await sendToDeadLetterQueue();
});

console.log("Queue service is running");
export default app.start();
