import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as iam from '@aws-cdk/aws-iam'

export class Part2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    const vpc = new ec2.Vpc(this, 'my-cdk-vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      subnetConfiguration: [{ name: 'public', cidrMask: 24, subnetType: ec2.SubnetType.PUBLIC }],
    })

    // 👇 create Security Group for the Instance
    const webserverSG = new ec2.SecurityGroup(this, 'webserver-sg', {
      vpc,
      allowAllOutbound: true,
    })

    webserverSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow SSH access from anywhere')

    webserverSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'allow HTTP traffic from anywhere')

    webserverSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'allow HTTPS traffic from anywhere')

    // 👇 create a Role for the EC2 Instance
    const webserverRole = new iam.Role(this, 'webserver-role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess')],
    })

    // 👇 create the EC2 Instance
    const ec2Instance = new ec2.Instance(this, 'ec2-instance-sdk', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      role: webserverRole,
      securityGroup: webserverSG,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: 'aws-training',
    })
    new cdk.CfnOutput(this, 'simple-instance-1-output', {
      value: ec2Instance.instancePublicIp,
    })
  }
}
