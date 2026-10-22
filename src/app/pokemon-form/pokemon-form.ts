
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Pokemon } from '../pokemon';

@Component({
  selector: 'app-pokemon-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pokemon-form.html',
  styleUrl: './pokemon-form.css'
})
export class PokemonForm implements OnInit {
  pokemonService = inject(Pokemon);
  private FormBulider = inject(FormBuilder);

  editingId: string | null = null;
  message = '';

  pokemonForm = this.FormBulider.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    level: [1, [Validators.required, Validators.min(1)]],
    nature: ['', Validators.required]
  });

  ngOnInit() {
    this.pokemonService.fetchPokemon();
  }

  savePokemon() {
    if (this.pokemonForm.invalid) {
      this.pokemonForm.markAllAsTouched();
      return;
    }

    const data = this.pokemonForm.getRawValue();

    if (this.editingId) {
      this.pokemonService
        .updatePokemon(this.editingId, data)
        .subscribe({
          next: () => {
            this.pokemonService.fetchPokemon();
            this.cancelEdit();
            this.message = 'Pokémon updated successfully!';
          },
          error: (error) => {
            console.error('Update failed:', error);
            this.message = 'Failed to update Pokémon.';
          }
        });
    } else {
      this.pokemonService.savePokemon(data).subscribe({
        next: () => {
          this.pokemonService.fetchPokemon();
          this.pokemonForm.reset({ level: 1 });
          this.message = 'Pokémon saved successfully!';
        },
        error: (error) => {
          console.error('Save failed:', error);
          this.message = 'Failed to save Pokémon.';
        }
      });
    }
  }

  editPokemon(pokemon: any) {
    this.editingId = pokemon._id;

    this.pokemonForm.patchValue({
      name: pokemon.name,
      type: pokemon.type,
      level: pokemon.level,
      nature: pokemon.nature
    });

    this.message = '';
  }

  cancelEdit() {
    this.editingId = null;
    this.pokemonForm.reset({ level: 1 });
    this.message = '';
  }

  deletePokemon(id: string) {
    if (!confirm('Are you sure you want to delete this Pokémon?')) {
      return;
    }

    this.pokemonService.deletePokemon(id).subscribe({
      next: () => {
        this.pokemonService.fetchPokemon();

        if (this.editingId === id) {
          this.cancelEdit();
        }

        this.message = 'Pokémon deleted successfully!';
      },
      error: (error) => {
        console.error('Delete failed:', error);
        this.message = 'Failed to delete Pokémon.';
      }
    });
  }
}
