export interface IInsurance {
  title: string;
  details: string;
  features: string[];
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
export type TInsurance = Partial<IInsurance>;

export type TInsuranceUpdate = Partial<IInsurance> & {
  insuranceId: string;
};
