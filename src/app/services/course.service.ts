import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course';

export interface ResponseCourse {
  courses: Course[];
  limit: number;
  page: number;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'https://univ-backend-vhua.onrender.com'; // Replace with your FastAPI backend URL

  constructor(private http: HttpClient) {}

  // Get all courses
  getCourses(): Observable<ResponseCourse> {
    return this.http.get<ResponseCourse>(`${this.apiUrl}/courses/`);
  }
  // Get paginated courses
  getFilteredCourses(skip: number, limit: number, search: string): Observable<ResponseCourse> {
    return this.http.get<any>(`${this.apiUrl}/courses?skip=${skip}&limit=${limit}&search=${search}`);
  }
  // Get a single course by ID
  getCourse(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/courses/${id}`);
  }

  // Create a new course
  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/courses/`, course);
  }

  // Update a course by ID
  updateCourse(id: string, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/courses/${id}`, course);
  }

  // Delete a course by ID
  deleteCourse(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/courses/${id}`);
  }
}
