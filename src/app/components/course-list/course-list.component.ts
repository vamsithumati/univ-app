import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CourseService } from '../../services/course.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  displayedColumns: string[] = ['university', 'city', 'country', 'courseName', 'courseDescription', 'startDate', 'endDate' , 'price'];
  dataSource = new MatTableDataSource();
  totalCourses = 0;
  pageSize = 10;
  pageIndex = 0;
  filterValue = '';  // Holds the filter text
// "id": str(course["_id"]),
//         "university": course["university"],
//         "city": course["city"],
//         "country": course["country"],
//         "courseName": course["courseName"],
//         "courseDescription": course["courseDescription"],
//         "startDate": course["startDate"],
//         "endDate": course["endDate"],
//         "price": course["price"],
//         "currency": course["currency"]
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private courseService: CourseService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getCourses(this.pageIndex, this.pageSize, this.filterValue);  // Initial load of data
  }

  getCourses(pageIndex: number, pageSize: number, filter: string): void {
    const skip = pageIndex * pageSize;

    this.courseService.getFilteredCourses(skip, pageSize, filter).subscribe(
      (response) => {
        this.dataSource.data = response.courses;
        this.totalCourses = response.total;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Failed to fetch courses', error);
      }
    );
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getCourses(this.pageIndex, this.pageSize, this.filterValue);
  }

  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.pageIndex = 0;  // Reset to first page on new filter
    this.getCourses(this.pageIndex, this.pageSize, this.filterValue);  // Fetch filtered data
  }

  editCourse(id: string): void {
    this.router.navigate([`/courses/edit/${id}`]);
  }

  deleteCourse(id: string): void {
    this.courseService.deleteCourse(id).subscribe(() => {
      this.snackBar.open('Course deleted successfully', 'Close', { duration: 3000 });
      this.getCourses(this.pageIndex, this.pageSize, this.filterValue);  // Refresh the list after deletion
    },
    (error) => {
      this.snackBar.open('Failed to delete course', 'Close', { duration: 3000 });
      console.error('Failed to delete course', error);
    });
  }
}
