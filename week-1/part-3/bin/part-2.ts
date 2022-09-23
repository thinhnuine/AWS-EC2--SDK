import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Part2Stack } from '../lib/part-2-stack';

const app = new cdk.App();
new Part2Stack(app, 'Part2Stack', {
  stackName:'cdk-stack',
  env:{
    account:process.env.AWS_ACCOUNT_NUMBER,
    region: process.env.AWS_REGION,
  }
});