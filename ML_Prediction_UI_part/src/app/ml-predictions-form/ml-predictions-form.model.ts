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

export interface MlPredictionResponse {
    result: { modelName: string, price: number, deviation: number }[]
}


export interface MlPredictionBody {
    vehicleType: string,
    fields: any
}