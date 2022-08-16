import {userAction , Role, referType} from "./models/model.js";

let env: {API_URL:string};
// fetching the env variables from the file
( async function(){
    let fetchData = await fetch('../env.json');
    env = await fetchData.json();
})();

// this function is used as a decorator to format the dateTime for the created user
function userCreatedDate(){
    return function(target: any,key:string,descriptor:PropertyDescriptor){
        let val = descriptor.value
        descriptor.value = function(... args:any[]){
            let arr:Array<string> = [];
            for(let j=0;j<args[0].target.length-2;j++){
                arr.push(args[0].target[j].value)
            }
            let d: Date = new Date();
            let dt = d.getDate()+" "+d.toLocaleString('en-US', {month: 'long',})+" "+d.getFullYear()+" Time: "+d.getHours()+":"+d.getMinutes();
            arr.push(dt.toString())
            return val.apply(this,[arr]);
        }
    }
}

export class User<T extends Array<object>,U extends Array<Array<string>>> implements userAction{
    apiData:Array<object> = [];
    usersData:Array<Array<string>> = [];
    
    constructor( apiData:T,usersData:U){
        this.apiData = apiData
        this.usersData = usersData
    }
    
    @userCreatedDate()
    // This addUser method is used to create new user in database and add to the table
    addUser(arr:Array<string>){
        document.getElementById("reset")?.click();
        let table = document.getElementById("table_tag") as HTMLTableElement;
        let data ={
            "firstName": arr[0],
            "middleName": arr[1],
            "lastName": arr[2],
            "email": arr[3],
            "phoneNumber": arr[4],
            "role": arr[5],
            "address": arr[6],
            "createdDate": arr[7]
            }
        fetch(env.API_URL, {method: "POST",body:JSON.stringify(data),headers: {
            "Content-type": "application/json; charset=UTF-8"
        }}).then(response => {
        return response.json()
      })
        .then((response)=>{
            this.usersData.push([response.rows[0].user_id,...arr]);
            let i = this.usersData.length-1;
            let row = table.insertRow(i+1);
            for(let j=1;j<arr.length+2;j++){
                if(j ===arr.length+1){
                    let btn = document.createElement('input') as HTMLInputElement;
                    btn.type = "button";
                    btn.className = "btn";
                    btn.value = "Edit";
                    let cell = row.insertCell(-1)
                    cell.appendChild(btn);
                    btn.onclick = (()=> {this.selectedRowEdit(btn as unknown as referType)});
    
                    let btn1 = document.createElement('input') as HTMLInputElement;
                    btn1.type = "button";
                    btn1.className = "btn1";
                    btn1.value = "Delete";
                    btn1.onclick = (()=> {this.selectedRowDelete(btn1 as unknown as referType)});
    
                    cell.appendChild(btn1);
                    return
                }
                let cell = row.insertCell(-1)
                let inputField = document.createElement('input') as HTMLInputElement;
                inputField.type = "text";
                inputField.value =this.usersData[i][j]
                inputField.disabled = true
                cell.appendChild(inputField);
            }   
        });
    }
 
    // this selectedRowEdit method is used to edit the selected user in database and table
    selectedRowEdit(refer:referType){
        let j : number = 0;
            for(j=0;j<refer.parentNode.parentNode.cells.length-1;j++){
                if(j===refer.parentNode.parentNode.cells.length-2){
                    continue;
                }
                refer.parentNode.parentNode.cells[j].childNodes[0].disabled = false
            }
            refer.parentNode.parentNode.cells[j].childNodes[0].value = "Save";
            let arrChanged = [...this.usersData[refer.parentNode.parentNode.rowIndex-1]]
            refer.parentNode.parentNode.cells[j].childNodes[0].onclick=()=>{
                if(refer.parentNode.parentNode.cells[5].childNodes[0].value in Role){}
                else{
                    alert(arrChanged[5]+" role is not valid . Please choose from the given role : SuperAdmin , Admin , Subscriber");
                    return;
                }
                for(j=1;j<refer.parentNode.parentNode.cells.length-1;j++){

                    arrChanged[j] = refer.parentNode.parentNode.cells[j-1].childNodes[0].value
                    refer.parentNode.parentNode.cells[j-1].childNodes[0].disabled = true
                    
                }
                let data ={
                    "firstName": arrChanged[1],
                    "middleName": arrChanged[2],
                    "lastName": arrChanged[3],
                    "email": arrChanged[4],
                    "phoneNumber": arrChanged[5],
                    "role": arrChanged[6],
                    "address": arrChanged[7],
                    "createdDate": arrChanged[8]
                    }
                fetch(`${env.API_URL}/${arrChanged[0]}`, {method: "PUT",body:JSON.stringify(data),headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }}).then(()=>{
                    this.usersData[refer.parentNode.parentNode.rowIndex-1] = arrChanged;
                    refer.parentNode.parentNode.cells[j].childNodes[1].value = "Delete";
                    refer.parentNode.parentNode.cells[j].childNodes[1].onclick = (()=>{this.selectedRowDelete(refer)})
                    refer.parentNode.parentNode.cells[j].childNodes[0].value = "Edit";
                    refer.parentNode.parentNode.cells[j].childNodes[0].onclick = (()=>{this.selectedRowEdit(refer)})
                }).catch((err)=>{
                    alert(err);
                })
            }
            refer.parentNode.parentNode.cells[j].childNodes[1].value = "Cancel";
            refer.parentNode.parentNode.cells[j].childNodes[1].onclick=()=>{
                for(j=1;j<refer.parentNode.parentNode.cells.length-1;j++){
                    refer.parentNode.parentNode.cells[j-1].childNodes[0].value = this.usersData[refer.parentNode.parentNode.rowIndex-1][j]
                    refer.parentNode.parentNode.cells[j-1].childNodes[0].disabled = true
    
                }
                refer.parentNode.parentNode.cells[j].childNodes[1].value = "Delete";
                refer.parentNode.parentNode.cells[j].childNodes[1].onclick = (()=>{this.selectedRowDelete(refer)})
                refer.parentNode.parentNode.cells[j].childNodes[0].value = "Edit";
                refer.parentNode.parentNode.cells[j].childNodes[0].onclick = (()=>{this.selectedRowEdit(refer)})
            }
    }

    // this method is used to delete or remove the selected user row from the table and from the database
    selectedRowDelete(i:referType){
        let rIndex:number,table = document.getElementById("table_tag") as HTMLTableElement;
                rIndex = i.parentNode.parentNode.rowIndex;
                const deletedData = this.usersData.splice(rIndex-1,1);
                fetch(`${env.API_URL}/${deletedData[0][0]}`,{method:'DELETE'}).then((response:any)=>{
                    table.deleteRow(rIndex)
                })

    }

}