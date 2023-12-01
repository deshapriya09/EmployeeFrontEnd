import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { EmployeeVM } from '../model/Employee';
import { HttpEventType } from '@angular/common/http';
import { EmployeeService } from '../service/employee.service';
import { DepartmentService } from '../service/department.service';
import { DepartmentVM } from '../model/Department';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  
  datepickerConfig: Partial<BsDatepickerConfig>={};

  showBasicSalary = false;

  employeeForm: any;

  employeeSearchtForm : any;
  public SearchText : any;
  fileToUpload: any;
  imagePath: string='' ;
  Date : any;

  updatedDateOfBirth :any;

  
  public firstname: string ='';
  public lastname: string = '';
  public address : string = '';
  public dateofbirth: string = '';
  public basicsalary: number = 0; 
  public department: string = ''; 

  
  public employeeVM: EmployeeVM[]=[];
  public departments: DepartmentVM[] = [];
  public genders: any[] = [];

  public progress: number = 0;
  public message: string = '';

  public response: { dbPath: string } = { dbPath: '' };


  employeeId =0;
  d = 0;

  constructor(
    private formbulider: FormBuilder,
    public toastrService: ToastrService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private datePipe: DatePipe)
     {
      this.datepickerConfig = Object.assign({},
    {
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      // minDate: new Date(2021, 0, 11),
      // maxDate : new Date(new Date().setDate(new Date().getDate()-1)),
      // dateInputFormat:'DD/MM/YYYY',
      dateInputFormat:'YYYY-MM-DD'
    })
  }


  ngOnInit(): void {

    this.employeeForm = this.formbulider.group(
      {
        firstname: ['', [Validators.required, Validators.maxLength(128)]],
        lastname:['', [Validators.required, Validators.maxLength(128)]],
        address:['',Validators.required],
        gender: [this.employeeVM[0]?.gender || '', Validators.required],
        photoPath: [''],
        tempImgPath:[''],
        dateofbirth:['',Validators.required],
        basicsalary:[null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        showBasicSalary: [false], 
        departmentId: ['']
      }
    );

    this.employeeSearchtForm = this.formbulider.group(
      {
        search:['',Validators.required],
      }
    )

    this.GetAllEmployee();
    this.GetDepartmentDetails();
    this.GetDepartmentName(1);

    this.loadGenders();
    

  }

  toggleBasicSalary() {
    this.showBasicSalary = !this.showBasicSalary;

    if (this.showBasicSalary) {
      this.employeeForm.get('basicsalary')?.enable();
    } else {
      this.employeeForm.get('basicsalary')?.disable();
    }
  }

  // Function to check if the basicsalary control should be visible
  isBasicSalaryVisible() {
    return this.showBasicSalary;
  }

  //success message by toastr service

  Success(message: string) {
    this.toastrService.success(message);
  }

  //error message by toastr service

  Error(message: string) {
    this.toastrService.error(message);
  }

  get FirstName(){
    return this.employeeForm.get('firstname')
  }

  get LastName(){
    return this.employeeForm.get('lastname')
  }

  get Address(){
    return this.employeeForm.get('address')
  }

  get DateOfBirth(){
    return this.employeeForm.get('dateofbirth')
  }

  get BasicSalary(){
    return this.employeeForm.get('basicsalary')
  }

  loadGenders(): void {
    this.genders = [
      { id: 'M', name: 'Male' },
      { id: 'F', name: 'Female' },
    ];
  }

  GetDepartmentDetails() {
    this.departmentService.GetAllDepartments().subscribe(
      (departments : DepartmentVM[]) => {
        console.log(departments,"SS");
          this.departments = departments;
          console.log(departments,"dep")
        },
        (error: any) => {
          console.error('Error loading departments:', error);
        }
      );
  }

  GetDepartmentName(departmentId: number): string {
    console.log(departmentId,"DD");
    const department = this.departments.find((d) => d.id === departmentId);
    return department ? department.name : '';
    
  }

  GetGenderName(genderId: string): string {
    const gender = this.genders.find((g) => g.id === genderId);
    return gender ? gender.name : '';
  }

  GetAllEmployee() {
    this.employeeService.GetAllEmployee().subscribe( 
      (data : EmployeeVM[]) => {
     // if (data.isSuccess) {
       console.log(data,"Dataa");
       this.employeeVM = data;
   },
   (error: any) => {
    console.error('Error loading employee:', error);
  });
  }

  PostEmployee(employee: EmployeeVM){
    // employee.dateOfBirth = employee.dateOfBirth.toISOString();
    
    if(this.employeeId==0){
      // employee.photoPath=this.response.dbPath;
      console.log(employee,"ppp")
        this.employeeService.AddEmployeeData(employee).subscribe(
          () => {
            this.Success('Data Saved Successfully');
            this.GetAllEmployee();
            this.resetForm();
          }
        );
      }else{
        // employee.photoPath=this.imagePath; //this.pathToSave+
        employee.id = this.employeeId;
        console.log(employee,"lll")
        this.employeeService.UpdateEmployeeData(employee).subscribe(
          () => {
          this.Success('Record Updated Successfully');
          this.GetAllEmployee();
          this.resetForm();
        });
      }
    }

  employeeDetailsToEdit(id : number) { 
    //debugger;
    console.log(id,"Data");
    this.employeeService.GetEmployeeById(id).subscribe((employeeResult:EmployeeVM) => {
      console.log(employeeResult,"employeeResult");
      this.employeeId= employeeResult.id;
      this.employeeForm.controls['firstname'].setValue(employeeResult.firstName);
      this.employeeForm.controls['lastname'].setValue(employeeResult.lastName);
      this.employeeForm.controls['gender'].setValue(employeeResult.gender);
      this.employeeForm.controls['dateofbirth'].setValue(this.datePipe.transform( employeeResult.dateOfBirth, 'YYYY-MM-dd')); 
      this.employeeForm.controls['address'].setValue(employeeResult.address);;
      this.employeeForm.controls['departmentId'].setValue(employeeResult.departmentId);;
      // this.employeeForm.controls['date'].setValue(this.datePipe.transform( employeeResult.date, 'dd/MM/yyyy hh:mm'));
      this.employeeForm.controls['basicsalary'].setValue(employeeResult.basicSalary);
      //('currentDate').split('T')[0];
      console.log(this.employeeForm.controls,"Data");
    });
  }
  
  DeleteEmployee(id: number) {
    if (confirm('Do you want to delete this Record?')) {
      this.employeeService.DeleteEmployeeById(id).subscribe(() => {
        this.Success('Record Deleted Successfully');
        this.GetAllEmployee();
        this.resetForm();
      });
    }
  }

  SearchaircraftDetails(search: string) { 
    if(search==""){
      this.GetAllEmployee();
    }
    else{
       // console.log(id,"Data");
    this.employeeService.SearchEmployeeData(search).subscribe(employeeResult => {
      console.log(employeeResult,"Result");
     this.employeeVM=employeeResult;
   });
    }
   
  }

  SearchEmployeeDetails(search: string) {
    if (search === "") {
      this.GetAllEmployee();
    } else {
      this.employeeService.SearchEmployeeData(search).subscribe(
        (employeeResults: EmployeeVM[]) => {
          console.log(employeeResults, "employeeResults");
          this.employeeVM = employeeResults;
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }
 
  resetForm() {  
      this.employeeForm.reset();
      this.employeeId=0;
      // this.aircraft.photoPath='';
      this.imagePath='';
      this.message = '';
      this.dateofbirth=this.Date;
      // this.employeeForm.  
      // this.dataSaved = false;  
    }  

}
