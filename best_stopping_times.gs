function best_stopping_times() {
    
  var start = new Date();
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  var ui = SpreadsheetApp.getUi();
  
  //var T = ui.prompt('T = ').getResponseText();
  var T = 5990;
  console.log('berechnung start');
  
  var sheet = spreadsheet.getSheetByName('simply times');
  var stoppingSheet = spreadsheet.getSheetByName('stopping_times');
  
  var times = sheet.getRange(2,2,sheet.getLastRow() - 1, sheet.getLastColumn() - 1).getValues();
  
  //calculate best possible time
  var sum_of_best = 0;
  
  for(var split = 0; split < times[0].length; split++){
    
    sum_of_best += times[0][split];
    
  }
  
  var possible_timeloss = T - sum_of_best;
  
  //calculate min/max stopping time
  var stopping_times = [];
  var time = 0;
  
  for(var split = 0; split < times[0].length; split++){
    
    time += times[0][split];
    
    stopping_times[split] = {
      min : time, 
      max : (time + possible_timeloss)
    };
    
    //if(times[times.length - 1][split] - times[0][split] < possible_timeloss) stopping_times[split].max = time + times[times.length - 1][split] - times[0][split];
    
  }
  
  var stopping_times_test = [];
  var shift = 0;
  var lambda = 0.4;
  
  for(var split = 0; split < times[0].length; split++){
    
    //stopping_times_test.push((1 - (times[0].length / (split + 1))) * stopping_times[split].min + (times[0].length / (split + 1)) * stopping_times[split].max);
    stopping_times_test.push(Math.ceil(stopping_times[split].min + (stopping_times[split].min / sum_of_best) * (possible_timeloss - shift) + shift));
    //stopping_times_test.push(stopping_times[split].max);
    
  }
  
  console.time('result');
  var max_attempt_time = 20000000000;
  var result = test_stopping_time(stopping_times_test, times, T, max_attempt_time);
  console.timeEnd('result');
  
  console.log(result);
  
  stoppingSheet.getRange(1, 1, [stopping_times_test].length, stopping_times_test.length).setValues([stopping_times_test]);
  
  //SpreadsheetApp.getUi().alert(result.time);
  
}
