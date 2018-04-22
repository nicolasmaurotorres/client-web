import { createConfirmation } from 'react-confirm';
 
export default function(modal,title,message = {} ) {
  return createConfirmation(modal)({title,message});
}