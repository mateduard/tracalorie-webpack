import '@fortawesome/fontawesome-free/js/all';
import { Modal, Collapse } from 'bootstrap';
import CalorieTracker from './Tracker';
import {Meal, Workout} from './Item'; 
import Storage from './Storage'
import './css/bootstrap.css';
import './css/style.css';

class App {
    constructor() {
        this._tracker = new CalorieTracker();
        this._tracker.loadItems();
        this._tracker._render();
        this._loadEventListeners();
    }

    _loadEventListeners() {
        document.querySelector('#meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));
        document.querySelector('#workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));
        document.querySelector('#meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));
        document.querySelector('#workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));
        document.querySelector('#filter-meals').addEventListener('input', this._filterItems.bind(this, 'meal'));
        document.querySelector('#filter-workouts').addEventListener('input', this._filterItems.bind(this, 'workout'));
        document.querySelector('#reset').addEventListener('click', this._resetDay.bind(this));
        document.querySelector('#limit-form').addEventListener('submit', this._setLimit.bind(this));
    }

    _newItem(type, e) {
        e.preventDefault();
        const name = document.querySelector(`#${type}-name`);
        const calories = document.querySelector(`#${type}-calories`);

        if (name.value === '' || calories.value === '') {
            alert('Please fill in all fields');
        }
        else {
            if (type === 'meal') {
                const meal = new Meal(name.value, +calories.value);
                this._tracker.addMeal(meal);
            }
            else {
                const workout = new Workout(name.value, +calories.value);
                this._tracker.addWorkout(workout);
            }
            name.value = '';
            calories.value = '';
            const collapse = document.querySelector(`#collapse-${type}`);
            const bsCollapse = new Collapse(collapse, {
                toggle: true,
            });
        }
    }

    _removeItem(type, e) {
        if ((e.target.tagName === 'BUTTON') || (e.target.tagName === 'I')) {
            if (confirm('Are you sure?')) {
                const id = e.target.closest('.card').getAttribute('data-id');

                type === 'meal' ? this._tracker._removeMeal(id) : this._tracker._removeWorkout(id);

                e.target.closest('.card').remove();
                this._tracker._render();
            }
        }
    }

    _filterItems(type, e) {
        const items = document.querySelectorAll(`#${type}-items div div div h4`);
        for (const elem of items) {
            if (!(elem.innerHTML.toLowerCase().includes(e.target.value.toLowerCase()))) {
                elem.closest('.card').classList.add('hidden');
            }
            else {
                elem.closest('.card').classList.remove('hidden');
            }
        }
    }

    _resetDay() {
        this._tracker._meals = [];
        this._tracker._workouts = [];
        this._tracker._totalCalories = 0;
        Storage.clearAll();
        document.querySelector('#meal-items').innerHTML = '';
        document.querySelector('#workout-items').innerHTML = '';
        document.querySelector('#filter-meals').value = '';
        document.querySelector('#filter-workouts').value = '';

        this._tracker._render();
    }

    _setLimit(e) {
        e.preventDefault();
        if (document.querySelector('#limit').value === '') {
            alert('Please insert a valid limit');
            return;
        }
        this._tracker._calorieLimit = +document.querySelector('#limit').value;
        Storage.setCalorieLimit(+document.querySelector('#limit').value);
        document.querySelector('#limit').value = '';
        this._tracker._displayCalorieLimit();
        this._tracker._render();

        const modalEl = document.getElementById('limit-modal');
        const modal = Modal.getInstance(modalEl);
        modal.hide();
    }
};

const app = new App();