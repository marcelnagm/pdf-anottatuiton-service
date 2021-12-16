import AWS from "aws-sdk";
import { env } from "../helpers";

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
    id,
    pdf_id,
    created_by_id,
    formattedAnnotations: stringifyiedAnnotation,
  };

  console.log(formattedAnnotations);

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
    },

    MessageBody: JSON.stringify(body),
    MessageDeduplicationId: `${formattedAnnotations.id}${pdf_id}${created_by_id}`, // Required for FIFO queues
    MessageGroupId: "Annotations", // Required for FIFO queues
    QueueUrl: env("URL_SQS", ""),
  };

  //   var params = {
  //     // Remove DelaySeconds parameter and value for FIFO queues
  //     // DelaySeconds: 10,
  //     MessageAttributes: {
  //       Title: {
  //         DataType: "String",
  //         StringValue: "The Whistler",
  //       },
  //       Author: {
  //         DataType: "String",
  //         StringValue: "John Grisham",
  //       },
  //       WeeksOn: {
  //         DataType: "Number",
  //         StringValue: "6",
  //       },
  //     },
  //     MessageBody:
  //     JSON.stringify(body),
  //     MessageDeduplicationId: "TheWhistler", // Required for FIFO queues
  //     MessageGroupId: "Group1", // Required for FIFO queues
  //     QueueUrl: env("URL_SQS", ""),
  //   };

  return sqs
    .sendMessage(params)
    .promise()
    .catch((err) => console.log(err));
};
