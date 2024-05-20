declare namespace API {
  type UserGenderEnum = 'MALE' | 'FEMALE';
  
  interface UserInfo {
    id?: string;
    username?: string;
    password?: string;
    mobile?: string;
    email?: string;
    sex?: string;
    age?: number;
    gender?: UserGenderEnum;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
  }

  interface RoleInfo {
    id?: string;
    title?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    access?: any[];
  }

  interface AccessInfo {
    id?: string;
    moduleName?: string;
    type?: number;
    actionName?: string;
    url?: string;
    moduleId?: string;
    sort?: number;
    description?: string;
    status?: number;
    createdAt?: string;
    access?: any[];
  }

  interface Result_PageInfo_UserInfo__ {
    success?: boolean;
    errorMessage?: string;
    data?: PageInfo_UserInfo_;
  }

  interface Result_UserInfo_ {
    success?: boolean;
    errorMessage?: string;
    data?: UserInfo;
  }

  interface Result_string_ {
    success?: boolean;
    errorMessage?: string;
    data?: string;
  }
}

