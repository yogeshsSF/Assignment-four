export enum Role {
  superAdmin = "SuperAdmin",
  Admin = "Admin",
  Subscriber = "Subscriber"
}
export enum columnName{
  userId = 'user_id',firstName = 'First Name', middleName = 'Middle Name', lastName= 'Last Name',email= 'Email',phoneNumber = 'Phone Number',role= 'Role',address = 'Address',createdDate = 'User Created Date',edit = 'Edit'
}
interface objProperty{
  childNodes:Array<HTMLInputElement>
}

export type referType={
  parentNode:{parentNode:{cells:Array<objProperty>;rowIndex:number}}
} 

export interface userAction{
  apiData:Array<object>,
  usersData:Array<Array<string>>,
  addUser(arr:Array<string>):void,
  selectedRowEdit(refer:referType):void,
  selectedRowDelete(i:referType):void
}