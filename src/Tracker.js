import Storage from './Storage';

class CalorieTracker {
    constructor() {
        this._calorieLimit = Storage.getCalorieLimit(1300);  // Optional: default value as function argument
        this._totalCalories = Storage.getTotalCalories();
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        window.addEventListener('resize', () => { this._updateProgress(); });
        this._displayCalorieLimit();
        document.querySelector('#limit').value = this._calorieLimit;
    }
    get _displayCalorieLimit() {
        return this._calorieLimit;
    }
    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.saveMeal(meal);
        this._render();
        this._displayNewMeal(meal);
    }
    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.saveWorkout(workout);
        this._render();
        this._displayNewWorkout(workout);
    }
    _displayCaloriesTotal() {
        const totalCaloriesEl = document.querySelector('#calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories;

    }
    _displayCalorieLimit() {
        const calLimitEl = document.querySelector('#calories-limit');
        calLimitEl.innerHTML = this._calorieLimit;
    }
    _displayCaloriesConsumed() {
        const caloriesConsumed = document.querySelector('#calories-consumed');
        let sumOfCalories = 0;
        this._meals.forEach(meal => sumOfCalories += meal.calories);
        caloriesConsumed.innerHTML = sumOfCalories;
    }
    _displayCaloriesBurned() {
        const caloriesBurned = document.querySelector('#calories-burned');
        let sumOfCalories = 0;
        this._workouts.forEach(workout => sumOfCalories += workout.calories);
        caloriesBurned.innerHTML = sumOfCalories;
    }
    _displayCaloriesRemaining() {
        const caloriesRemaining = document.querySelector('#calories-remaining');
        const dif = this._calorieLimit - this._totalCalories;
        caloriesRemaining.innerHTML = dif;

        if (dif < 0) {
            caloriesRemaining.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemaining.parentElement.parentElement.classList.add('bg-danger');
            document.querySelector('#calorie-progress').classList.remove('bg-success');
            document.querySelector('#calorie-progress').classList.add('bg-danger');
        } else {
            caloriesRemaining.parentElement.parentElement.classList.remove('bg-danger');
            caloriesRemaining.parentElement.parentElement.classList.add('bg-light');
            document.querySelector('#calorie-progress').classList.remove('bg-danger');
            document.querySelector('#calorie-progress').classList.add('bg-success');
        }
    }
    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._updateProgress();
    }
    _updateProgress() {
        const progressWrapper = document.querySelector('.progress');
        const progressBar = document.querySelector('#calorie-progress');
        if (this._totalCalories < 0) {
            progressBar.style.width = '0';
        } else {
            progressBar.style.width = `${(this._totalCalories / this._calorieLimit) * progressWrapper.clientWidth}px`;
        }
    }
    _displayNewMeal(meal) {
        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', `${meal.id}`);
        mealEl.innerHTML = `
        <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${meal.name}</h4>
                <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
                  ${meal.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
        `

        document.querySelector('#meal-items').appendChild(mealEl);
    }
    _displayNewWorkout(workout) {
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', `${workout.id}`);
        workoutEl.innerHTML = `
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${workout.name}</h4>
                <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">
                  ${workout.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          </div>
        `

        document.querySelector('#workout-items').appendChild(workoutEl);
    }

    _removeMeal(id) {
        for (const index in this._meals) {
            if (this._meals[index].id === id) {
                this._totalCalories -= this._meals[index].calories;
                Storage.setTotalCalories(this._totalCalories);
                Storage.removeMeal(id);
                this._meals.splice(index, 1);
            }
        }
    }
    _removeWorkout(id) {
        for (const index in this._workouts) {
            if (this._workouts[index].id === id) {
                this._totalCalories += this._workouts[index].calories;
                Storage.setTotalCalories(this._totalCalories);
                Storage.removeWorkout(id);
                this._workouts.splice(index, 1);
            }
        }
    }

    loadItems() {
        for (const meal of this._meals) {
            this._displayNewMeal(meal);
        }
        for (const workout of this._workouts) {
            this._displayNewWorkout(workout);
        }
        this._render();
    }
};

export default CalorieTracker;