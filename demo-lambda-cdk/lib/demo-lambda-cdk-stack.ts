import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class DemoLambdaCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaExtension = new lambda.LayerVersion(
      this,
      "DemoLambdaExtension",
      {
        compatibleRuntimes: [lambda.Runtime.NODEJS_LATEST],
        code: lambda.Code.fromAsset("../demo-lambda-extension/target/lambda/demo-lambda-extension/bootstrap.zip"),
      }
    );

    const lambdaHandler = new lambda.Function(this, "DemoLambdaHandler", {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: "dist/index.handler",
      code: lambda.Code.fromAsset("../demo-lambda-handler"),
      layers: [lambdaExtension],
    });

    lambdaHandler.addEnvironment(
      "AWS_LAMBDA_EXTENSIONS",
      lambdaExtension.layerVersionArn
    );
  }
}
