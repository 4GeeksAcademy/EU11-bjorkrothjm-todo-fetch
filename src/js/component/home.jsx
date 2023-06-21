import React ,{ useState } from "react";

//include images into your bundle
//import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	const [inputValue, setInputValue] = useState(null);
	console.log(inputValue);

	const [todoArray, setTodoArray] = useState(["No tasks, add a task"]);
	console.log("Todo Array:", todoArray);

	const handleKeyDown = (event) => {
		console.log(event.key);
		if (event.key === "Enter"){
			todoArray[0] === "No tasks, add a task"
				? setTodoArray(todoArray.concat(inputValue).slice(1,todoArray.length+1))
				: setTodoArray(todoArray.concat(inputValue))
			
			// // Same as above (without checking first array item)
			// setTodoArray(previousState => {
			// 	return previousState.concat(inputValue);
			// })
			setInputValue("");
		};	
	};

	const removeItem = (index) => {
		console.log(todoArray, index);
		//todoArray.splice(index, 1) does not work to manipulate the state
		// need to use Filter - to filer out (=return) values 
		const updatedTodo = todoArray.filter((_, i) => i !== index);
		setTodoArray(updatedTodo);
	}

	return (
		<div>
			<h1 className="text-center">todos</h1>
			<div className="d-flex justify-content-center">
				<ul className="list-group w-50">
					<input className="list-style" type="text" onChange={e => setInputValue(e.target.value)} value={inputValue} onKeyDown={handleKeyDown} placeholder="What needs to be done?"/>
					{todoArray.map( (item, index) => {
						return <li className="list-group-item list-style" key={index}>{item} <button onClick={() => removeItem(index)}>x</button> </li>
					})
					}
					<li className="list-group-item list-style task-counter">{todoArray.length} items left</li>
				</ul>
			</div>
		</div>
	)
};

export default Home;