/*----------------This part is important because it adds a listener
with the event DOMContentLoaded, so that the listner only fires when all DOM
content are loaded, this means that we can put the script tag at the top of
html without worring the error that DOM elements are not loaded*/
document.addEventListener('DOMContentLoaded',()=>{
//to wrap up everything as a callback function for DOMContentLoaded


  const registrar = document.querySelector('#registrar');//select the registrar section in html
  const registrar_input = registrar.querySelector('input');

  const invited_list = document.querySelector('#invitedList');//this is the ul

  //---------------This part is to add the filter checkbox using js
  const filter_div = document.createElement('div');//this will be the container of our filter checkbox
  const filter_label = document.createElement('label');
  const filter_checkbox = document.createElement('input');

  const main_div = document.querySelector('.main');
  main_div.insertBefore(filter_div,invited_list);//put our filter div before the actual ul

  filter_label.textContent = "Hide those who haven't responded";
  filter_checkbox.type = "checkbox";

  filter_label.appendChild(filter_checkbox);
  filter_div.appendChild(filter_label);
  //---------------------------------------------------end



  //creates the li with whole package including text, checkbox, remove button
  const create_li = (item)=>{//function to create a new li using  item
    const create_Element = (elementName,property,value)=>{//helper function to help creating diffrerent elements avoid repeats
      const element = document.createElement(elementName);
      element[property] = value;
      return element;
    };
    const assign_property =(element,property,value)=>{//helper funtion to help assigning properties
      element[property] = value;
      return element;
    };
    const append_Child = (a,b)=>{
       a.appendChild(b);
    };

    const li = create_Element('li','className','not_responded');/*this is for our filter checkbox, set all initial li to not responded
                                     since no one clicked the check boxes yet*/

    const span = create_Element('span','textContent',item);
    append_Child(li,span);

    const label = create_Element('label','textContent',"Confirmed");
    append_Child(li,label);

    const checkbox = create_Element('input','type','checkbox');
    assign_property(checkbox,'className','checkbox_li');
    append_Child(label,checkbox);

    const edit_button = create_Element('button','textContent','Edit');
    assign_property(edit_button,'className','edit_button');
    append_Child(li,edit_button);

    const remove_button = create_Element('button','textContent','Remove');
    assign_property(remove_button,'className','remove_button');
    append_Child(li,remove_button);

    return li;
  };


  const hide_non_confirm = ()=>{//this function will hide all names that are not confirmed by the checkbox
     const non_confirm = invited_list.querySelectorAll('.not_responded');
     for(let i = 0; i < non_confirm.length; i+=1){
       non_confirm[i].style.display = 'none';
     }
  };

  const show_both = ()=>{//this function will show all names regardless of their confirmed status
    const non_confirm = invited_list.querySelectorAll('.not_responded');
    for(let i = 0; i < non_confirm.length; i+=1){
      non_confirm[i].style.display = 'block';
    }
  };

  registrar.addEventListener('submit',(e)=>{//submit event is only used for forms
    //The default event for a form submition is to refresh the page
    //However we dont want to send this to a remote server so we can use the Event.preventDefault() method
      e.preventDefault();//prevent the default refreshing page
      const li = create_li(registrar_input.value);
      invited_list.appendChild(li);
      registrar_input.value = '';
  });

  //use the change event for li_checkbox checks
  invited_list.addEventListener('change',(e)=>{
       //console.log(e.target);
       const checkbox = e.target;
       const checked = checkbox.checked;
       const listItem = checkbox.parentNode.parentNode;
       if(checked){
         listItem.className = 'responded';
       }else{
         listItem.className = 'not_responded';
       }
  });

  //use the change event for filter_checkbox checks
  filter_div.addEventListener('change',(e)=>{
       //console.log(e.target);
       const checkbox = e.target;
       const checked = checkbox.checked;
       if(checked){//hide the non-confirmed name
         hide_non_confirm();
       }else{
         show_both();
       }
  });

  //event listners for the buttons attached to each li item
  invited_list.addEventListener('click',(e)=>{
      if(e.target.tagName === "BUTTON"){
        const button = e.target;
        const li = button.parentNode;
        const nameActions = {//this object is used to store 3 functions for the button event handler
          remove: ()=>{//remove the li item from ul
              const parent = li.parentNode;
              parent.removeChild(li);
          },
          edit: ()=>{//edit the name and change the edit button to save button
              const span = li.querySelector(':nth-child(1)')//fist child from li
              const input = document.createElement('input');
              input.type = 'text';
              input.value = span.textContent;
              li.insertBefore(input,span);//put the textfield before the span
              li.removeChild(span);//remove the span
              button.textContent = "Save";//replace the edit button with save
              button.className = "save_button";
          },
          save: ()=>{//save the edit name, like a reverse to edit_li function
               const input = li.querySelector(':nth-child(1)')//fist child from li
               const span = document.createElement('span');
               span.textContent = input.value;
               li.insertBefore(span,input);
               li.removeChild(input);
               button.textContent = "Edit";//replace the save button with edit
               button.className = "edit_button";
          }
        };//end of the nameAction object



        if(button.className ==="remove_button"){
          nameActions.remove();
       }else if(button.className ==="edit_button"){
          nameActions.edit();
       }else if(button.className ==="save_button"){
          nameActions.save();
       }
      }
   });
});//to wrap up everything as a callback function for DOMContentLoaded
