var app = angular.module('Volunpeer');

app.filter('displayVolunteerSelectedTime', function (amDateFormatFilter) {
  return function(selectedStartTime, selectedEndTime){
//    return $sce.trustAsHtml(captionText.replace(/#(\S*)/g,'<a href="http://twitter.com/#!/search/$1">#$1</a>'))
    var formattedSelectedTime;
    if (!selectedStartTime){
      formattedSelectedTime = "All day";
    } else {
      var formattedStartTime = amDateFormatFilter(selectedStartTime,'h:mm a');
      var formattedEndTime = amDateFormatFilter(selectedEndTime,'h:mm a');
      formattedSelectedTime = formattedStartTime + "-" + formattedEndTime;
    }

    return formattedSelectedTime
  }
})

  .filter('displayOpportunityTimeRange', function(amDateFormatFilter){
    return function(selectedStartTime, selectedEndTime){
      var formattedSelectedTime;

      if (!selectedStartTime || !selectedEndTime){
        formattedSelectedTime = undefined;
      } else {
        var formattedStartTime = amDateFormatFilter(selectedStartTime,'h:mmA').replace(':00', '');
        var formattedEndTime = amDateFormatFilter(selectedEndTime,'h:mmA').replace(':00', '');

        formattedSelectedTime = formattedStartTime + "-" + formattedEndTime;
      }

      return formattedSelectedTime
    }
  })

  .filter('displayOpportunityDateRange', function(amDateFormatFilter){
    return function(selectedStartDate, selectedEndDate){
      var formattedSelectedDate;

      if (!selectedStartDate && !selectedEndDate){
        formattedSelectedDate = undefined;
      } else {
        var formattedStartDate = amDateFormatFilter(selectedStartDate,'ddd. M/D');
        var formattedEndDate = amDateFormatFilter(selectedEndDate,'ddd. M/D');

        formattedSelectedDate = formattedStartDate;
        if (formattedStartDate !== formattedEndDate){
          formattedSelectedDate += ' - ' + formattedEndDate;
        }
      }

      return formattedSelectedDate
    }
  })
  .filter('removeMinusSign', function(){
      return function(number){
       return number * -1
      }
  });

