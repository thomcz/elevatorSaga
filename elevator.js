{
    init: function init(elevators, floors) {
        console.clear();

        const debug = 'Hello'
        console.log(debug)

        const e = elevators[0]; // Let's use the first elevator

        // event if elevator is doing nothing...
        e.on("idle", idle);

        function idle() {
            e.goToFloor(0);
        }

        class FloorButtonPressedStateHandler {
            e;
            constructor(e) {
                this.e = e;
            }
            run(floorNum) {
                this.e.goToFloor(floorNum);
            }
        }
        var stateHandler = new FloorButtonPressedStateHandler(e)
        e.on("floor_button_pressed", stateHandler.run);

        e.on("passing_floor", function (floorNum) {
            let p = e.getPressedFloors();
            // if we're going in the same direction as the button, we can stop
            if (p.indexOf(floorNum) >= 0) {
                // remove this floor from destinations
                e.destinationQueue = e.destinationQueue.filter((d) => (d !== floorNum));
                e.checkDestinationQueue();

                e.goToFloor(floorNum, true);
            }

        });

        floors.forEach(function (floor) {
            // floor button pressed on floor
            floor.on("up_button_pressed down_button_pressed", function () {
                e.goToFloor(floor.floorNum());
            });
        });
    },
    update: function update(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}