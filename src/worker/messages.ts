type LoadDataJob = {
    type: 'loadData';
    filePath: string;
};

type CreateGridJob = {
    type: 'processJob';
    jobData: any; // Define jobData based on your specific use case
};