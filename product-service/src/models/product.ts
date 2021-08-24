type MetricValueType = {
  value: number;
  unit: string;
};

type ImperialValueType = {
  value: string;
};

type MeasureType = {
  metric?: MetricValueType;
  imperial?: ImperialValueType;
};

export type Product = {
  id: number;
  name: string;
  description?: string;
  specifications?: {
    yard?: string;
    type?: string;
    guests?: number;
    crew?: number;
    cabins?: number;
    length?: MeasureType;
    beam?: MeasureType;
    draft?: MeasureType;
    yearOfBuild?: number;
    classification?: string;
    refit?: number;
    displacement?: string;
    brand?: string;
    model?: string;
    enginePower?: MeasureType;
    totalPower?: MeasureType;
    maximumSpeed?: MeasureType;
    cruisingSpeed?: MeasureType;
    range?: MeasureType;
    fuelConsumption?: MeasureType;
    grossTonage?: number;
    hull?: string;
    superstructure?: string;
    interiorDesigner?: string;
    generator?: string;
    stabilizers?: string;
    zeroSpeed?: string;
    waterCapacity?: number;
    flag?: string;
    portOfRegistry?: string;
    fuelCapacity?: number;
  };
  price?: {
    data: {
      amount: number;
      currency?: string;
    }[];
  };
};
