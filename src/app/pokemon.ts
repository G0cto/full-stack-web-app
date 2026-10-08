import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

@Injectable( {
    providedIn: 'root'
})

export class Pokemon {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5000/api/pokemon';

    //Reactive state management using signals
    pokemonList = signal<any[]>([]);

    
    //fetch request for database data
    fetchPokemon() {
        this.http.get<any[]>(this.apiUrl).subscribe(data => this.pokemonList.set(data));
    }

    //saves our data t othe database
    savePokemon(data: any) {
        return this.http.post(this.apiUrl, data);
    }
}
