class Storage {
    static getCalorieLimit(defaultLimit = 2000) {
        if (localStorage.getItem('calorieLimit') === null) {
            return defaultLimit;
        } else {
            return +localStorage.getItem('calorieLimit');
        }
    }

    static setCalorieLimit(calorieLimit) {
        localStorage.setItem('calorieLimit', calorieLimit);
    }

    static getTotalCalories() {
        if (localStorage.getItem('totalCalories') === null) {
            return 0;
        } else {
            return +localStorage.getItem('totalCalories');
        }
    }

    static setTotalCalories(totalCalories) {
        localStorage.setItem('totalCalories', totalCalories);
    }

    static getMeals() {
        let meals;
        if (localStorage.getItem('meals') !== null) {
            meals = JSON.parse(localStorage.getItem('meals'));
        } else {
            meals = [];
        }
        return meals;
    }

    static saveMeal(meal) {
        const meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static removeMeal(id){
        const meals = Storage.getMeals();
        for(const index in meals){
            if(meals[index].id === id){
                meals.splice(index, 1);
            }
        }
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static removeWorkout(id){
        const workouts = Storage.getWorkouts();
        for(const index in workouts){
            if(workouts[index].id === id){
                workouts.splice(index, 1);
            }
        }
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static getWorkouts() {
        let workouts;
        if (localStorage.getItem('workouts') === null) {
            workouts = [];
        } else {
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }
        return workouts;
    }

    static saveWorkout(workout) {
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static clearAll(){
        localStorage.removeItem('meals');
        localStorage.removeItem('workouts');
        localStorage.removeItem('totalCalories');
    }
};

export default Storage;