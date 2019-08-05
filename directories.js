// COMMANDS

// CREATE >depth
// LIST :depth list
// MOVE
// DELETE

let directories = {};

const interpretCommand = (cmd)=>{
  let [command, arg0, arg1]= cmd.split(' ');
  command = command.toLowerCase();
  switch(command){
    case "create":
      createDirectory(arg0);
      break;
    case "move":
      moveDirectory(arg0, arg1);
      break;
    case 'list':
      listDirectories();
      break;
    case 'delete':
      deleteDirectory(arg0);
      break;
    default:
      throw new Error(`Unknown command: \`${command}\``);
  }
}


const parseString = str => {
  return str.split('/');
}
const createDirectory = str => {
  let current = directories;
  let create_path = parseString(str);
  let create_me = create_path.pop();
  for(let item of create_path){
    if(!current.hasOwnProperty(item)){
      current[item] = {};
    }
    current = current[item];
  }
  current[create_me]={};
}
const listDirectories = () =>{
  traverse = (current = null, depth = 0)=>{
    if(current == null){
      return;
    }
    else{
      for (const item of Object.keys(current)) {    
        console.log(' '.repeat(depth)+item);
        traverse(current[item], depth + 1);
      }
    };
    return;
  }
  traverse(directories, 0);
}
const moveDirectory = (src, dest) =>{
  let src_path = parseString(src);
  let dest_path = parseString(dest);
  let temp = directories;
  let last_context = directories;
  let last_key = null;
  
  for(let item of src_path){
    if(temp.hasOwnProperty(item)){
      last_key = item;
      last_context = temp;
      temp = temp[item];
    }
    else{
      throw new Error("Unknown property `"+item+"` in directories")
      return;
    }
  }
  let dest_mark = directories;
  if(dest == '.' || dest == '/'){
    directories[last_key]=temp;
  }
  else{
    for(let item of dest_path){
      if(!dest_mark.hasOwnProperty(item)){
        dest_mark[item] = {};
      }
      dest_mark = dest_mark[item];
    }
    Object.assign(dest_mark, temp);
  }
  delete last_context[last_key];
}
const deleteDirectory = (path) => {
  dir_path = parseString(path);
  target = dir_path.pop();
  let temp = directories;
  if(dir_path.length == 0){
    delete temp[target];
    return;
  }
  for(let item of dir_path){
    if(temp.hasOwnProperty(item)){
      temp = temp[item];
    }
    else{
      throw new Error("Unknown property `"+item+"` in directories");
    }
  }
  delete temp[target];
}

interpretCommand("CREATE feline/housecat");
interpretCommand("CREATE feline/tiger");
interpretCommand("CREATE feline/canine");

interpretCommand("CREATE feline/canine/dog");
interpretCommand("CREATE feline/canine/wolf");
console.log("----");
interpretCommand("LIST");

console.log("----");
interpretCommand("MOVE feline/canine .");
interpretCommand("LIST");