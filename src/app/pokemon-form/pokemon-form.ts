
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pokemon } from '../pokemon';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-pokemon-form',
  styleUrl: './pokemon-form.css',
  templateUrl: './pokemon-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonForm implements OnInit {

  private FormBuilder = inject(FormBuilder);

  pokemonService = inject(Pokemon);

  pokemonForm = this.FormBuilder.nonNullable.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    level: [1, [Validators.required, Validators.min(1)]],
    nature: ['', Validators.required]
  });

  ngOnInit() {
    this.pokemonService.fetchPokemon();
  }

  onSubmit() {
    if (this.pokemonForm.invalid) {
      return;
    }

    const data = this.pokemonForm.getRawValue();

    this.pokemonService.savePokemon(data).subscribe({
      next: () => {
        this.pokemonService.fetchPokemon();
        this.pokemonForm.reset();
        console.log('Pokemon saved successfully');
      },
      error: (error) => {
        console.error('Failed to save Pokemon:', error);
      }
    });
  }

  deletePokemon(id: string) {
    this.pokemonService.deletePokemon(id).subscribe({
      next: () => {
        this.pokemonService.fetchPokemon();
        console.log('Pokemon deleted successfully');
      },
      error: (error) => {
        console.error('Failed to delete Pokemon:', error);
      }
    });
  }
}
