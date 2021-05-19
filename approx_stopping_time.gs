function approx_stopping_time() {
  
  var start = new Date();
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  var ui = SpreadsheetApp.getUi();
  
  //var T = ui.prompt('T = ').getResponseText();
  var T = 5990;
  console.log('berechnung start');
  
  var sheet = spreadsheet.getSheetByName('simply times');
  var stoppingSheet = spreadsheet.getSheetByName('stopping_times');
  
  var times = sheet.getRange(2,2,sheet.getLastRow() - 1, sheet.getLastColumn() - 1).getValues();
  
  var path_time = 0;
  
  var total_time = 0;
  
  var good_paths = [];
  var bad_paths = [];
  
  var pathcount = 0;
  
  var counter = 0;
  
  var N = 10000;
  
  var sum_N = 0;
  var max_sum_N = 1000000;
  var max_counter = 1000;
  
  var finished = false;
  
  //count N paths that finish in less than T
  
  while(finished == false){
    
    sum_N += N;
    var now = new Date();
    
    for(var attempt = 0; attempt < N; attempt++){
      
      //generate random path path
      var path = [];
      for(var split = 0; split < times[0].length; split++){
        
        var rand_number = Math.round(Math.random() * Math.floor(times.length - 1));
        path.push(rand_number);
        
      }
      
      path_time = calc_time(path, times);
      
      total_time += path_time;
      
      if(path_time < T){
        
        counter++;
        good_paths.push(path);
        
      } else {
        
        //bad_paths.push(path);
        
      }
      
    }
    
    if((counter < max_counter)
       && (sum_N < max_sum_N)
      ){
      
      N *= 1.5;
      N = Math.round(N);
      
    } else {
      
      finished = true;
      
    }
    
    //console.log('sum_N: ' + sum_N);
    //console.log('counter: ' + counter);
    
  }
  
  console.log('sum_N: ' + sum_N);
  console.log('counter: ' + counter);
  
  var percentage_count = 100 * counter / sum_N;
  
  percentage_count = Math.round(percentage_count);
  
  var average_time = total_time / counter;
  
  console.log('ungefähr ' + percentage_count + '% der Pfade sind schneller als T = ' + T);
  
  //stopping times
  
  var collection = [];
  var epsilon = 1;
  var attempt_count = 100000;
  var spread = 10;
  
  for(var i = 0; i < 1; i++){
    
    var stopping_times = [];
    var split_times = [];
    
    for(var split = 0; split < times[0].length; split++){
      
      var this_split = {};
      
      this_split.times = [];
      this_split.min = 0;
      this_split.max = 0;
      
      //find min/max times of the good paths at each split-step
      for(var index = 0; index < good_paths.length; index++){
        
        var path = good_paths[index];
        var time = calc_time(path.slice(0,split + 1), times);
        
        this_split.times.push(time);
        
        if(time < this_split.min || this_split.min == 0) this_split.min = time;
        if(time > this_split.max) this_split.max = time;
        
      }
      
      //test stopping times -> change intervall until size of intervall lass than epsilon
      while(this_split.max - this_split.min > epsilon){
        
        this_split.mid_low = (this_split.min * spread + this_split.max) / (spread + 1);
        this_split.mid_high = (this_split.min + this_split.max * spread) / (spread + 1);
        
        stopping_times.push(this_split.mid_low);
        var results_mid_lown = test_stopping_time(stopping_times, times, T, attempt_count);
        stopping_times.pop();
        
        stopping_times.push(this_split.mid_high);
        var results_mid_high = test_stopping_time(stopping_times, times, T, attempt_count);
        stopping_times.pop();
        
        if(results_mid_lown < results_mid_high) this_split.max = this_split.mid_high;
        if(results_mid_lown > results_mid_high) this_split.min = this_split.mid_low;
        
      }
      
      stopping_times.push(Math.ceil(this_split.max));
      //split_times.push(this_split);
      
    }
    
    collection.push(stopping_times);
    
    //console.log(stopping_times);
    //console.log('average time needed to finish a run in less than T: ' + test_stopping_time(stopping_times, times, T, 1000000));
    
  }
  
  //stoppingSheet.clear();
  stoppingSheet.getRange(stoppingSheet.getLastRow() + 1,1,collection.length,collection[0].length).setValues(collection);
  //console.log(collection);
  
}