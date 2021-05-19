function stopping_time() {
  
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  var ui = SpreadsheetApp.getUi();
  
  var T = ui.prompt('T = ').getResponseText();
  //var T = 13;
  console.log('berechnung start');
  
  var sheet = spreadsheet.getSheetByName('simply times');
  
  var times = sheet.getRange(2,1,sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  
  var paths = [];
  
  var pathcount = 0;
  
  var path = [];
  
  //count paths that finish in less than T
  
  //iteration start path = [0,0,0,...,0,0];
  
  for(var split = 0; split < times[0].length; split++){
    
    path.push(0);
    
  }
  
  var finished = false;
  
  while(finished == false){
    
    //calculate time for that path
    var time = calc_time(path, times);
    
    //if time < T that path gets added to paths and path becomes the next path
    if(time < T){
      
      //paths.push(path);
      pathcount++;
      //console.log(path);
      path[path.length - 1]++;
      
    }
    
    //if time >= T we go to the next path that can be faster
    if(time >= T){
      
      for(var index = path.length - 1; index >= 0; index--){
        
        if(index == 0){
          
          finished = true;
          break;
          
        }
        
        if(path[index] == 0) continue;
        
        if(path[index] > 0){
          
          path[index] = 0;
          path[index - 1]++;
          break;
          
        }
        
      }
      
    }
    
    //if some split-index of the path is too big the previous splits get changed
    for(var index = path.length - 1; index > 0; index--){
      
      if(path[index] == times.length){
        
        path[index] = 0;
        
        //change this step to binary search?
        path[index  - 1]++;
        
      }
      
    }
    
    //if first split-index of the path is goo big we are finished
    if(path[0] == times.length) finished = true;
    
  }
  
  var percentage_count = pathcount;
  
  for(var index = 0; index < times[0].length; index++){
    
    percentage_count /= times.length;
    
  }
  
  console.log('es gibt ' + pathcount + ' Pfade die schneller als T = ' + T + ' sind. ' + percentage_count + '%');
  ui.alert('es gibt ' + pathcount + ' Pfade die schneller als T = ' + T + ' sind. ' + percentage_count + '%');
  
  
}

