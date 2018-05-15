'use strict'

console.log('hello');

// document.getElementById('logSuggestedBtn').addEventListener("click", () => {
//   var forms= document.getElementsByTagName("form");
  
//   for(let i=0;i<forms.length;i++){
//     console.log(forms[i]);
//       // forms[i].submit();
//   }

//   });

$('#logSuggestedBtn').on('click', event => {
  let forms = $("form");
  console.log(forms);
});
