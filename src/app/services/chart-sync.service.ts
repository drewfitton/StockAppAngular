import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChartSyncService {
  private _activeIndex = new BehaviorSubject<number | null>(null);
  private _activeLabel = new BehaviorSubject<string | null>(null);

  activeIndex$ = this._activeIndex.asObservable();
  activeLabel$ = this._activeLabel.asObservable();

  set activeIndex(index: number | null) {
    this._activeIndex.next(index);
  }

  get activeIndex(): number | null {
    return this._activeIndex.getValue();
  }

  set activeLabel(label: string | null) {
    this._activeLabel.next(label);
  }

  get activeLabel(): string | null {
    return this._activeLabel.getValue();
  }
}
