import aws from "aws-sdk";
import { AWS_REGION, DLQ_URL_SQS } from "../config";

export const sendToDeadLetterQueue = async () => {
  aws.config.update({ region: AWS_REGION });

  // Create the SQS service object
  const sqs = new aws.SQS({ apiVersion: "2012-11-05" });

  const params = {
    Attributes: {
      RedrivePolicy: `{"deadLetterTargetArn":"dlq-pdf-annotations-queue-hml.fifo","maxReceiveCount":"1"}`,
    },
    QueueUrl: DLQ_URL_SQS,
  };

  return sqs.setQueueAttributes(params).promise();
};
