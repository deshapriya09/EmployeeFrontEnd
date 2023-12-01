import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepartmentVM } from '../model/Department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  
  url = 'https://localhost:44321/api/Department/';

  constructor(private http: HttpClient) { }

  GetAllDepartments(): Observable<DepartmentVM[]> {
    console.log("BB");
    return this.http.get<DepartmentVM[]>(this.url + 'GetAllDepartment');
  }
}
