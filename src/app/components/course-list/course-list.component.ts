import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CourseService } from '../../services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  displayedColumns: string[] = [ 'courseName', 'location', 'startDate', 'length', 'price'];
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

  constructor(private courseService: CourseService, private router: Router, private snackBar: MatSnackBar, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.filterValue = params['search'] || '';
      this.pageIndex = 0;  // Reset pagination if a new search is applied
      this.getCourses(this.pageIndex, this.pageSize, this.filterValue);
    });
  }

  ngOnInit(): void {
  }

  getCourses(pageIndex: number, pageSize: number, filter: string): void {
    this.courseService.getFilteredCourses(pageIndex+1, pageSize, filter).subscribe(
      (response) => {
        this.dataSource.data = response.courses;
        this.totalCourses = response.total;
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
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

  public getLength(end: string, start: string){
    return (new Date(end).getTime()  - new Date(start).getTime())/(1000*60*60*24)
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
