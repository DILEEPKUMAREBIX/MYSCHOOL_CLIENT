import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timetablefilter'
})
export class TimetablefilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }


 /* return function(col, header) {
    if (!col ){
      return "Empty";
    } 
    if (!header){
      return "Empty"; 
    }
    
    console.log(col)
    var returnVal="Empty Item";
    angular.forEach(col, function(colItem){
     if(header===colItem.Y) {
      returnVal = colItem.M+" "+colItem.Y;
    }
     
   });
   
   return returnVal;
   
  }*/
}
