import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

// esta stack vai conter todos os recursos relacionados ao produto:
// 3 lambdas, 2 tabelas dynamodb, 1 api gateway
// 1 lambda para criar/atualizar/deletar um produto
// 1 lambda para listar os produtos
// 1 lambda para registrar eventos de criação/atualização/deleção de produtos
// 1 tabela dynamodb para armazenar os produtos
// 1 tabela dynamodb para armazenar os eventos de criação/atualização/deleção de produtos
// 1 api gateway para expor os lambdas

export class ProductsAppStack extends cdk.Stack {
	public readonly productsFetchHandler: lambdaNodejs.NodejsFunction;

	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		this.productsFetchHandler = new lambdaNodejs.NodejsFunction(
			this,
			"ProductsFetchFunction", // identificador da função dentro da stack
			{
				functionName: "ProductsFetchFunction", // nome da função na AWS, como vamos encontrar no Console
                description: "Lambda function to fetch products",
                entry: "lambda/products/productsFetchFunction.ts",
                handler: "handler",
                runtime: lambda.Runtime.NODEJS_20_X,
                memorySize: 128,
                timeout: cdk.Duration.seconds(5),
                bundling: {
                    minify: true,
                    sourceMap: false,
                },
			}
		);
	}
}
