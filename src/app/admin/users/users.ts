import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user';

@Component({
  selector: 'app-users',
  imports: [DatePipe, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  users: User[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 1;
  isLoading = true;
  searchQuery = '';
  roleFilter: 'user' | 'admin' | 'all' = 'all';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService
      .getUsers(
        this.currentPage,
        this.itemsPerPage,
        this.roleFilter !== 'all' ? this.roleFilter : undefined,
        this.searchQuery
      )
      .subscribe({
        next: (response) => {
          this.users = response.items;
          console.log('this.users', this.users);
          this.totalItems = response.total;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  onPageChange(page: string | number) {
    this.currentPage = parseInt(page as string);
    this.loadUsers();
  }

  onRoleChange(role: string) {
    this.roleFilter = role as 'user' | 'admin' | 'all';
    this.currentPage = 1;
    this.loadUsers();
  }

  searchUsers() {
    this.currentPage = 1;
    this.loadUsers();
  }

  toggleUserStatus(userId: string, currentStatus: boolean) {
    const newStatus = !currentStatus;
    this.userService.updateUserStatus(userId, newStatus).subscribe({
      next: () => {
        const user = this.users.find((u) => u.id === userId);
        if (user) {
          user.isActive = newStatus;
        }
      },
      error: () => {
        alert('Ошибка при изменении статуса');
      },
    });
  }

  changeUserRole(userId: string, event: Event) {
    const newRole = (event.target as HTMLTextAreaElement).value as
      | 'user'
      | 'admin';
    this.userService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        const user = this.users.find((u) => u.id === userId);
        if (user) {
          user.role = newRole;
        }
      },
      error: () => {
        alert('Ошибка при изменении роли');
      },
    });
  }

  get visiblePages(): (number | string)[] {
    const maxVisiblePages = 5;
    const pages: (number | string)[] = [];

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    } else {
      const startPage = Math.max(
        1,
        this.currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(
        this.totalPages,
        startPage + maxVisiblePages - 1
      );

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) pages.push(i);

      if (endPage < this.totalPages) {
        if (endPage < this.totalPages - 1) pages.push('...');
        pages.push(this.totalPages);
      }
    }

    return pages;
  }
}
