import { InfluxDBClient, Point } from '@influxdata/influxdb3-client';
import { IRecorder } from '../IRecorder'
import { IMetricEntity } from '../IMetricEntity'

/**
 * Class for recording metrics to InfluxDB
 */
export class InfluxDBRecorder implements IRecorder {

    /**
     * InfluxDB client
     */
    private client: InfluxDBClient;

    /**
     * Set InfluxDB credentials
     */
    private readonly host = process.env.INFLUXDB_HOST || "";
    private readonly database = process.env.INFLUXDB_DATABASE || "";
    private readonly token = process.env.INFLUXDB_TOKEN || "";
    private readonly orgId = process.env.INFLUXDB_ORG_ID || "";

    /**
     * Constructor
     */
    constructor() {
        /**
         * Connect to InfluxDB
        */
        this.client = new InfluxDBClient({
            host: this.host,
            database: this.database,
            token: this.token,
        })
  }

    /**
     * Save metrics to InfluxDB
     * @param metricEntity - The metric entity to save
     */
    async Save(metricEntity: IMetricEntity): Promise<boolean> {

        console.debug("Saving metrics into InfluxDB: ", JSON.stringify(metricEntity))

        try {
            /**
             * Create a new point
             */
            const point = Point.measurement('psychometrics')
                .setTag("clientId", metricEntity.ClientId)
                .setTag("artifactName", metricEntity.ArtifactName)
                .setTag("lineNumber", metricEntity.LineNumber)
                .setFloatField("attention", metricEntity.Attention)
                .setFloatField("meditation", metricEntity.Meditation);

            /**
             * Write the point to InfluxDB
             */
            await this.client.write(point, this.database, this.orgId);

            return true;

        } catch (error) {
            console.error(`As error occurred while saving metrics into InfluxDB: ${error}`);
            return false
        }
    }
}