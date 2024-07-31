import { Component } from '@angular/core';
import {signal} from '@angular/core';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'Hola';
  tasks = signal([
    'Instalar el Angular CLI', 
    'Crear un nuevo proyecto',
    'Crear componentes',
  ]);
  Name = signal('Fabian');
  age = 25;
  disabled = true;
  img = 'https://w3schools.com/howto/img_avatar.png';

  person = signal({
    Name: 'fabian',
    age: 25,
    avatar: 'https://w3schools.com/howto/img_avatar.png'
  });

  colorControl = new FormControl();
  widthControl = new FormControl(50,{
    nonNullable: true,
  });
  nameControl = new FormControl('nicolas',{
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10)
    ]
  });

  constructor(){
    this.colorControl.valueChanges.subscribe((color) => {
      console.log(color);
    });
  }

  clickHandler() {
    alert('Hiciste click');
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.Name.set(newValue);
    console.log(event);
  }

  keydownHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  }

  changeAge(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState =>{
      return {
        ...prevState,
        age: parseInt(newValue,10)
      }
    });
  }

  changeName(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState =>{
      return {
        ...prevState,
        Name: newValue
      }
    });
  }
}

