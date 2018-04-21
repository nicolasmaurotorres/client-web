import { createConfirmation } from 'react-confirm';
 
export default function(modal,title,message = {} ) {
  // You can pass whatever you want to the component. These arguments will be your Component's props
  debugger;
  return createConfirmation(modal)({title,message});
}