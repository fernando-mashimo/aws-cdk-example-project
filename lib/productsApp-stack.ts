import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

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
	public readonly productsAdminHandler: lambdaNodejs.NodejsFunction;
	public readonly productsDdb: dynamodb.Table;

	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// a ordem de criação dos recursos é importante, pois a função productsFetchHandler depende da tabela productsDdb

		this.productsDdb = new dynamodb.Table(this, "ProductsDdb", {
			tableName: "products",
			removalPolicy: cdk.RemovalPolicy.DESTROY, // normalmente, a tabela é mantida (RETAIN) para evitar perda de dados
			partitionKey: {
				name: "id",
				type: dynamodb.AttributeType.STRING,
			},
			billingMode: dynamodb.BillingMode.PROVISIONED,
			readCapacity: 1,
			writeCapacity: 1
		});

		this.productsFetchHandler = new lambdaNodejs.NodejsFunction(
			this,
			"ProductsFetchFunction", // identificador da função dentro da stack
			{
				functionName: "ProductsFetchFunction", // nome da função na AWS, como vamos encontrar no Console
				description: "Lambda function to fetch products",
				entry: "lambda/products/productsFetchFunction.ts",
				handler: "handler",
				runtime: lambda.Runtime.NODEJS_20_X,
				memorySize: 512,
				timeout: cdk.Duration.seconds(5),
				bundling: {
						minify: true,
						sourceMap: false,
				},
				environment: {
					PRODUCTS_DDB: this.productsDdb.tableName,
				},
			}
		);
		this.productsDdb.grantReadData(this.productsFetchHandler); // a função productsFetchHandler possui permissão de leitura na tabela productsDdb - semanticamente diferente de "a tabela productsDdb concede permissão de leitura para a função productsFetchHandler", como dá a entender a função grantReadData

		this.productsAdminHandler = new lambdaNodejs.NodejsFunction(
			this,
			"ProductsAdminFunction",
			{
				functionName: "ProductsAdminFunction",
				description: "Lambda function to manage products",
				entry: "lambda/products/productsAdminFunction.ts",
				handler: "handler",
				runtime: lambda.Runtime.NODEJS_20_X,
				memorySize: 512,
				timeout: cdk.Duration.seconds(5),
				bundling: {
						minify: true,
						sourceMap: false,
				},
				environment: {
					PRODUCTS_DDB: this.productsDdb.tableName,
				},
			}
		);
		this.productsDdb.grantWriteData(this.productsAdminHandler); // a função productsAdminHandler possui permissão de escrita na tabela productsDdb - semanticamente diferente de "a tabela productsDdb concede permissão de escrita para a função productsAdminHandler", como dá a entender a função grantWriteData
	}
}
