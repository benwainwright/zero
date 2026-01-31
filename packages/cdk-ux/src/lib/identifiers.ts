import { Identifier } from './identifier.ts';

import type {
  CloudFormationStackArtifact,
  Environment,
  SynthesisMessage,
} from 'aws-cdk-lib/cx-api';

import type {
  AssemblyData,
  AssetBatchDeletionRequest,
  BootstrapEnvironmentProgress,
  BuildAsset,
  CloudWatchLogEvent,
  CloudWatchLogMonitorControlEvent,
  ConfirmationRequest,
  ContextProviderMessageSource,
  DeployConfirmationRequest,
  DiffResult,
  DriftResultPayload,
  Duration,
  ErrorPayload,
  FileWatchEvent,
  HotswapDeploymentAttempt,
  HotswapDeploymentDetails,
  HotswappableChange,
  HotswapResult,
  MfaTokenRequest,
  MissingContext,
  PublishAsset,
  RefactorResult,
  ResourceIdentificationRequest,
  ResourceImportRequest,
  SdkTrace,
  SingleStack,
  StackActivity,
  StackAndAssemblyData,
  StackDeployProgress,
  StackDestroy,
  StackDestroyProgress,
  StackDetailsPayload,
  StackDiff,
  StackMonitoringControlEvent,
  StackRollbackProgress,
  StackSelectionDetails,
  SuccessfulDeployStackResult,
  UpdatedContext,
  WatchSettings,
} from '@aws-cdk/toolkit-lib';

// See https://docs.aws.amazon.com/cdk/api/toolkit-lib/message-registry/
export const identifiers = [
  new Identifier<undefined, 'CDK_TOOLKIT_W0100'>('CDK_TOOLKIT_W0100'),
  new Identifier<Duration, 'CDK_TOOLKIT_I1000'>('CDK_TOOLKIT_I1000'),
  new Identifier<StackSelectionDetails, 'CDK_TOOLKIT_I1001'>(
    'CDK_TOOLKIT_I1001'
  ),
  new Identifier<StackAndAssemblyData, 'CDK_TOOLKIT_I1901'>(
    'CDK_TOOLKIT_I1901'
  ),
  new Identifier<AssemblyData, 'CDK_TOOLKIT_I1902'>('CDK_TOOLKIT_I1902'),
  new Identifier<StackDetailsPayload, 'CDK_TOOLKIT_I2901'>('CDK_TOOLKIT_I2901'),

  new Identifier<ResourceImportRequest, 'CDK_TOOLKIT_I3100'>(
    'CDK_TOOLKIT_I3100'
  ),
  new Identifier<ResourceIdentificationRequest, 'CDK_TOOLKIT_I3110'>(
    'CDK_TOOLKIT_I3110'
  ),
  new Identifier<ErrorPayload, 'CDK_TOOLKIT_E3900'>('CDK_TOOLKIT_E3900'),

  new Identifier<StackSelectionDetails, 'CDK_TOOLKIT_I4000'>(
    'CDK_TOOLKIT_I4000'
  ),
  new Identifier<DiffResult, 'CDK_TOOLKIT_I4001'>('CDK_TOOLKIT_I4001'),
  new Identifier<StackDiff, 'CDK_TOOLKIT_I4002'>('CDK_TOOLKIT_I4002'),

  new Identifier<StackSelectionDetails, 'CDK_TOOLKIT_I4500'>(
    'CDK_TOOLKIT_I4500'
  ),
  new Identifier<Duration, 'CDK_TOOLKIT_I4592'>('CDK_TOOLKIT_I4592'),
  new Identifier<DriftResultPayload, 'CDK_TOOLKIT_I4590'>('CDK_TOOLKIT_I4590'),
  new Identifier<SingleStack, 'CDK_TOOLKIT_W4591'>('CDK_TOOLKIT_W4591'),

  new Identifier<Duration, 'CDK_TOOLKIT_I5000'>('CDK_TOOLKIT_I5000'),
  new Identifier<Duration, 'CDK_TOOLKIT_I5001'>('CDK_TOOLKIT_I5001'),
  new Identifier<Duration, 'CDK_TOOLKIT_I5002'>('CDK_TOOLKIT_I5002'),

  new Identifier<undefined, 'CDK_TOOLKIT_W5021'>('CDK_TOOLKIT_W5021'),
  new Identifier<undefined, 'CDK_TOOLKIT_W5022'>('CDK_TOOLKIT_W5022'),

  new Identifier<undefined, 'CDK_TOOLKIT_I5031'>('CDK_TOOLKIT_I5031'),
  new Identifier<CloudWatchLogMonitorControlEvent, 'CDK_TOOLKIT_I5032'>(
    'CDK_TOOLKIT_I5032'
  ),
  new Identifier<CloudWatchLogEvent, 'CDK_TOOLKIT_I5033'>('CDK_TOOLKIT_I5033'),
  new Identifier<CloudWatchLogMonitorControlEvent, 'CDK_TOOLKIT_I5034'>(
    'CDK_TOOLKIT_I5034'
  ),
  new Identifier<ErrorPayload, 'CDK_TOOLKIT_E5035'>('CDK_TOOLKIT_E5035'),

  new Identifier<ConfirmationRequest, 'CDK_TOOLKIT_I5050'>('CDK_TOOLKIT_I5050'),
  new Identifier<DeployConfirmationRequest, 'CDK_TOOLKIT_I5060'>(
    'CDK_TOOLKIT_I5060'
  ),

  new Identifier<StackDeployProgress, 'CDK_TOOLKIT_I5100'>('CDK_TOOLKIT_I5100'),

  new Identifier<BuildAsset, 'CDK_TOOLKIT_I5210'>('CDK_TOOLKIT_I5210'),
  new Identifier<Duration, 'CDK_TOOLKIT_I5211'>('CDK_TOOLKIT_I5211'),
  new Identifier<PublishAsset, 'CDK_TOOLKIT_I5220'>('CDK_TOOLKIT_I5220'),
  new Identifier<Duration, 'CDK_TOOLKIT_I5221'>('CDK_TOOLKIT_I5221'),

  new Identifier<WatchSettings, 'CDK_TOOLKIT_I5310'>('CDK_TOOLKIT_I5310'),
  new Identifier<FileWatchEvent, 'CDK_TOOLKIT_I5311'>('CDK_TOOLKIT_I5311'),
  new Identifier<FileWatchEvent, 'CDK_TOOLKIT_I5312'>('CDK_TOOLKIT_I5312'),
  new Identifier<FileWatchEvent, 'CDK_TOOLKIT_I5313'>('CDK_TOOLKIT_I5313'),
  new Identifier<undefined, 'CDK_TOOLKIT_I5314'>('CDK_TOOLKIT_I5314'),
  new Identifier<undefined, 'CDK_TOOLKIT_I5315'>('CDK_TOOLKIT_I5315'),

  new Identifier<HotswapDeploymentAttempt, 'CDK_TOOLKIT_I5400'>(
    'CDK_TOOLKIT_I5400'
  ),
  new Identifier<HotswapDeploymentDetails, 'CDK_TOOLKIT_I5401'>(
    'CDK_TOOLKIT_I5401'
  ),
  new Identifier<HotswappableChange, 'CDK_TOOLKIT_I5402'>('CDK_TOOLKIT_I5402'),
  new Identifier<HotswappableChange, 'CDK_TOOLKIT_I5403'>('CDK_TOOLKIT_I5403'),
  new Identifier<HotswapResult, 'CDK_TOOLKIT_I5410'>('CDK_TOOLKIT_I5410'),

  new Identifier<StackMonitoringControlEvent, 'CDK_TOOLKIT_I5501'>(
    'CDK_TOOLKIT_I5501'
  ),
  new Identifier<StackActivity, 'CDK_TOOLKIT_I5502'>('CDK_TOOLKIT_I5502'),
  new Identifier<StackMonitoringControlEvent, 'CDK_TOOLKIT_I5503'>(
    'CDK_TOOLKIT_I5503'
  ),

  new Identifier<SuccessfulDeployStackResult, 'CDK_TOOLKIT_I5900'>(
    'CDK_TOOLKIT_I5900'
  ),
  new Identifier<undefined, 'CDK_TOOLKIT_I5901'>('CDK_TOOLKIT_I5901'),

  new Identifier<undefined, 'CDK_TOOLKIT_W5400'>('CDK_TOOLKIT_W5400'),
  new Identifier<undefined, 'CDK_TOOLKIT_E5001'>('CDK_TOOLKIT_E5001'),
  new Identifier<ErrorPayload, 'CDK_TOOLKIT_E5500'>('CDK_TOOLKIT_E5500'),

  new Identifier<Duration, 'CDK_TOOLKIT_I6000'>('CDK_TOOLKIT_I6000'),
  new Identifier<StackRollbackProgress, 'CDK_TOOLKIT_I6100'>(
    'CDK_TOOLKIT_I6100'
  ),
  new Identifier<undefined, 'CDK_TOOLKIT_E6001'>('CDK_TOOLKIT_E6001'),
  new Identifier<ErrorPayload, 'CDK_TOOLKIT_E6900'>('CDK_TOOLKIT_E6900'),

  new Identifier<Duration, 'CDK_TOOLKIT_I7000'>('CDK_TOOLKIT_I7000'),
  new Identifier<Duration, 'CDK_TOOLKIT_I7001'>('CDK_TOOLKIT_I7001'),
  new Identifier<ConfirmationRequest, 'CDK_TOOLKIT_I7010'>('CDK_TOOLKIT_I7010'),
  new Identifier<StackDestroyProgress, 'CDK_TOOLKIT_I7100'>(
    'CDK_TOOLKIT_I7100'
  ),
  new Identifier<StackDestroy, 'CDK_TOOLKIT_I7101'>('CDK_TOOLKIT_I7101'),
  new Identifier<CloudFormationStackArtifact, 'CDK_TOOLKIT_I7900'>(
    'CDK_TOOLKIT_I7900'
  ),

  new Identifier<undefined, 'CDK_TOOLKIT_E7010'>('CDK_TOOLKIT_E7010'),
  new Identifier<ErrorPayload, 'CDK_TOOLKIT_E7900'>('CDK_TOOLKIT_E7900'),

  new Identifier<ErrorPayload, 'CDK_TOOLKIT_E8900'>('CDK_TOOLKIT_E8900'),
  new Identifier<RefactorResult, 'CDK_TOOLKIT_I8900'>('CDK_TOOLKIT_I8900'),
  new Identifier<ConfirmationRequest, 'CDK_TOOLKIT_I8910'>('CDK_TOOLKIT_I8910'),
  new Identifier<undefined, 'CDK_TOOLKIT_W8010'>('CDK_TOOLKIT_W8010'),

  new Identifier<Duration, 'CDK_TOOLKIT_I9000'>('CDK_TOOLKIT_I9000'),
  new Identifier<BootstrapEnvironmentProgress, 'CDK_TOOLKIT_I9100'>(
    'CDK_TOOLKIT_I9100'
  ),
  new Identifier<AssetBatchDeletionRequest, 'CDK_TOOLKIT_I9210'>(
    'CDK_TOOLKIT_I9210'
  ),
  new Identifier<Environment, 'CDK_TOOLKIT_I9900'>('CDK_TOOLKIT_I9900'),
  new Identifier<ErrorPayload, 'CDK_TOOLKIT_E9900'>('CDK_TOOLKIT_E9900'),

  new Identifier<undefined, 'CDK_ASSEMBLY_I0010'>('CDK_ASSEMBLY_I0010'),
  new Identifier<undefined, 'CDK_ASSEMBLY_W0010'>('CDK_ASSEMBLY_W0010'),
  new Identifier<UpdatedContext, 'CDK_ASSEMBLY_I0042'>('CDK_ASSEMBLY_I0042'),
  new Identifier<MissingContext, 'CDK_ASSEMBLY_I0240'>('CDK_ASSEMBLY_I0240'),
  new Identifier<MissingContext, 'CDK_ASSEMBLY_I0241'>('CDK_ASSEMBLY_I0241'),

  new Identifier<undefined, 'CDK_ASSEMBLY_I1000'>('CDK_ASSEMBLY_I1000'),
  new Identifier<undefined, 'CDK_ASSEMBLY_I1001'>('CDK_ASSEMBLY_I1001'),
  new Identifier<undefined, 'CDK_ASSEMBLY_E1002'>('CDK_ASSEMBLY_E1002'),
  new Identifier<undefined, 'CDK_ASSEMBLY_I1003'>('CDK_ASSEMBLY_I1003'),

  new Identifier<ErrorPayload, 'CDK_ASSEMBLY_E1111'>('CDK_ASSEMBLY_E1111'),
  new Identifier<undefined, 'CDK_ASSEMBLY_I0150'>('CDK_ASSEMBLY_I0150'),

  new Identifier<ContextProviderMessageSource, 'CDK_ASSEMBLY_I0300'>(
    'CDK_ASSEMBLY_I0300'
  ),
  new Identifier<ContextProviderMessageSource, 'CDK_ASSEMBLY_I0301'>(
    'CDK_ASSEMBLY_I0301'
  ),

  new Identifier<SynthesisMessage, 'CDK_ASSEMBLY_I9999'>('CDK_ASSEMBLY_I9999'),
  new Identifier<SynthesisMessage, 'CDK_ASSEMBLY_W9999'>('CDK_ASSEMBLY_W9999'),
  new Identifier<SynthesisMessage, 'CDK_ASSEMBLY_E9999'>('CDK_ASSEMBLY_E9999'),

  new Identifier<SdkTrace, 'CDK_SDK_I0100'>('CDK_SDK_I0100'),
  new Identifier<MfaTokenRequest, 'CDK_SDK_I1100'>('CDK_SDK_I1100'),
];
