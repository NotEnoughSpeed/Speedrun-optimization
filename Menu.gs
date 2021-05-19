function onOpen() {
  
  var ui = SpreadsheetApp.getUi();
  
  ui.createMenu('Skripte')
      .addItem('Calc optimal stopping time', 'stopping_time')
      .addItem('Calc optimal stopping time (approx method)', 'approx_stopping_time')
      .addToUi();
}
