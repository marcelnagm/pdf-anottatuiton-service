import AWS from "aws-sdk";
import { env } from "../helpers";
import jwt from "jsonwebtoken";
import { JWT_PRIVATE_KEY } from "../config";

export const initSQS = () => new AWS.SQS({ apiVersion: "2012-11-05" });

export const sendQueueMessage = async (
  pdf_id: string,
  created_by_id: string,
  formattedAnnotations: any,
  id?: string
) => {
  const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

  const token = jwt.sign(formattedAnnotations.id, JWT_PRIVATE_KEY);

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
        StringValue: `${id || 0}`,
      },
    },

    MessageBody: JSON.stringify(body),
    MessageDeduplicationId: token, // Required for FIFO queues
    MessageGroupId: "Annotations", // Required for FIFO queues
    QueueUrl: env("URL_SQS", ""),
  };

  return sqs
    .sendMessage(params)
    .promise()
    .catch((err) => console.log(err));
};
