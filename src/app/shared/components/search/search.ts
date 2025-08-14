import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { SearchService } from '../../../core/services/search';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  searchControl = new FormControl('');
  suggestions: string[] = [];

  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query && query.length > 2) {
            return this.searchService.getSearchSuggestions(query);
          }
          return [];
        })
      )
      .subscribe((suggestions) => {
        this.suggestions = suggestions;
      });
  }

  selectSuggestion(suggestion: string) {
    this.searchControl.setValue(suggestion);
    this.suggestions = [];
    this.search();
  }

  search() {
    const query = this.searchControl.value?.trim();
    if (query) {
      this.router.navigate(['/search'], {
        queryParams: { q: query },
        queryParamsHandling: 'merge',
      });
    }
  }
}
