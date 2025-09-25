import { IMetricEntity } from './IMetricEntity'

export interface IRecorder {
    Save(metricEntity: IMetricEntity): Promise<boolean>;
    QueryMetrics(artifactName: string): Promise<IMetricEntity | null>;
}