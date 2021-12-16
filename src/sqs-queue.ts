import { env, initSQS, saveAnnotationAfterQueue, axios } from "./helpers";

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

app.on("error", (err) => {
  console.error("queue error", err.message);
});

app.on("processing_error", (err) => {
  console.error("processing_error", err.message);
});

console.log("Queue service is running");
export default app.start();
