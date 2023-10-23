import { MlPredictionInput, MlPredictionResponse } from "./ml-predictions-form.model";

const mockedData: MlPredictionInput[] = [
    {
        vehicleType: "Tractors",
        fields: [
            {
                name: "Weight",
                displayName: "Weight",
                isModel: false,
                type: "number",
                mandatory: true,
                measureUnit: 'tons',
                numberConstrain: {
                    minValue: 0,
                    maxValue: 20
                }
            },
            {
                name: "Liftinforce",
                displayName: "Liftinforce",
                isModel: false,
                type: "number",
                mandatory: true,
                measureUnit: 'tons',
                numberConstrain: {
                    minValue: 0,
                    maxValue: 100
                }
            },
            {
                name: "Country",
                displayName: "Country",
                isModel: false,
                type: "string",
                mandatory: false,
                categoricalConstrain: {
                    values: ['UA', 'EU', 'USA']
                }
            }
        ]

    },
    {
        vehicleType: "Mini-excatavor",
        fields: [
            {
                name: "Weight",
                displayName: "Weight",
                isModel: false,
                type: "number",
                mandatory: true,
                measureUnit: 'tons',
                numberConstrain: {
                    minValue: 0,
                    maxValue: 20
                }
            },
            {
                name: "Capacity",
                displayName: "Capacity",
                isModel: false,
                type: "number",
                mandatory: true,
                measureUnit: 'tons',
                numberConstrain: {
                    minValue: 0,
                    maxValue: 100
                }
            },
            {
                name: "OperatingHours",
                displayName: "Operating hours",
                isModel: false,
                type: "number",
                mandatory: true,
                measureUnit: 'tons',
                numberConstrain: {
                    minValue: 0,
                    maxValue: 100
                }
            },
            {
                name: "Country",
                displayName: "Country",
                isModel: false,
                type: "string",
                mandatory: false,
                categoricalConstrain: {
                    values: ['UA', 'EU', 'USA']
                }
            }
        ]

    },
    {
        vehicleType: "Telehandler",
        fields: [
            {
                name: "Weight",
                displayName: "Weight",
                isModel: false,
                type: "number",
                mandatory: true,
                measureUnit: 'tons',
                numberConstrain: {
                    minValue: 0,
                    maxValue: 20
                }
            },
            {
                name: "EnginePower",
                displayName: 'EnginePower',
                isModel: false,
                type: "number",
                mandatory: true,
                measureUnit: 'tons',
                numberConstrain: {
                    minValue: 0,
                    maxValue: 100
                }
            },
            {
                name: "Country",
                displayName: "Country",
                isModel: false,
                type: "string",
                mandatory: false,
                categoricalConstrain: {
                    values: ['UA', 'EU', 'USA']
                }
            },
            {
                name: "Model",
                displayName: 'Model',
                isModel: false,
                type: "string",
                mandatory: false,
                categoricalConstrain: {
                    values: ['UA', 'EU', 'USA']
                }
            }
        ]

    }
];

const mockedResponse: MlPredictionResponse = {
    result: [
        {
            modelName: 'Linear regression model tests',
            price: 19000,
            deviation: 1343,
        },
        {
            modelName: 'Random forest test',
            price: 11000,
            deviation: 1343,
        }
    ]

}

export const inputMock = {
    mockedData,
    mockedResponse
};
