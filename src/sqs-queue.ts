import { env, initSQS, axios, sendToDeadLetterQueue } from "./helpers";

import { Consumer } from "sqs-consumer";

const sqs = initSQS();

const queueURL = env("URL_SQS", "");

const app = Consumer.create({
  queueUrl: env("URL_SQS", ""),
  handleMessage: async (message) => {
    const data = JSON.parse(message.Body);

    console.log("data >>", data);

    await axios({
      method: "POST",
      url: "/annotations/queue",
      data,
      headers: { Authorization: "" },
    });

    await sqs
      .deleteMessage({
        QueueUrl: queueURL,
        ReceiptHandle: message.ReceiptHandle,
      })
      .promise();
  },
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
