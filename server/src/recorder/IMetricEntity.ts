export interface IMetricEntity {

    ClientId: string;
    ArtifactName: string;
    LineNumber: string;
    Attention: number;
    Meditation: number;
}



// {
//     measurement: 'cognide',
//     tags: { artifact: 'helloWorld.cs', line: '1' },
//     fields: { attention: metrics.eSense.attention, meditation: metrics.eSense.meditation },
//   }