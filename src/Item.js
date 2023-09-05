class Meal {
    constructor(name, calories) {
        this.id = (Date.now() + Math.floor(Math.random() * 100)).toString(16);
        this.name = name;
        this.calories = calories;
    }
};

class Workout {
    constructor(name, calories) {
        this.id = (Date.now() + Math.floor(Math.random() * 1000)).toString(16);
        this.name = name;
        this.calories = calories;
    }
};

export { Meal, Workout };