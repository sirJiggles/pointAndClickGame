core.DoorGenerator = function(doors){

    if(!core.sanityCheck([doors])){
        core.debug('Unable to insert doors when loading level, do not have all the constructor args', 'FATAL');
        return false;
    }

    this.doors = doors;
    this.insertDoors();
};

core.DoorGenerator.prototype.insertDoors = function(){
    for(var i = 0; i < this.doors.length; i++){
        // generate some dom content for the door
        var dom = '<a href="#" class="door down-'+this.doors[i].location[0]+' accross-'+this.doors[i].location[1]+'" data-level="'+this.doors[i].level+'" data-room="'+this.doors[i].room+'"></a>';
        // add it to the body
        $('#game-inner').append(dom);
    };

    // add the click events for all the doors
    $('.door').click(function(evt){
        evt.preventDefault();

        var requestedLvl = $(this).attr('data-level'),
            requestedRoom = $(this).attr('data-room');
    
        if(typeof core.state.unlocked[requestedLvl] === 'undefined' || typeof core.state.unlocked[requestedLvl][requestedRoom] === 'undefined'){
            core.debug('Tried to access resource with no unlock state', 'WARNING');
            return false;
        }

        // load the next room
        core.state.room.prepareRoom(requestedLvl, requestedRoom);

        return false;
    })
}