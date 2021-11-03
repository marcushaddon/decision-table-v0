export const oneToManyCartesianProduct =
    <T extends unknown>(prefix: T[], seqs: T[][]): T[][] => seqs.map(
        seq => [ ...prefix, ...seq ]
    );