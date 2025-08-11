import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Manufacturer } from '../../core/models/manufacturer.model';
import { ManufacturerService } from '../../core/services/manufacturer';

@Component({
  selector: 'app-manufacturers',
  imports: [CommonModule, FormsModule],
  templateUrl: './manufacturers.html',
  styleUrl: './manufacturers.scss',
})
export class Manufacturers {
  manufacturers: Manufacturer[] = [];
  newManufacturerName = '';
  isAdding = false;
  editId: number | null = null;
  editName = '';

  constructor(private manufacturerService: ManufacturerService) {}

  ngOnInit() {
    this.loadManufacturers();
  }

  loadManufacturers() {
    this.manufacturerService
      .getAllManufacturers()
      .subscribe((manufacturers) => {
        this.manufacturers = manufacturers;
      });
  }

  startEdit(manufacturer: Manufacturer) {
    this.editId = manufacturer.id;
    this.editName = manufacturer.name;
  }

  saveEdit(manufacturerId: number) {
    if (!this.editName.trim()) return;

    this.manufacturerService
      .updateManufacturer(manufacturerId, { name: this.editName })
      .subscribe(() => {
        this.editId = null;
        this.loadManufacturers();
      });
  }

  cancelEdit() {
    this.editId = null;
  }

  addManufacturer() {
    if (!this.newManufacturerName.trim() || this.isAdding) return;

    this.isAdding = true;
    this.manufacturerService
      .createManufacturer({ name: this.newManufacturerName })
      .subscribe({
        next: () => {
          this.newManufacturerName = '';
          this.isAdding = false;
          this.loadManufacturers();
        },
        error: () => {
          this.isAdding = false;
        },
      });
  }

  deleteManufacturer(manufacturerId: number) {
    if (
      confirm(
        'Удалить производителя? Все товары этого производителя останутся без указания производителя.'
      )
    ) {
      this.manufacturerService
        .deleteManufacturer(manufacturerId)
        .subscribe(() => {
          this.loadManufacturers();
        });
    }
  }
}
