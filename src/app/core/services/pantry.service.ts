import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PantryItem } from '../models/pantry-item';

@Injectable({
  providedIn: 'root'
})
export class PantryService {
  private apiUrl = `${environment.apiUrl}/pantry`;

  constructor(private http: HttpClient) {}

  getMyPantryItems(): Observable<PantryItem[]> {
    return this.http.get<PantryItem[]>(this.apiUrl);
  }

  addPantryItem(item: Omit<PantryItem, 'id'>): Observable<PantryItem> {
    return this.http.post<PantryItem>(this.apiUrl, item);
  }

  updatePantryItem(id: string, item: Partial<PantryItem>): Observable<PantryItem> {
    return this.http.put<PantryItem>(`${this.apiUrl}/${id}`, item);
  }

  deletePantryItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchRecipesByPantry(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/suggest-recipes`);
  }
}
