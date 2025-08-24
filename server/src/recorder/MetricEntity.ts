import { IMetricEntity } from "./IMetricEntity";

export class MetricEntity implements IMetricEntity {
    
    ClientId: string;
    ArtifactName: string;
    LineNumber: string;
    Attention: number;
    Meditation: number;

    /**
     * Constructor
     */
    constructor(clientId: string, artifactName: string, lineNumber: string, attention: number, meditation: number) {
        this.ClientId = clientId;
        this.ArtifactName = artifactName;
        this.LineNumber = lineNumber;
        this.Attention = attention;
        this.Meditation = meditation;
    }
}






