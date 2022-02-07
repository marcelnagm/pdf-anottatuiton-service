import AWS from "aws-sdk";
import { env, axios } from "../helpers";
import jwt from "jsonwebtoken";
import { JWT_PRIVATE_KEY, URL_SQS } from "../config";
import { v4 } from "uuid";

export const initSQS = () => new AWS.SQS({ apiVersion: "2012-11-05" });

export const sendQueueMessage = async (
  pdf_id: string,
  created_by_id: string,
  formattedAnnotations: any,
  id?: string
) => {
  const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

  const stringifyiedAnnotation = JSON.stringify(formattedAnnotations);

  const body = {
    id: `${id || 0}`,
    pdf_id,
    created_by_id,
    formattedAnnotations: stringifyiedAnnotation,
  };

  const params = {
    MessageAttributes: {
      pdf_id: {
        DataType: "String",
        StringValue: pdf_id,
      },
      created_by_id: {
        DataType: "String",
        StringValue: created_by_id,
      },
      formattedAnnotations: {
        DataType: "String",
        StringValue: JSON.stringify(stringifyiedAnnotation),
      },
      id: {
        DataType: "String",
        StringValue: body.id,
      },
    },

    MessageBody: JSON.stringify(body),
    MessageDeduplicationId: v4(), // Required for FIFO queues
    MessageGroupId: "Annotations", // Required for FIFO queues
    QueueUrl: env("URL_SQS", ""),
  };

  return sqs.sendMessage(params).promise();
};

export const handleQueueMessage = async (
  message: { Body?: string; ReceiptHandle?: string },
  sqs: any,
  app: any
) => {
  try {
    const data = JSON.parse(message.Body);
    console.log("Processing message");

    await axios({
      method: "POST",
      url: "/annotations/queue",
      data,
      headers: { Authorization: "" },
    });

    await sqs
      .deleteMessage({
        QueueUrl: URL_SQS,
        ReceiptHandle: message.ReceiptHandle,
      })
      .promise();
  } catch (error) {
    app.emit("error", new Error(error.message));
  }
};
