import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeVM } from 'src/app/model/Employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  url = 'https://localhost:44321/api/Employee/';

  constructor(private http: HttpClient) { }

  GetAllEmployee(): Observable<EmployeeVM[]> {
    console.log("ccc");
    return this.http.get<EmployeeVM[]>(this.url + 'GetAllEmployee');
  }

  AddEmployeeData(employeeData: EmployeeVM): Observable<EmployeeVM> {
    console.log(employeeData,"mm");
    const httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<EmployeeVM>(this.url + 'AddEmployee', employeeData, httpHeaders);
  }

  UpdateEmployeeData(employeeData: EmployeeVM): Observable<EmployeeVM> {
    console.log(employeeData,"updateEmp");
    const httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<EmployeeVM>(this.url + 'UpdateEmployee', employeeData, httpHeaders);
  }

  DeleteEmployeeById(id: number): Observable<number> {
    return this.http.delete<number>(this.url + 'DeleteEmployeeDetailsById/' + id);
  }

  GetEmployeeById(id: number): Observable<EmployeeVM> {
    return this.http.get<EmployeeVM>(this.url + 'GetEmployeeDetailsById/' + id);
  }

  SearchEmployeeData(search : string): Observable<EmployeeVM[]> {
    return this.http.get<EmployeeVM[]>(this.url + 'EmployeeSearch?search=' + search);
  }

}
