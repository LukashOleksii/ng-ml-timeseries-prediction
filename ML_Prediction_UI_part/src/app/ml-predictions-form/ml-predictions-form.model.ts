export interface MachineryField {
    title: string,
    identifier: number,
    description: string,
    imagePath: string
}

export interface WorkTypeField {
    title: string,
    description: string,
    imagePath: string,
    difficultCoef: number
}

export interface MlPredictionInput {
    vehicleType: string,
    machinery: MachineryField[],
    workType: WorkTypeField[]
}

// export interface MlPredictionResponse {
//     labels: any,
//     models: any
// }

export interface MlPredictionResponse {
    labels: [],
    statusOnPercentageCNN: any,
    accuracyDeviationCNN: any,
    statusOnPercentageLSTM: any,
    accuracyDeviationLSTM: any,
    typeOfWorkDifficulty: number,
    typeOfVehicle: number,
    title: string

}


export interface MlPredictionBody {
    title: string,
    vehicleType: number,
    workType: number
}