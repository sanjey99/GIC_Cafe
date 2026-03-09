export interface CafeDto {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  location: string;
  employees: number;
}

export interface EmployeeDto {
  id: string;
  name: string;
  emailAddress: string;
  phoneNumber: string;
  gender: 'Male' | 'Female';
  daysWorked: number;
  cafe: string | null;
  cafeId: string | null;
}

export interface CreateCafePayload {
  name: string;
  description: string;
  logo: string | null;
  location: string;
}

export interface UpdateCafePayload extends CreateCafePayload {
  id: string;
}

export interface CreateEmployeePayload {
  name: string;
  emailAddress: string;
  phoneNumber: string;
  gender: 'Male' | 'Female';
  cafeId: string | null;
}

export interface UpdateEmployeePayload extends CreateEmployeePayload {
  id: string;
}
