import { SecretValue, Stack } from 'aws-cdk-lib';
import {
  GatewayVpcEndpointAwsService,
  InstanceClass,
  InstanceSize,
  InstanceType,
  InterfaceVpcEndpointAwsService,
  SubnetType,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { ContainerImage, Secret as EcsSecret } from 'aws-cdk-lib/aws-ecs';
import {
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion,
} from 'aws-cdk-lib/aws-rds';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import type { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import type { FrontendConfig } from './frontend-config';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { getParamStoreSecureStringParam } from './get-secret';

interface ZeroBackendStackProps {
  environment: `staging` | `production`;
  awsEnv: {
    account: string;
    region: string;
  };
  certificate: ICertificate;
  image: DockerImageAsset;
  domainName: string;
  version: string;
  stackName: string;
}

export class ZeroBackendStack extends Stack {
  public readonly frontendConfig: FrontendConfig;

  public constructor(context: Construct, props: ZeroBackendStackProps) {
    super(context, props.stackName, {
      env: props.awsEnv,
      crossRegionReferences: true,
    });

    const vpc = new Vpc(this, `zero-vpc`, {
      gatewayEndpoints: {
        S3: {
          service: GatewayVpcEndpointAwsService.S3,
        },
      },
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: SubnetType.PUBLIC,
        },
        {
          name: 'isolated',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    vpc.addInterfaceEndpoint(`ecr-endpoint`, {
      service: InterfaceVpcEndpointAwsService.ECR,
    });

    const domainName =
      props.environment === 'production'
        ? `api.${props.domainName}`
        : `api.${props.environment}.${props.domainName}`;

    this.frontendConfig = {
      backendHost: domainName,
      backendPort: 443,
      backendProtocol: `wss`,
    };

    const getParam = getParamStoreSecureStringParam(this, props.environment);

    const dbPassword = getParam(`postgres-db-password`);
    const adminPassword = getParam(`admin-password`);
    const adminEmail = getParam(`admin-email`);
    const goCardlessSecretId = getParam(`gocardless-secret-id`);
    const goCardlessSecretKey = getParam(`gocardless-secret-key`);

    const database = new DatabaseInstance(this, `zero-database`, {
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_18_1,
      }),
      credentials: {
        username: 'admin',
        password: SecretValue.ssmSecure(dbPassword.parameterName),
      },
    });

    const storageBucket = new Bucket(this, `zero-storage-bucket`);

    const zone = HostedZone.fromLookup(this, 'zero-app-hosted-zone', {
      domainName: props.domainName,
    });

    const loadBalancedFargateService =
      new ApplicationLoadBalancedFargateService(this, 'zero-app-service', {
        memoryLimitMiB: 1024,
        desiredCount: 1,
        cpu: 512,
        vpc,
        taskImageOptions: {
          image: ContainerImage.fromDockerImageAsset(props.image),
          containerPort: 3000,
          environment: {
            ZERO_CONFIG_POSTGRES_HOST: database.dbInstanceEndpointAddress,
            ZERO_CONFIG_POSTGRES_PORT: database.dbInstanceEndpointPort,
            ZERO_CONFIG_GOCARDLESS_REDIRECTURL: `https://${props.domainName}`,
            ZERO_CONFIG_POSTGRES_DATABASENAME: `zero`,
            ZERO_CONFIG_POSTGRES_USER: 'admin',
            ZERO_CONFIG_WEBSOCKETSERVER_HOST: props.domainName,
            ZERO_CONFIG_WEBSOCKETSERVER_PORT: String(3000),
            ZERO_CONFIG_S3_BUCKETNAME: storageBucket.bucketName,
            ZERO_CONFIG_WEBSOCKETSERVER_COOKIEDOMAIN: `.${props.domainName}`,
          },
          secrets: {
            ZERO_CONFIG_POSTGRES_PASSWORD:
              EcsSecret.fromSsmParameter(dbPassword),
            ZERO_CONFIG_AUTH_ADMINEMAIL: EcsSecret.fromSsmParameter(adminEmail),
            ZERO_CONFIG_AUTH_ADMINPASSWORD:
              EcsSecret.fromSsmParameter(adminPassword),
            ZERO_CONFIG_GOCARDLESS_SECRETID:
              EcsSecret.fromSsmParameter(goCardlessSecretId),
            ZERO_CONFIG_GOCARDLESS_SECRETKEY:
              EcsSecret.fromSsmParameter(goCardlessSecretKey),
          },
        },
        minHealthyPercent: 100,
        protocol: ApplicationProtocol.HTTPS,
        domainName,
        certificate: props.certificate,
        domainZone: zone,
      });

    const scalableTarget =
      loadBalancedFargateService.service.autoScaleTaskCount({
        minCapacity: 1,
        maxCapacity: 1,
      });

    scalableTarget.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
    });

    scalableTarget.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 50,
    });
  }
}
