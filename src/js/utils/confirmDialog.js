import { createConfirmation } from 'react-confirm';
import DialogForm from '../components/forms/DialogForm';
 
// create confirm function
const confirm = createConfirmation(DialogForm);
 
// This is optional. But I recommend to define your confirm function easy to call.
export default function(title,message = {} ) {
  // You can pass whatever you want to the component. These arguments will be your Component's props
  return confirm({title,message});
}