//adds up the split-times for a certain path
function calc_time(path, times){
  
  var time = 0;
  
  for(var split = 0; split < path.length; split++){
    
    time += times[path[split]][split];
    
  }
  
  return time;
  
}