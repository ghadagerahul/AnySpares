import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppConstants } from './services/appconstants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('anyspares-app');
  private destroy$ = new Subject<void>();

  constructor(private appConstants: AppConstants) { }

  ngOnInit(): void {
    console.log('App component initialized');
    this.appConstants.loadOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('App constants loaded:', data);
          this.appConstants.setOptions(data);
        },
        error: (error) => {
          console.error('Error loading app constants:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
