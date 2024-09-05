
const Engine = function(time_step, update, render) {

    this.accumulated_time = 0; // Amount of time accumalted from last update
    this.animation_frame_request = undefined; // reference to AFR
    this.time = undefined; // most recent timestamp of loop execution
    this.time_step = time_step; // 1000/30 = 30 frames per second

    this.updated = false; // has update function been called since last cycle
    
    this.update = update; // update function
    this.render = render; // render function

    this.run = function(time_stamp) { // this is one cycle of the game loop
        this.accumulated_time += time_stamp - this.time;
        this.time = time_stamp;

        if (this.accumulated_time >= this.time_step*3) {
            this.accumulated_time = this.time_step;
        }
    
        while(this.accumulated_time >= this.time_step) {
            this.accumulated_time -= this.time_step;
            this.update(time_stamp);
            this.updated = true; // if the game has updated, we need to draw it again
        }

        //this allows us to only draw when the game has updated
        if (this.updated) {
            this.updated = false;
            this.render(time_stamp);
        }

        this.animation_frame_request = window.requestAnimationFrame(this.handleRun);
    }

    this.handleRun = (time_step) => { this.run(time_step); }
}

Engine.prototype = {
    constructor : Engine,
    start:function() {
        this.accumulated_time = this.time_step;
        this.time = window.performance.now();
        this.animation_frame_request = window.requestAnimationFrame(this.handleRun);
    },
    stop:function() { window.cancelAnimationFrame(this.animation_frame_request); }
}