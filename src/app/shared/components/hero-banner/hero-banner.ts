import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero-banner',
  imports: [],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.scss',
})
export class HeroBanner {
  @Input() imageUrl = 'assets/hero-default.jpg';
  @Input() title = 'Специальные предложения';
  @Input() subtitle = 'Скидки до 50% на сезонные товары';
  @Input() ctaText = 'Купить сейчас';
}
