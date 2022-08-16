import {User} from "./app.js";
import {Role,referType,columnName} from "./models/model.js";

let apiData: Array<object> = [];
let usersData: Array<Array<string>> = [];
let columnList: Array<string> = [];

let env: {API_URL:string};
// fetching the env variables from the file
( async function(){
    let fetchData = await fetch('../env.json');
    env = await fetchData.json();
})();


// this api function is used to fetch the user data from the server
function api<T>(url: string): Promise<T> {
    return fetch(url)
      .then(response => {
        return response.json()
      })
  
  }

// this load_button element execute function when click on load_button and fetch the data from server
document.getElementById("load_button")?.addEventListener("click",async()=>{
    let data: Array<object> = await api(env.API_URL);
    console.log(data)
    if(document.getElementById("load_button")!.innerText === "Refresh data"){
        let Table = document.getElementById("table_tag") as HTMLTableElement;
        Table.innerHTML = "";
    }else{
        document.getElementById("load_button")!.innerHTML = "Refresh data";
        document.getElementById("table_tag")!.style.display = "revert";
        document.getElementById("input_tag")!.style.display = "flex";
    }
    apiData = data;
    loadTableData();
})

// this function is used to dynamically populate the user data fetch by api call into the table_tag element
function loadTableData(){
    let table = document.getElementById("table_tag") as HTMLTableElement;
    let row = table.insertRow(0);
    columnList = Object.keys(apiData[0]);
    columnList.push("Edit")
    usersData.splice(0,usersData.length);
    columnList.forEach((column)=>{
        if(column == columnName.userId){
            return;
        }
        let headerCell = document.createElement("th");
        headerCell.innerHTML = column.toUpperCase();
        row.appendChild(headerCell);
        
    })
    for (let i = 0; i < apiData.length; i++) { 
        row = table.insertRow(i+1);
        let arr: Array<string> = [];
        columnList.forEach((column)=>{
            if(column ===columnName.edit){
                let btn = document.createElement('input') as HTMLInputElement;
                btn.type = "button";
                btn.className = "btn";
                btn.value = "Edit";
                let cell = row.insertCell(-1)
                cell.appendChild(btn);
                btn.onclick = (function() {user.selectedRowEdit(this as unknown as referType);});

                let btn1 = document.createElement('input') as HTMLInputElement;
                btn1.type = "button";
                btn1.className = "btn1";
                btn1.value = "Delete";
                btn1.onclick = (function() {user.selectedRowDelete(this as unknown as referType)});

                cell.appendChild(btn1);
                return
            }
            if(column === columnName.userId){
                arr.push((apiData[i] as any)[column])
                return;
            }
            let cell = row.insertCell(-1)
            let inputField = document.createElement('input') as HTMLInputElement;
            if(column===columnName.phoneNumber){
                inputField.type="number";
            }
            else if(column===columnName.email){
                inputField.type="email";
            }
            else{
                inputField.type = "text";
            }
            inputField.value =(apiData[i] as any)[column]
            inputField.disabled = true
            inputField.required = true
            arr.push((apiData[i] as any)[column])
            cell.appendChild(inputField);
        })        
        usersData.push(arr);

    }

}; 

let user = new User(apiData,usersData);

// this event execute on submit to create the new user entry into the table
document.getElementById("input_tag")?.addEventListener("submit",(e:any)=>{
    e.preventDefault();
    if(e.target[5].value in Role){
        user.addUser(e);
    }else{
        alert(e.target[5].value+" role is not valid . Please choose from the given role : SuperAdmin , Admin , Subscriber");
        return;
    }
})

