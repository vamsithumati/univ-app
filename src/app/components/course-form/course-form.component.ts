import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  courseForm: FormGroup;
  isUpdateMode = false;
  courseId!: string;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.courseForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      duration: new FormControl(0, [Validators.required, Validators.min(1)]),
      date: new FormControl(new Date().toISOString().split('T')[0], [Validators.required])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.courseId = params['id'];
        this.isUpdateMode = true;
        this.courseService.getCourse(this.courseId).subscribe(course => {
          this.courseForm.patchValue(course);
        });
      }
    });
  }

  saveCourse(): void {
    if (this.isUpdateMode) {
      this.courseService.updateCourse(this.courseId, this.courseForm.value).subscribe(() => {
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
}
