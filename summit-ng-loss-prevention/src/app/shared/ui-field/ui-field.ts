import { Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from '@openng/optimus-ui/datepicker';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Select } from '@openng/optimus-ui/select';

@Component({ selector: 'app-ui-field', imports: [FormsModule, DatePicker, InputText, Select], templateUrl: './ui-field.html', styleUrl: './ui-field.scss' })
export class UiField {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly required = input(false);
  readonly kind = input<'text' | 'select' | 'date'>('text');
  readonly options = input<readonly string[]>([]);
  readonly selectOptions = computed(() => [...(this.options().length ? this.options() : [this.value()])]);
  readonly dateValue = computed(() => {
    const [month, day, year] = this.value().split('/').map(Number);
    return new Date(year, month - 1, day);
  });
}
