export interface InputField {
    name: string,
    displayName: string,
    isModel: boolean,
    type: string,
    mandatory: boolean,
    measureUnit?: string,
    numberConstrain?: NumberConstrain,
    categoricalConstrain?: CategoricalConstrain
}

export interface MlPredictionInput {
    vehicleType: string,
    fields: InputField[]
}

export interface NumberConstrain {
    minValue: number,
    maxValue: number
}

export interface CategoricalConstrain {
    values: any[]
}

export interface MlPredictionResponse {
    result: { modelName: string, price: number, deviation: number }[]
}


export interface MlPredictionBody {
    vehicleType: string,
    fields: any
}