import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  searchKeyword = new FormControl('')
  constructor(private router: Router, private route: ActivatedRoute) {

    this.route.queryParams.subscribe(params => {
      let filterValue = params['search'] || '';
      this.searchKeyword.patchValue(filterValue);
    });
  }


  onSearch(): void {
    // Navigate to the courses route and pass the search query as a query parameter
    this.router.navigate(['/courses'], { queryParams: { search: this.searchKeyword.value } });
  }
}
