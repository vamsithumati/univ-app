import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cities, countries, currencies, universities } from '../../models/data';
import { Course } from '../../models/course';
import { map, Observable, startWith } from 'rxjs';


@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  courseForm: FormGroup;
  isUpdateMode = false;
  courseId!: string;
  currencies = currencies;
  countries = countries;
  cities = cities;
  universities = universities;
  courseSource: Course | null = null;
  universityControl: FormControl;
  filteredUniversities!: Observable<string[]>;
  countryControl: FormControl<string | null>;
  cityControl: FormControl<string | null>;
  filteredCities: Observable<string[]>;
  filteredCountries: Observable<string[]>;


  
  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {

    this.universityControl = new FormControl('', [Validators.required, this.listValidator.bind(this)]);
    this.countryControl = new FormControl('', [Validators.required, this.listValidator.bind(this)]);
    this.cityControl = new FormControl('', [Validators.required, this.listValidator.bind(this)]);
    this.universityControl = new FormControl('', [Validators.required, this.listValidator.bind(this)]);
    this.courseForm = new FormGroup({
      courseName: new FormControl('', [Validators.required]),
      university: this.universityControl,
      country: this.countryControl,
      city: this.cityControl,
      price: new FormControl(0, [Validators.required, Validators.min(1)]),
      currency: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      courseDescription: new FormControl('', [Validators.required]),
    });
    this.filteredUniversities = this.universityControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.universities))
    );
    this.filteredCities = this.cityControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.cities))
    );
    this.filteredCountries = this.countryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.countries))
    );
  }
  private _filter(value: string | null, list: string[]): string[] {
    const filterValue = value ?  value?.toLowerCase() : '';
    return list.filter(key =>
      key.toLowerCase().includes(filterValue)
    );
  }
  listValidator(control: AbstractControl) {
    let arrayValues: Array<string> = [];
    if(control === this.universityControl){
      arrayValues = this.universities;
    }else if(control === this.cityControl){
      arrayValues = this.cities
    }else if(control === this.countryControl){
      arrayValues = this.countries
    }
    const enteredValue = control.value;
    if (enteredValue && !arrayValues.includes(enteredValue)) {
      return { invalidListEntry: true };  // Return error if value is not in the list
    }
    return {};  // Valid input
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.courseId = params['id'];
        this.isUpdateMode = true;
        if(this.isUpdateMode){
          this.courseForm.get('courseName')?.disable();
          this.courseForm.get('country')?.disable();
          this.courseForm.get('city')?.disable();
          this.courseForm.get('university')?.disable();
        }
        this.courseService.getCourse(this.courseId).subscribe(course => {
          if(!this.currencies.includes(course.currency)){
            this.currencies.push(course.currency)
          }
          if(!this.cities.includes(course.city)){
            this.cities.push(course.city)
          }
          if(!this.universities.includes(course.university)){
            this.universities.push(course.university)
          }
          if(!this.countries.includes(course.country)){
            this.countries.push(course.country)
          }
          this.courseSource = course;

          this.courseForm.patchValue(course);
        });
      }
    });
  }

  saveCourse(): void {
    if(this.courseForm.invalid){
      this.courseForm.updateValueAndValidity();
      return;
    }
    if (this.isUpdateMode) {
      this.courseService.updateCourse(this.courseId, {...this.courseSource,...this.courseForm.value}).subscribe(() => {
        this.snackBar.open('Course updated successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/courses']);
      });
    } else {
      this.courseService.createCourse(this.courseForm.value).subscribe(() => {
        this.snackBar.open('Course created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/courses']);
      });
    }
  }

  onCancel(){
    if(this.isUpdateMode && this.courseSource){
      this.courseForm.patchValue(this.courseSource);
    }else{
      this.courseForm.reset();
    }
    
  }
}
