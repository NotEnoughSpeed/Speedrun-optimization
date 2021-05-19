/*
stopping_times    array of stopping times for each split
times             2-dimensional array of split times
attempt_count     number of successfull attempts we want to get
*/
function test_stopping_time(stopping_times, times, T, max_attempt_time) {
  
  var pb_counter = 0;
  var total_counter = 0;
  var attempt_time = 0;
  var total_time = 0;
  
  while(total_time + attempt_time < max_attempt_time){
    
    total_counter++;
    var path = [];
    
    for(var split = 0; split < times[0].length; split++){
      
      var rand_number = Math.round(Math.random() * Math.floor(times.length - 1));
      path.push(rand_number);
      
      //see if we need to stop
      if(split < stopping_times.length){
        
        if(calc_time(path, times) > stopping_times[split]) break;
        
      }
      
    }
    
    attempt_time += calc_time(path, times);
    
    if(path.length == times[0].length && calc_time(path, times) < T){
      
      pb_counter++;
      total_time += attempt_time;
      attempt_time = 0;
      
    }
    
  }
  
  if(pb_counter == 0) return attempt_time;
  
  return {time: (total_time / pb_counter), total_attempts: total_counter, pb_attempts: pb_counter};
  
}
