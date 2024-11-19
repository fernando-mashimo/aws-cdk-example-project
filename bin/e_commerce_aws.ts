#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ProductsAppStack } from "../lib/productsApp-stack";
import { ECommerceApiStack } from "../lib/eCommerceApi-stack";

const app = new cdk.App(); // cria uma nova aplicação CDK

const env: cdk.Environment = {
	account: "577638400961",
	region: "us-east-1",
}; // define o ambiente onde os recursos serão criados

const tags = {
	cost: "ECommerce",
	team: "FernandoSoloTeam",
}; // define as tags que serão aplicadas aos recursos

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
	env,
	tags,
}); // cria uma nova stack para os recursos relacionados ao produto

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApi", {
	env,
	tags,
	productsFetchHandler: productsAppStack.productsFetchHandler,
	productsAdminHandler: productsAppStack.productsAdminHandler,
});
eCommerceApiStack.addDependency(productsAppStack); // define a dependência entre as stacks
