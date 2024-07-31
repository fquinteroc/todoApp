import {signal,  Component, computed, effect, Injector, inject} from '@angular/core';

import {Task} from './../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  filter = signal<'all' | 'pending' | 'completed'>('all');
  taskByFilters = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    if (filter === 'pending') {
      return tasks.filter(task => !task.completed);
    }
    if (filter === 'completed') {
      return tasks.filter(task => task.completed);
    }
    return tasks;
  })

  newTaskControl =  new FormControl('',{
    nonNullable: true,
    validators:[
      Validators.required,
    ]
  });

  injector = inject(Injector);  
  //se ejecuta antes de que inicie el programa
  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if(storage){
      const tasks = (JSON.parse(storage));
      this.tasks.set(tasks);
    }
    this.trackTasks();
  }

  trackTasks(){
    effect(() => {
      const tasks = this.tasks(); 
      localStorage.setItem('tasks', JSON.stringify(tasks));
      console.log(tasks);
    }, {injector: this.injector});
  }

  changeHandler() {
    if (this.newTaskControl.valid){
      const value = this.newTaskControl.value.trim();
      if(value !== ''){
        this.addTask(value);
        this.newTaskControl.setValue('');    
      }
    }
  }

  addTask(title: string) {
    const newTask: Task = { 
      id: Date.now(),
      title,
      completed: false
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }
  deleteTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((task,position) => position !== index));
  }

  updateTask(index: number) {
    this.tasks.update((tasks) =>  {
      return tasks.map((task,position) => {
        if(position === index) {
          return {
            ...task,
            completed: !task.completed
          };
        }
        return task;
      })
    });
  }

  updateTaskEditingMode(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task,position) => {
        if(position === index) {
          return {
            ...task,
            editing: true
          };
        }
        return{
          ...task,
          editing: false
        }
      })
    });
  }

  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((tasks) => {
      return tasks.map((task,position) => {
        if(position === index) {
          return {
            ...task,
            title: input.value,
            editing: false
          };
        }
        return task;
      })
    });
  }

  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter);
  }
}
