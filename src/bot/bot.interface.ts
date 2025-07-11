export enum  UserState {
  subscripions,
  firstname,   // 0
  lastname,  // 1
  age,
  country,
  contact,
  menu,
    // 2
}
export interface UserData{
    step:UserState,
    data: Partial<{
    firstname: string;
    lastname: string;
    contact: string;
    country:string;
    } & { age: number }>;
}

export const userState = new Map<number,UserData>()